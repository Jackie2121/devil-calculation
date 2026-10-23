import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('./engine.js');
const E = globalThis.DevilEngine;

function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const configs = [];
[1, 2].forEach((digits) => {
  ['addsub', 'all'].forEach((ops) => {
    configs.push({ digits, ops });
  });
});

test('question generator satisfies every range and arithmetic invariant', () => {
  configs.forEach(({ digits, ops }) => {
    [1, 2, 3].forEach((seed) => {
      const rng = mulberry32(seed * 1000 + digits * 10 + (ops === 'all' ? 2 : 1));
      for (let i = 0; i < 20000; i += 1) {
        const q = E.createQuestion(digits, ops, rng);
        assert.equal(q.digits, digits);
        assert.equal(q.ops, ops);
        assert.ok(Number.isInteger(q.a));
        assert.ok(Number.isInteger(q.b));
        assert.ok(Number.isInteger(q.answer));
        assert.ok(q.answer > 0, `answer must be positive: ${q.text}`);
        assert.equal(q.text, `${q.a} ${q.symbol} ${q.b}`);

        if (q.op === '+') {
          assert.equal(q.answer, q.a + q.b);
          if (digits === 1) {
            assert.ok(q.a >= 2 && q.a <= 9);
            assert.ok(q.b >= 2 && q.b <= 9);
          } else {
            assert.ok(q.a >= 10 && q.a <= 99);
            assert.ok(q.b >= 10 && q.b <= 99);
          }
        } else if (q.op === '-') {
          assert.equal(q.answer, q.a - q.b);
          assert.ok(q.a > q.b);
          assert.ok(q.answer >= 1);
          if (digits === 1) {
            assert.ok(q.a >= 3 && q.a <= 9);
            assert.ok(q.b >= 1 && q.b <= q.a - 1);
          } else {
            assert.ok(q.a >= 20 && q.a <= 99);
            assert.ok(q.b >= 10 && q.b <= q.a - 1);
          }
        } else if (q.op === '*') {
          assert.equal(q.answer, q.a * q.b);
          if (digits === 1) {
            assert.ok(q.a >= 2 && q.a <= 9);
            assert.ok(q.b >= 2 && q.b <= 9);
          } else {
            assert.ok(q.a >= 10 && q.a <= 99);
            assert.ok(q.b >= 2 && q.b <= 9);
          }
        } else {
          assert.equal(q.a, q.b * q.answer);
          assert.equal(q.a % q.b, 0);
          assert.ok(q.b >= 2 && q.b <= 9);
          assert.ok(q.answer >= 2);
          if (digits === 1) {
            assert.ok(q.a >= 4 && q.a <= 81);
            assert.ok(q.answer <= 9);
          } else {
            assert.ok(q.a >= 10 && q.a <= 99);
          }
        }
      }
    });
  });
});

test('unique question generator avoids recent expressions when possible', () => {
  const rng = mulberry32(42);
  const recent = [];
  for (let i = 0; i < 300; i += 1) {
    const q = E.createUniqueQuestion(1, 'addsub', rng, recent);
    assert.equal(recent.includes(q.text), false, q.text);
    recent.push(q.text);
    if (recent.length > 7) recent.shift();
  }
});

test('full session is exactly N warmups plus 25 scored questions', () => {
  configs.forEach(({ digits, ops }) => {
    [1, 2, 3, 4, 5].forEach((n) => {
      const rng = mulberry32(9000 + n * 100 + digits * 10 + (ops === 'all' ? 2 : 1));
      const session = new E.GameSession({ n, digits, ops }, 25, rng);

      assert.equal(session.phase, 'warmup');
      assert.equal(session.history.length, 1);
      assert.equal(session.warmupDone, 0);

      for (let i = 1; i <= n; i += 1) {
        const phase = session.memorize();
        if (i < n) {
          assert.equal(phase, 'warmup');
          assert.equal(session.warmupDone, i);
          assert.equal(session.history.length, i + 1);
        } else {
          assert.equal(phase, 'answer');
          assert.equal(session.warmupDone, n);
          assert.equal(session.history.length, n + 1);
        }
      }

      assert.equal(session.currentIndex, n);
      assert.equal(session.target.index, 0);
      assert.equal(session.answered, 0);

      for (let i = 0; i < 25; i += 1) {
        assert.equal(session.phase, 'answer');
        assert.equal(session.currentIndex, n + i);
        assert.equal(session.target.index, i);
        assert.equal(session.target.answer, session.history[i].answer);

        const result = session.submit(session.target.answer, 1500);
        assert.equal(result.correct, true);
        assert.equal(result.targetIndex, i);
        assert.equal(session.answered, i + 1);
        assert.equal(session.score, (i + 1) * 100);
        assert.equal(session.streak, i + 1);

        const phase = session.advance();
        if (i < 24) {
          assert.equal(phase, 'answer');
          assert.equal(session.history.length, n + i + 2);
          assert.equal(session.phase, 'answer');
        } else {
          assert.equal(phase, 'done');
          assert.equal(session.phase, 'done');
        }
      }

      assert.equal(session.results.length, 25);
      assert.equal(session.correct, 25);
      assert.equal(session.score, 2500);
      assert.equal(session.bestStreak, 25);
      assert.equal(session.accuracy, 1);
      assert.equal(E.rankFor(session.correct, session.total), 'S');
    });
  });
});

