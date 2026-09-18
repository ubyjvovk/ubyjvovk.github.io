export type EnemyKind = 'drone' | 'skimmer' | 'gunship';
export type Drone = { x: number; y: number; phase: number; kind: EnemyKind; hp: number; fireIn: number; dead?: boolean };
export type Shot = { x: number; y: number; previousX?: number; dead?: boolean };
export type Boss = { x: number; y: number; hp: number; maxHp: number; age: number;
  spawnIn: number; fireIn: number; wave: number; kind: 'carrier' | 'destroyer' };
export type Bolt = Shot & { vx: number; vy: number };
export type Passage = { x: number; width: number; gapY: number; gapHeight: number; style: number };
export type Flight = {
  width: number; height: number; x: number; y: number; elapsed: number;
  distance: number; score: number; shields: number; cooldown: number;
  invulnerable: number; spawnIn: number; shots: Shot[]; drones: Drone[];
  bolts: Bolt[]; passages: Passage[]; passageIn: number; enemyCount: number;
  boss: Boss | null; nextBossAt: number; bossWave: number;
};
export function newFlight(width: number, height: number): Flight {
  return { width, height, x: Math.min(32, width / 4), y: height / 2,
    elapsed: 0, distance: 0, score: 0, shields: 3, cooldown: 0,
    invulnerable: 0, spawnIn: 1, shots: [], drones: [], bolts: [],
    passages: [], passageIn: 300, enemyCount: 0, boss: null, nextBossAt: 45, bossWave: 0 };
}
// A continuous, noticeable acceleration which eases towards a playable ceiling.
export function flightSpeed(elapsed: number) {
  return 60 + 52 * (1 - Math.exp(-Math.max(0, elapsed) / 65));
}
export function enemySize(kind: EnemyKind): [number, number] {
  return kind === 'gunship' ? [14, 10] : kind === 'skimmer' ? [11, 5] : [9, 7];
}
export function fireShot(game: Flight) {
  if (game.shields <= 0 || game.cooldown > 0) return;
  game.shots.push({ x: game.x + 11, y: game.y + 3 });
  game.cooldown = .18;
}
function overlaps(x: number, y: number, w: number, h: number, bx: number, by: number, bw: number, bh: number) {
  return x + w > bx && x < bx + bw && y + h > by && y < by + bh;
}
export function hitsPassage(p: Passage, x: number, y: number, w: number, h: number) {
  return x + w > p.x && x < p.x + p.width && (y < p.gapY || y + h > p.gapY + p.gapHeight);
}
function damage(game: Flight) {
  if (game.invulnerable > 0 || game.shields <= 0) return;
  game.shields--; game.invulnerable = 1.5;
}
export function stepFlight(game: Flight, input: Set<string>, seconds: number, random = Math.random) {
  if (game.shields <= 0) return;
  const dt = Math.min(Math.max(seconds, 0), .05);
  game.elapsed += dt;
  const speed = flightSpeed(game.elapsed);
  game.distance += speed * dt;
  const dx = Number(input.has('ArrowRight')) - Number(input.has('ArrowLeft'));
  const dy = Number(input.has('ArrowDown')) - Number(input.has('ArrowUp'));
  const length = Math.hypot(dx, dy) || 1;
  game.x = Math.max(3, Math.min(game.width - 14, game.x + dx / length * 65 * dt));
  game.y = Math.max(12, Math.min(game.height - 17, game.y + dy / length * 65 * dt));
  game.cooldown -= dt;
  game.invulnerable = Math.max(0, game.invulnerable - dt);
  if (input.has('Space')) fireShot(game);

  if (!game.boss && game.elapsed >= game.nextBossAt) {
    const wave = ++game.bossWave, hp = 18 + (wave - 1) * 6;
    game.boss = { x: game.width + 6, y: 32, hp, maxHp: hp, age: 0,
      spawnIn: 2, fireIn: 2.5, wave, kind: wave % 2 ? 'carrier' : 'destroyer' };
    // Open an arena instead of forcing the pilot through a tower during a boss fight.
    game.passages = []; game.drones = []; game.bolts = [];
  }
  // Distance-based spacing gives the pilot time to change altitude at any speed.
  game.passageIn -= speed * dt;
  if (game.passageIn <= 0 && !game.boss && game.nextBossAt - game.elapsed > 3) {
    const gapHeight = Math.max(23, 34 - game.elapsed * .08);
    game.passages.push({ x: game.width + 16, width: 16 + Math.floor(random() * 3) * 5,
      gapY: 16 + random() * (game.height - 34 - gapHeight), gapHeight, style: Math.floor(random() * 3) });
    game.passageIn = speed * (3.2 + random() * 1.2) + 30;
  }
  for (const p of game.passages) {
    p.x -= speed * dt;
    if (hitsPassage(p, game.x, game.y, 10, 6)) damage(game);
  }
  game.spawnIn -= dt;
  if (game.spawnIn <= 0 && !game.boss) {
    // Keep enemies out of the entrance to a passage: the gap must remain usable.
    if (!game.passages.some(p => p.x + p.width > game.width - 35 && p.x < game.width + 45)) {
      const kind = (['drone', 'skimmer', 'gunship'] as const)[game.enemyCount++ % 3];
      game.drones.push({ x: game.width + 10, y: 16 + random() * (game.height - 44),
        phase: random() * Math.PI * 2, kind, hp: kind === 'gunship' ? 3 : 1, fireIn: 1.2 });
    }
    game.spawnIn = Math.max(.9, 1.8 - game.elapsed * .006) + random() * .6;
  }
  for (const shot of game.shots) {
    const oldX = shot.x; shot.previousX = oldX;
    shot.x += (150 + speed * .3) * dt;
    if (game.passages.some(p => hitsPassage(p, oldX, shot.y, shot.x - oldX + 5, 1))) shot.dead = true;
  }
  for (const drone of game.drones) {
    const [w, h] = enemySize(drone.kind);
    const multiplier = drone.kind === 'skimmer' ? 1.55 : drone.kind === 'gunship' ? .7 : 1;
    drone.x -= speed * multiplier * dt;
    drone.y += Math.sin(game.elapsed * (drone.kind === 'skimmer' ? 6 : 3) + drone.phase) * (drone.kind === 'skimmer' ? 28 : 8) * dt;
    drone.y = Math.max(12, Math.min(game.height - 18, drone.y));
    // No hidden enemies embedded in architecture.
    if (game.passages.some(p => p.x < drone.x + w + 10 && p.x + p.width > drone.x - 10)) drone.dead = true;
    for (const shot of game.shots) {
      if (!shot.dead && !drone.dead && overlaps(shot.previousX ?? shot.x, shot.y, shot.x - (shot.previousX ?? shot.x) + 5, 1, drone.x, drone.y, w, h)) {
        shot.dead = true; drone.hp--;
        if (drone.hp <= 0) { drone.dead = true; game.score += drone.kind === 'gunship' ? 300 : drone.kind === 'skimmer' ? 150 : 100; }
      }
    }
    if (!drone.dead && overlaps(game.x, game.y, 10, 6, drone.x, drone.y, w, h)) {
      drone.dead = true; damage(game);
    }
    drone.fireIn -= dt;
    if (!drone.dead && drone.kind === 'gunship' && drone.x < game.width - 4 && drone.x > game.x + 20 && drone.fireIn <= 0) {
      const dx = game.x - drone.x, dy = game.y - drone.y;
      const length = Math.hypot(dx, dy);
      game.bolts.push({ x: drone.x, y: drone.y + 4, vx: dx / length * 65, vy: dy / length * 65 });
      drone.fireIn = 1.7;
    }
  }
  const boss = game.boss;
  if (boss) {
    boss.age += dt;
    const targetX = Math.max(48, game.width - 38);
    boss.x += Math.sign(targetX - boss.x) * Math.min(Math.abs(targetX - boss.x), 40 * dt);
    boss.y = 32 + Math.sin(boss.age * 1.2) * 17;
    for (const shot of game.shots) {
      if (!shot.dead && overlaps(shot.previousX ?? shot.x, shot.y, shot.x - (shot.previousX ?? shot.x) + 5, 1, boss.x, boss.y, 28, 20)) {
        shot.dead = true; boss.hp--;
      }
    }
    if (overlaps(game.x, game.y, 10, 6, boss.x, boss.y, 28, 20)) damage(game);
    boss.spawnIn -= dt; boss.fireIn -= dt;
    const arrived = Math.abs(boss.x - targetX) < 1;
    if (arrived && boss.hp > 0 && boss.spawnIn <= 0) {
      const count = boss.kind === 'carrier' ? 2 : 1;
      for (let i = 0; i < count; i++) {
        game.drones.push({ x: boss.x - 12, y: Math.max(12, Math.min(game.height - 18, boss.y + (i ? 22 : -8))),
          kind: i ? 'skimmer' : 'drone', hp: 1, phase: random() * Math.PI * 2, fireIn: 1.2 });
      }
      boss.spawnIn = boss.kind === 'carrier' ? 2.8 : 4;
    }
    if (arrived && boss.hp > 0 && boss.fireIn <= 0) {
      const angle = Math.atan2(game.y + 3 - (boss.y + 10), game.x + 5 - boss.x);
      const spread = boss.kind === 'destroyer' ? [-.25, 0, .25] : [0];
      for (const offset of spread) game.bolts.push({ x: boss.x, y: boss.y + 10,
        vx: Math.cos(angle + offset) * 55, vy: Math.sin(angle + offset) * 55 });
      boss.fireIn = boss.kind === 'destroyer' ? 1.8 : 2.6;
    }
    if (boss.hp <= 0 || boss.age >= 30) {
      if (boss.hp <= 0) { game.score += 1500 * boss.wave; game.shields = Math.min(3, game.shields + 1); }
      game.boss = null; game.nextBossAt = game.elapsed + 45;
      game.drones = []; game.bolts = []; game.passageIn = speed * 3; game.spawnIn = 2;
    }
  }
  for (const bolt of game.bolts) {
    bolt.x += bolt.vx * dt; bolt.y += bolt.vy * dt;
    if (game.passages.some(p => hitsPassage(p, bolt.x, bolt.y, 3, 2))) bolt.dead = true;
    if (!bolt.dead && overlaps(game.x, game.y, 10, 6, bolt.x, bolt.y, 3, 2)) { bolt.dead = true; damage(game); }
  }
  game.shots = game.shots.filter(s => !s.dead && s.x < game.width + 10);
  game.drones = game.drones.filter(d => !d.dead && d.x > -16);
  game.bolts = game.bolts.filter(b => !b.dead && b.x > -5 && b.x < game.width + 5 && b.y > 0 && b.y < game.height);
  game.passages = game.passages.filter(p => p.x + p.width > -5);
}
