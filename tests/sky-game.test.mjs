import test from 'node:test';
import assert from 'node:assert/strict';
import { newFlight, stepFlight, fireShot, flightSpeed, hitsPassage } from '../src/lib/sky-game.ts';
const idle = new Set();
const drone = (props = {}) => ({ x: 100, y: 40, phase: 0, kind: 'drone', hp: 1, fireIn: 1.2, ...props });

test('arrow movement stays within the flight area, including diagonal motion', () => {
  const g = newFlight(120, 96); g.spawnIn = Infinity; g.passageIn = Infinity;
  for (let i = 0; i < 300; i++) stepFlight(g, new Set(['ArrowRight', 'ArrowUp']), .016, () => .5);
  assert.equal(g.x, 106); assert.equal(g.y, 12);
  for (let i = 0; i < 300; i++) stepFlight(g, new Set(['ArrowLeft', 'ArrowDown']), .016, () => .5);
  assert.equal(g.x, 3); assert.equal(g.y, 79);
});
test('Space fires, destroys a drone and awards points once', () => {
  const g = newFlight(200, 96); g.spawnIn = 100;
  g.drones = [drone({ x: g.x + 15, y: g.y })];
  stepFlight(g, new Set(['Space']), .016);
  assert.equal(g.score, 100); assert.equal(g.drones.length, 0); assert.equal(g.shots.length, 0);
  stepFlight(g, new Set(['Space']), .016);
  assert.equal(g.shots.length, 0); assert.equal(g.score, 100);
});
test('collisions cost a shield, with invulnerability to prevent stacked hits', () => {
  const g = newFlight(200, 96);
  g.drones = [drone({ x: g.x, y: g.y }), drone({ x: g.x + 2, y: g.y })];
  stepFlight(g, idle, .016);
  assert.equal(g.shields, 2); assert.ok(g.invulnerable > 0);
  stepFlight(g, idle, .016); assert.equal(g.shields, 2);
});
test('zero shields end simulation; restart creates a clean flight', () => {
  const g = newFlight(200, 96); g.shields = 0;
  const snapshot = structuredClone(g); stepFlight(g, new Set(['Space']), .05);
  assert.deepEqual(g, snapshot);
  const restart = newFlight(200, 96);
  assert.equal(restart.shields, 3); assert.equal(restart.score, 0); assert.equal(restart.shots.length, 0);
});
test('endless flight spawns enemies and removes offscreen objects', () => {
  const g = newFlight(200, 96); g.spawnIn = 0;
  g.shots = [{ x: 220, y: 10 }]; g.drones = [drone({ x: -20, y: 10 })];
  stepFlight(g, idle, .05, () => .5);
  assert.equal(g.shots.length, 0); assert.equal(g.drones.length, 1); assert.ok(g.distance > 0);
});

test('a quick fire tap shoots immediately and respects the fire rate', () => {
  const g = newFlight(200, 96);
  fireShot(g); fireShot(g);
  assert.equal(g.shots.length, 1);
  for (let i = 0; i < 4; i++) stepFlight(g, idle, .05);
  fireShot(g); assert.equal(g.shots.length, 2);
});