test('wrong answers reset the streak, keep score, and still advance', () => {
  const rng = mulberry32(7);
  const session = new E.GameSession({ n: 2, digits: 2, ops: 'all' }, 25, rng);
  session.memorize();
  session.memorize();

  const target = session.target.answer;
  const wrongValue = target === 1 ? 2 : target + 1;
  const result = session.submit(wrongValue, 2400);
  assert.equal(result.correct, false);
  assert.equal(session.correct, 0);
  assert.equal(session.score, 0);
  assert.equal(session.streak, 0);
  assert.equal(session.answered, 1);
  assert.equal(session.phase, 'feedback');
  assert.equal(session.results[0].targetAnswer, target);

  session.advance();
  assert.equal(session.phase, 'answer');
  assert.equal(session.target.index, 1);
  assert.equal(session.currentIndex, 3);

  const nextTarget = session.target.answer;
  assert.equal(session.submit(nextTarget, 1200).correct, true);
  assert.equal(session.streak, 1);
  assert.equal(session.score, 100);
});

test('sessions never expose a missing target', () => {
  configs.forEach(({ digits, ops }) => {
    [1, 5].forEach((n) => {
      const rng = mulberry32(123 + n + digits + (ops === 'all' ? 10 : 0));
      const session = new E.GameSession({ n, digits, ops }, 25, rng);
      for (let i = 0; i < n; i += 1) session.memorize();
      for (let i = 0; i < 25; i += 1) {
        assert.ok(session.target, 'target should exist during the answer phase');
        assert.equal(session.target.index, session.currentIndex - n);
        session.submit(session.target.answer, 1000);
        session.advance();
      }
      assert.equal(session.phase, 'done');
      assert.equal(session.target, null);
    });
  });
});

test('endless question generator always yields a single-digit answer', () => {
  ['addsub', 'all'].forEach((ops) => {
    [1, 2, 3, 4].forEach((seed) => {
      const rng = mulberry32(seed * 777 + (ops === 'all' ? 3 : 1));
      for (let i = 0; i < 25000; i += 1) {
        const q = E.createEndlessQuestion(ops, rng);
        assert.ok(Number.isInteger(q.answer));
        assert.ok(q.answer >= 0 && q.answer <= 9, `answer out of range: ${q.text} = ${q.answer}`);
        assert.ok(Number.isInteger(q.a));
        assert.ok(Number.isInteger(q.b));
        assert.equal(q.text, `${q.a} ${q.symbol} ${q.b}`);
        if (q.op === '+') {
          assert.equal(q.answer, q.a + q.b);
          assert.ok(q.a >= 0 && q.a <= 9);
          assert.ok(q.b >= 0 && q.b <= 9);
        } else if (q.op === '-') {
          assert.equal(q.answer, q.a - q.b);
          assert.ok(q.a >= 0 && q.a <= 9);
          assert.ok(q.b >= 0 && q.b <= q.a);
        } else if (q.op === '*') {
          assert.equal(q.answer, q.a * q.b);
          assert.ok(q.a >= 0 && q.a <= 9);
          assert.ok(q.b >= 0 && q.b <= 9);
        } else {
          assert.equal(q.a, q.b * q.answer);
          assert.ok(q.b >= 2 && q.b <= 9);
          assert.ok(q.answer >= 0 && q.answer <= 9);
          assert.ok(q.a >= 0 && q.a <= 81);
        }
      }
    });
  });
});

test('unique endless generator avoids recent expressions', () => {
  const rng = mulberry32(2024);
  const recent = [];
  for (let i = 0; i < 400; i += 1) {
    const q = E.createUniqueEndlessQuestion('all', rng, recent);
    assert.equal(recent.includes(q.text), false, q.text);
    recent.push(q.text);
    if (recent.length > 7) recent.shift();
  }
});