test('speed accelerates smoothly and remains playable on long runs', () => {
  assert.equal(flightSpeed(0), 60);
  assert.ok(flightSpeed(30) > 75);
  assert.ok(flightSpeed(90) > flightSpeed(30));
  assert.ok(flightSpeed(300) > flightSpeed(90));
  assert.ok(flightSpeed(3600) <= 112);
  assert.ok(flightSpeed(30.016) - flightSpeed(30) < .02);
});
test('a passage has a traversable gap and solid ceiling and floor', () => {
  const p = { x: 32, width: 20, gapY: 30, gapHeight: 25, style: 0 };
  assert.equal(hitsPassage(p, 34, 35, 10, 6), false);
  assert.equal(hitsPassage(p, 34, 25, 10, 6), true);
  assert.equal(hitsPassage(p, 34, 52, 10, 6), true);
  assert.equal(hitsPassage(p, 5, 20, 10, 6), false);
  const g = newFlight(200, 96); g.y = 25; g.passages = [p];
  stepFlight(g, idle, .016); assert.equal(g.shields, 2);
  stepFlight(g, idle, .016); assert.equal(g.shields, 2);
});
test('shots cannot pass through solid architecture', () => {
  const g = newFlight(200, 96);
  g.passages = [{ x: 60, width: 20, gapY: 30, gapHeight: 25, style: 0 }];
  g.shots = [{ x: 57, y: 20 }, { x: 57, y: 40 }];
  stepFlight(g, idle, .016);
  assert.equal(g.shots.length, 1); assert.equal(g.shots[0].y, 40);
});
test('procedural gaps stay reachable and leave reaction time at every speed', () => {
  for (const elapsed of [0, 60, 300]) for (const roll of [0, .5, .999]) {
    const g = newFlight(130, 96); g.elapsed = elapsed; g.nextBossAt = Infinity; g.passageIn = 0;
    stepFlight(g, idle, .016, () => roll);
    const p = g.passages[0];
    assert.ok(p.gapHeight >= 23 && p.gapHeight <= 34);
    assert.ok(p.gapY >= 12 && p.gapY + p.gapHeight <= 85);
    assert.ok(g.passageIn / flightSpeed(g.elapsed) >= 3.2);
    assert.ok(p.x > g.width);
  }
});
test('enemy spawns cycle through all three types', () => {
  const g = newFlight(200, 96);
  for (let i = 0; i < 3; i++) { g.spawnIn = 0; stepFlight(g, idle, .016, () => .5); }
  assert.deepEqual(g.drones.map(d => d.kind), ['drone', 'skimmer', 'gunship']);
});
test('skimmers fly faster and gunships survive two hits before awarding points', () => {
  const g = newFlight(200, 96); g.spawnIn = Infinity;
  g.drones = [drone({ x: 150 }), drone({ x: 150, kind: 'skimmer' })];
  stepFlight(g, idle, .016);
  assert.ok(g.drones[1].x < g.drones[0].x);
  g.drones = [drone({ x: 100, kind: 'gunship', hp: 3 })];
  for (let i = 0; i < 3; i++) {
    const target = g.drones[0];
    g.shots = [{ x: target.x, y: target.y + 3 }];
    stepFlight(g, idle, .016);
    assert.equal(g.score, i < 2 ? 0 : 300);
  }
  assert.equal(g.drones.length, 0);
});
test('gunships fire aimed bolts and bolts damage the player', () => {
  const g = newFlight(200, 96);
  g.drones = [drone({ x: 150, kind: 'gunship', hp: 3, fireIn: 0 })];
  stepFlight(g, idle, .016);
  assert.equal(g.bolts.length, 1); assert.ok(g.bolts[0].vx < 0);
  g.bolts = [{ x: g.x + 2, y: g.y + 2, vx: -1, vy: 0 }];
  stepFlight(g, idle, .016);
  assert.equal(g.shields, 2); assert.equal(g.bolts.length, 0);
});
test('enemies are not spawned in a passage entrance', () => {
  const g = newFlight(130, 96); g.spawnIn = 0;
  g.passages = [{ x: 130, width: 20, gapY: 30, gapHeight: 25, style: 0 }];
  stepFlight(g, idle, .016);
  assert.equal(g.drones.length, 0);
});

function summonBoss(width = 200, wave = 0) {
  const g = newFlight(width, 96); g.elapsed = 45; g.bossWave = wave;
  stepFlight(g, idle, .016, () => .5);
  return g;
}
test('boss arrives at 45 seconds and opens an obstacle-free arena', () => {
  const g = newFlight(200, 96); g.elapsed = 44.91;
  stepFlight(g, idle, .05); assert.equal(g.boss, null);
  g.passages = [{ x: 100, width: 20, gapY: 30, gapHeight: 25, style: 0 }];
  stepFlight(g, idle, .05);
  assert.equal(g.boss.kind, 'carrier'); assert.equal(g.boss.wave, 1);
  assert.equal(g.passages.length, 0); assert.equal(g.drones.length, 0);
});
test('carrier enters the screen and launches smaller enemies and shots', () => {
  const g = summonBoss(130); g.invulnerable = 100;
  for (let i = 0; i < 180; i++) stepFlight(g, idle, 1 / 60, () => .5);
  assert.ok(g.boss.x + 28 <= g.width);
  assert.ok(g.drones.length >= 1); assert.ok(g.bolts.length >= 1);
  assert.equal(g.passages.length, 0);
});
test('destroyer fires a three-shot spread', () => {
  const g = summonBoss(200, 1);
  g.boss.x = 162; g.boss.fireIn = 0;
  stepFlight(g, idle, .016);
  assert.equal(g.boss.kind, 'destroyer'); assert.equal(g.bolts.length, 3);
  assert.notEqual(g.bolts[0].vy, g.bolts[2].vy);
});
test('defeating a boss awards points, restores one shield and schedules the next wave', () => {
  const g = summonBoss(); g.shields = 2;
  g.boss.x = 160; g.boss.hp = 1; g.boss.age = 0;
  g.shots = [{ x: 160, y: 40 }];
  stepFlight(g, idle, .016);
  assert.equal(g.boss, null); assert.equal(g.score, 1500); assert.equal(g.shields, 3);
  assert.equal(g.bolts.length, 0); assert.equal(g.drones.length, 0);
  assert.equal(g.nextBossAt, g.elapsed + 45);
  g.elapsed = g.nextBossAt;
  stepFlight(g, idle, .016);
  assert.equal(g.boss.kind, 'destroyer'); assert.equal(g.boss.wave, 2);
  assert.equal(g.boss.maxHp, 24);
});
test('surviving a boss for 30 seconds returns to endless flight without a kill reward', () => {
  const g = summonBoss(); g.boss.age = 30;
  stepFlight(g, idle, .016);
  assert.equal(g.boss, null); assert.equal(g.score, 0);
  assert.equal(g.nextBossAt, g.elapsed + 45);
  assert.ok(g.passageIn > 0);
});
test('restarting resets boss schedule, health and wave number', () => {
  const g = newFlight(200, 96);
  assert.equal(g.boss, null); assert.equal(g.nextBossAt, 45); assert.equal(g.bossWave, 0);
});