test('endless session never ends by itself and ends only when asked', () => {
  [1, 3, 5].forEach((n) => {
    const rng = mulberry32(500 + n);
    const session = new E.GameSession({ n, digits: 2, ops: 'all' }, 25, rng, { endless: true });
    assert.equal(session.total, Number.POSITIVE_INFINITY);
    for (let i = 0; i < n; i += 1) session.memorize();
    assert.equal(session.phase, 'answer');

    for (let i = 0; i < 80; i += 1) {
      assert.equal(session.phase, 'answer');
      assert.ok(session.target);
      assert.equal(session.target.index, session.currentIndex - n);
      assert.ok(session.target.answer >= 0 && session.target.answer <= 9);
      const result = session.submit(session.target.answer, 900);
      assert.equal(result.correct, true);
      assert.equal(session.phase, 'feedback');
      session.advance();
    }
    assert.equal(session.phase, 'answer');
    assert.equal(session.answered, 80);
    assert.equal(session.correct, 80);
    assert.equal(session.score, 8000);
    assert.equal(session.bestStreak, 80);

    session.end();
    assert.equal(session.phase, 'done');
    assert.equal(session.target, null);
    assert.equal(session.advance(), 'done');
  });
});

test('endless records compare by score, then accuracy, then speed', () => {
  const config = { n: 2, digits: 1, ops: 'all' };
  const sessions = [
    { ...config, mode: 'endless', score: 3000, correct: 30, total: 40, avgMs: 2000 },
    { ...config, mode: 'endless', score: 4000, correct: 40, total: 50, avgMs: 1800 },
    { ...config, mode: 'endless', score: 4000, correct: 40, total: 40, avgMs: 2200 },
    { ...config, mode: 'endless', score: 4000, correct: 40, total: 40, avgMs: 1500 },
    { ...config, n: 3, mode: 'endless', score: 9000, correct: 90, total: 90, avgMs: 1000 },
    { ...config, mode: 'normal', score: 2500, correct: 25, total: 25, avgMs: 1000 }
  ];
  const best = E.findEndlessBest(sessions, config);
  assert.equal(best.score, 4000);
  assert.equal(best.avgMs, 1500);
  assert.equal(E.findEndlessBest(sessions, { n: 5, digits: 1, ops: 'addsub' }), null);
  assert.equal(E.endlessLabel(config), '快速 · 0–9 · 2-回溯 · 加减乘除');
  assert.equal(E.endlessLabel(config, true), '快速 · 0–9 · 2回溯');
});

test('quick mode is a finite 20-question round', () => {
  assert.equal(E.QUICK_TOTAL, 20);
  const session = new E.GameSession({ n: 2, digits: 2, ops: 'addsub' }, E.QUICK_TOTAL, mulberry32(90210), {
    endless: true,
    finite: true
  });
  assert.equal(session.total, 20);
  for (let i = 0; i < 2; i += 1) session.memorize();
  for (let i = 0; i < E.QUICK_TOTAL; i += 1) {
    assert.equal(session.phase, 'answer');
    assert.ok(session.target);
    assert.ok(session.target.answer >= 0 && session.target.answer <= 9);
    session.submit(session.target.answer, 800);
    session.advance();
  }
  assert.equal(session.phase, 'done');
  assert.equal(session.answered, 20);
  assert.equal(session.correct, 20);
  assert.equal(session.score, 2000);
});

test('quick best only compares completed 20-question all-four rounds', () => {
  const sessions = [
    { mode: 'endless', n: 2, digits: 1, ops: 'all', total: 20, correct: 19, score: 1900, avgMs: 1200 },
    { mode: 'endless', n: 2, digits: 1, ops: 'all', total: 20, correct: 20, score: 2000, avgMs: 2000 },
    { mode: 'endless', n: 2, digits: 1, ops: 'all', total: 40, correct: 40, score: 4000, avgMs: 900 },
    { mode: 'endless', n: 2, digits: 1, ops: 'addsub', total: 20, correct: 20, score: 2000, avgMs: 900 },
    { mode: 'normal', n: 2, digits: 1, ops: 'all', total: 20, correct: 20, score: 2000, avgMs: 900 }
  ];
  const best = E.findQuickBest(sessions, { n: 2, digits: 2, ops: 'addsub' });
  assert.equal(best.total, 20);
  assert.equal(best.score, 2000);
  assert.equal(best.avgMs, 2000);
  assert.equal(E.findQuickBest(sessions, { n: 3, digits: 1, ops: 'all' }), null);
  assert.equal(E.findQuickBest([{ mode: 'endless', n: 2, ops: 'all', total: 20, correct: 18, score: 1800, avgMs: 900 }], { n: 2 }), null);
});

test('rank thresholds match the UI contract', () => {
  assert.equal(E.rankFor(25, 25), 'S');
  assert.equal(E.rankFor(24, 25), 'A');
  assert.equal(E.rankFor(23, 25), 'A');
  assert.equal(E.rankFor(19, 25), 'B');
  assert.equal(E.rankFor(18, 25), 'C');
  assert.equal(E.rankFor(15, 25), 'C');
  assert.equal(E.rankFor(14, 25), 'D');
  assert.equal(E.rankFor(0, 25), 'D');
});

test('formatting helpers are stable', () => {
  assert.equal(E.formatDuration(0), '00:00');
  assert.equal(E.formatDuration(59_600), '01:00');
  assert.equal(E.formatDuration(3_725_000), '1:02:05');
  assert.equal(E.formatAverage(0), '—');
  assert.equal(E.formatAverage(3_840), '3.8s');
  assert.equal(E.formatAverage(42_000), '42s');
  assert.equal(E.formatAverage(72_000), '1m12s');
  assert.equal(E.statusText(1), '上一题');
  assert.equal(E.statusText(2), '上上一题');
  assert.equal(E.statusText(4), '4 题前');
  assert.equal(E.statusText(1, 'en'), '1 back');
  assert.equal(E.statusText(4, 'en'), '4 back');
  assert.equal(E.configLabel({ n: 2, digits: 2, ops: 'all' }), '2-回溯 · 两位数 · 加减乘除');
  assert.equal(E.configLabel({ n: 1, digits: 1, ops: 'addsub' }, true), '1回溯 · 1位 · 加减');
  assert.equal(E.configLabel({ n: 2, digits: 2, ops: 'all' }, false, 'en'), '2-back · 2-digit · all four');
  assert.equal(E.configLabel({ n: 1, digits: 1, ops: 'addsub' }, true, 'en'), '1-back · 1-digit · + −');
  assert.equal(E.endlessLabel({ n: 2, digits: 1, ops: 'all' }, false, 'en'), 'Quick · 0–9 · 2-back · all four');
  assert.equal(E.endlessLabel({ n: 3, digits: 1, ops: 'addsub' }, true, 'en'), 'Quick · 0–9 · 3-back');
  assert.equal(E.questionLabel({ a: 5, b: 2, op: '+' }, 'en'), '5 plus 2');
  assert.equal(E.questionLabel({ a: 9, b: 3, op: '/' }, 'en'), '9 divided by 3');
  assert.equal(E.maxInputDigits({ digits: 1 }), 2);
  assert.equal(E.maxInputDigits({ digits: 2 }), 3);
});

test('store sanitization survives junk and normalizes records', () => {
  const fallback = E.sanitizeStore(null);
  assert.deepEqual(fallback.settings, { n: 1, digits: 1, ops: 'addsub' });
  assert.equal(fallback.theme, null);
  assert.equal(fallback.language, 'zh');
  assert.equal(fallback.setupMode, 'normal');
  assert.deepEqual(fallback.sessions, []);

  const dirty = {
    settings: { n: 99, digits: 7, ops: 'nope' },
    theme: 'dark',
    language: 'en',
    setupMode: 'endless',
    sessions: [
      { ts: 1000, mode: 'endless', n: 2, digits: 1, ops: 'all', correct: 23, total: 40, score: 999999, bestStreak: 50, avgMs: 4200, durationMs: 120000 },
      { ts: 'bad', n: 1, digits: 1, ops: 'addsub', correct: 1, total: 25 },
      null,
      { ts: 2000, n: 9, digits: 1, ops: 'addsub', correct: 99, total: 25, bestStreak: -4, avgMs: -9, durationMs: 0 }
    ]
  };
  const clean = E.sanitizeStore(dirty);
  assert.deepEqual(clean.settings, { n: 5, digits: 1, ops: 'addsub' });
  assert.equal(clean.theme, 'dark');
  assert.equal(clean.language, 'en');
  assert.equal(clean.setupMode, 'endless');
  assert.equal(clean.sessions.length, 2);
  assert.equal(clean.sessions[0].mode, 'endless');
  assert.equal(clean.sessions[0].score, 2300);
  assert.equal(clean.sessions[0].bestStreak, 40);
  assert.equal(clean.sessions[1].mode, 'normal');
  assert.equal(clean.sessions[1].n, 5);
  assert.equal(clean.sessions[1].correct, 25);
  assert.equal(clean.sessions[1].bestStreak, 0);
  assert.equal(clean.sessions[1].avgMs, 0);
});

test('best record prefers score, then speed', () => {
  const config = { n: 2, digits: 1, ops: 'addsub' };
  const sessions = [
    { ...config, mode: 'normal', correct: 20, avgMs: 3000 },
    { ...config, mode: 'normal', correct: 24, avgMs: 6000 },
    { ...config, mode: 'normal', correct: 24, avgMs: 4000 },
    { ...config, mode: 'normal', correct: 24, avgMs: 5000 },
    { ...config, n: 3, mode: 'normal', correct: 25, avgMs: 1000 }
  ];
  const best = E.findBest(sessions, config);
  assert.equal(best.correct, 24);
  assert.equal(best.avgMs, 4000);
  assert.equal(E.findBest(sessions, { n: 5, digits: 2, ops: 'all' }), null);
});
