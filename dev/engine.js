(function (global) {
  'use strict';

  const TOTAL_QUESTIONS = 25;
  const QUICK_TOTAL = 20;
  const MIN_N = 1;
  const MAX_N = 5;
  const MAX_SESSIONS = 40;

  const OP_SYMBOL = Object.freeze({ '+': '+', '-': '−', '*': '×', '/': '÷' });
  const OP_NAME = Object.freeze({ '+': '加', '-': '减', '*': '乘', '/': '除' });
  const OP_NAME_EN = Object.freeze({ '+': 'plus', '-': 'minus', '*': 'times', '/': 'divided by' });

  function clampInt(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.trunc(number)));
  }

  function randInt(min, max, rng) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function normalizeConfig(config) {
    const source = config && typeof config === 'object' ? config : {};
    return {
      n: clampInt(source.n, MIN_N, MAX_N, 1),
      digits: source.digits === 2 ? 2 : 1,
      ops: source.ops === 'all' ? 'all' : 'addsub'
    };
  }

  function createQuestion(digits, ops, rng) {
    const random = typeof rng === 'function' ? rng : Math.random;
    const width = digits === 2 ? 2 : 1;
    const allOps = ops === 'all';
    const op = allOps
      ? ['+', '-', '*', '/'][randInt(0, 3, random)]
      : (random() < 0.5 ? '+' : '-');

    let a;
    let b;
    let answer;

    if (op === '+') {
      if (width === 1) {
        a = randInt(2, 9, random);
        b = randInt(2, 9, random);
      } else {
        a = randInt(10, 99, random);
        b = randInt(10, 99, random);
      }
      answer = a + b;
    } else if (op === '-') {
      if (width === 1) {
        a = randInt(3, 9, random);
        b = randInt(1, a - 1, random);
      } else {
        a = randInt(20, 99, random);
        b = randInt(10, a - 1, random);
      }
      answer = a - b;
    } else if (op === '*') {
      if (width === 1) {
        a = randInt(2, 9, random);
        b = randInt(2, 9, random);
      } else {
        a = randInt(10, 99, random);
        b = randInt(2, 9, random);
      }
      answer = a * b;
    } else {
      if (width === 1) {
        b = randInt(2, 9, random);
        answer = randInt(2, 9, random);
        a = b * answer;
      } else {
        b = randInt(2, 9, random);
        const minQuotient = Math.max(2, Math.ceil(10 / b));
        const maxQuotient = Math.floor(99 / b);
        answer = randInt(minQuotient, maxQuotient, random);
        a = b * answer;
      }
    }

    return {
      a,
      b,
      op,
      symbol: OP_SYMBOL[op],
      answer,
      text: `${a} ${OP_SYMBOL[op]} ${b}`,
      digits: width,
      ops: allOps ? 'all' : 'addsub'
    };
  }

  function createUniqueQuestion(digits, ops, rng, recentTexts) {
    const recent = Array.isArray(recentTexts) ? recentTexts : [];
    let question = createQuestion(digits, ops, rng);
    for (let attempt = 0; attempt < 14 && recent.includes(question.text); attempt += 1) {
      question = createQuestion(digits, ops, rng);
    }
    return question;
  }

  function createEndlessQuestion(ops, rng) {
    const random = typeof rng === 'function' ? rng : Math.random;
    const allOps = ops === 'all';
    const op = allOps
      ? ['+', '-', '*', '/'][randInt(0, 3, random)]
      : (random() < 0.5 ? '+' : '-');

    let a;
    let b;
    let answer;

    if (op === '+') {
      answer = randInt(0, 9, random);
      a = randInt(0, answer, random);
      b = answer - a;
    } else if (op === '-') {
      a = randInt(0, 9, random);
      b = randInt(0, a, random);
      answer = a - b;
    } else if (op === '*') {
      do {
        a = randInt(0, 9, random);
        b = randInt(0, 9, random);
      } while (a * b > 9);
      answer = a * b;
    } else {
      b = randInt(2, 9, random);
      answer = randInt(0, 9, random);
      a = b * answer;
    }

    return {
      a,
      b,
      op,
      symbol: OP_SYMBOL[op],
      answer,
      text: `${a} ${OP_SYMBOL[op]} ${b}`,
      digits: 1,
      ops: allOps ? 'all' : 'addsub'
    };
  }

  function createUniqueEndlessQuestion(ops, rng, recentTexts) {
    const recent = Array.isArray(recentTexts) ? recentTexts : [];
    let question = createEndlessQuestion(ops, rng);
    for (let attempt = 0; attempt < 14 && recent.includes(question.text); attempt += 1) {
      question = createEndlessQuestion(ops, rng);
    }
    return question;
  }

  class GameSession {
    constructor(config, total, rng, options) {
      const normalized = normalizeConfig(config);
      this.n = normalized.n;
      this.digits = normalized.digits;
      this.ops = normalized.ops;
      this.endless = Boolean(options && options.endless);
      this.finite = Boolean(options && options.finite);
      this.total = this.endless && !this.finite
        ? Number.POSITIVE_INFINITY
        : clampInt(total, 1, 200, TOTAL_QUESTIONS);
      this.rng = typeof rng === 'function' ? rng : Math.random;

      this.history = [];
      this.currentIndex = -1;
      this.warmupDone = 0;
      this.answered = 0;
      this.correct = 0;
      this.score = 0;
      this.streak = 0;
      this.bestStreak = 0;
      this.results = [];
      this.phase = 'warmup';
      this.ended = false;
      this.recentTexts = [];

      this.generateQuestion();
    }

    generateQuestion() {
      const question = this.endless
        ? createUniqueEndlessQuestion(this.ops, this.rng, this.recentTexts)
        : createUniqueQuestion(this.digits, this.ops, this.rng, this.recentTexts);
      question.index = this.history.length;
      this.history.push(question);
      this.recentTexts.push(question.text);
      if (this.recentTexts.length > 7) this.recentTexts.shift();
      this.currentIndex = question.index;
      return question;
    }

    get current() {
      return this.history[this.currentIndex] || null;
    }

    get target() {
      if (this.phase !== 'answer' && this.phase !== 'feedback') return null;
      const index = this.currentIndex - this.n;
      return index >= 0 ? this.history[index] : null;
    }

    get accuracy() {
      return this.answered > 0 ? this.correct / this.answered : 0;
    }

    get warmupTotal() {
      return this.n;
    }

    memorize() {
      if (this.phase !== 'warmup') return this.phase;
      this.warmupDone += 1;

      if (this.warmupDone < this.n) {
        this.generateQuestion();
      } else {
        this.phase = 'answer';
        this.generateQuestion();
      }
      return this.phase;
    }

    submit(rawValue, responseMs) {
      if (this.phase !== 'answer') {
        throw new Error('Cannot submit outside the answer phase.');
      }
      const target = this.target;
      if (!target) {
        throw new Error('No target question available.');
      }

      const value = Number(rawValue);
      const isCorrect = Number.isFinite(value) && value === target.answer;

      this.answered += 1;
      if (isCorrect) {
        this.correct += 1;
        this.score += 100;
        this.streak += 1;
        this.bestStreak = Math.max(this.bestStreak, this.streak);
      } else {
        this.streak = 0;
      }

      const record = {
        correct: isCorrect,
        value: Number.isFinite(value) ? value : 0,
        targetAnswer: target.answer,
        targetText: target.text,
        targetIndex: target.index,
        questionIndex: this.currentIndex,
        responseMs: Math.max(0, Number(responseMs) || 0),
        score: this.score,
        streak: this.streak,
        answered: this.answered
      };

      this.results.push(record);
      this.phase = 'feedback';
      return record;
    }

    advance() {
      if (this.phase !== 'feedback') return this.phase;
      if (this.answered >= this.total) {
        this.phase = 'done';
        return this.phase;
      }
      if (this.endless) {
        if (this.ended) {
          this.phase = 'done';
          return this.phase;
        }
        this.phase = 'answer';
        this.generateQuestion();
        return this.phase;
      }
      this.phase = 'answer';
      this.generateQuestion();
      return this.phase;
    }

    end() {
      this.ended = true;
      this.phase = 'done';
      return this.phase;
    }
  }

  function rankFor(correct, total) {
    const ratio = total > 0 ? correct / total : 0;
    if (ratio >= 1) return 'S';
    if (ratio >= 0.9) return 'A';
    if (ratio >= 0.75) return 'B';
    if (ratio >= 0.6) return 'C';
    return 'D';
  }

  function maxInputDigits(config) {
    const normalized = normalizeConfig(config);
    return normalized.digits === 1 ? 2 : 3;
  }

  function statusText(n, lang) {
    if (lang === 'en') return `${n} back`;
    if (n === 1) return '上一题';
    if (n === 2) return '上上一题';
    return `${n} 题前`;
  }

  function configLabel(config, short, lang) {
    const normalized = normalizeConfig(config);
    if (lang === 'en') {
      const digits = `${normalized.digits}-digit`;
      const ops = normalized.ops === 'all' ? 'all four' : 'add & subtract';
      if (short) {
        return `${normalized.n}-back · ${normalized.digits}-digit · ${normalized.ops === 'all' ? '4 ops' : '+ −'}`;
      }
      return `${normalized.n}-back · ${digits} · ${ops}`;
    }
    const digits = normalized.digits === 2 ? '两位数' : '个位数';
    const ops = normalized.ops === 'all' ? '加减乘除' : '加减';
    if (short) {
      return `${normalized.n}回溯 · ${normalized.digits}位 · ${normalized.ops === 'all' ? '四则' : '加减'}`;
    }
    return `${normalized.n}-回溯 · ${digits} · ${ops}`;
  }

  function endlessLabel(config, short, lang) {
    const normalized = normalizeConfig(config);
    if (lang === 'en') {
      const ops = normalized.ops === 'all' ? 'all four' : 'add & subtract';
      if (short) {
        return `Quick · 0–9 · ${normalized.n}-back`;
      }
      return `Quick · 0–9 · ${normalized.n}-back · ${ops}`;
    }
    const ops = normalized.ops === 'all' ? '加减乘除' : '加减';
    if (short) {
      return `快速 · 0–9 · ${normalized.n}回溯`;
    }
    return `快速 · 0–9 · ${normalized.n}-回溯 · ${ops}`;
  }

  function questionLabel(question, lang) {
    const names = lang === 'en' ? OP_NAME_EN : OP_NAME;
    return `${question.a} ${names[question.op]} ${question.b}`;
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.round((Number(ms) || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (value) => String(value).padStart(2, '0');
    if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
  }

  function formatAverage(ms) {
    const seconds = (Number(ms) || 0) / 1000;
    if (!Number.isFinite(seconds) || seconds <= 0) return '—';
    if (seconds < 10) return `${seconds.toFixed(1)}s`;
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const rest = Math.round(seconds % 60);
    return `${minutes}m${String(rest).padStart(2, '0')}s`;
  }

  function sanitizeSession(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const timestamp = Number(raw.ts);
    if (!Number.isFinite(timestamp)) return null;
    const total = clampInt(raw.total, 0, 10000, TOTAL_QUESTIONS);
    const correct = clampInt(raw.correct, 0, total, 0);
    return {
      ts: timestamp,
      mode: raw.mode === 'endless' ? 'endless' : 'normal',
      n: clampInt(raw.n, MIN_N, MAX_N, 1),
      digits: raw.digits === 2 ? 2 : 1,
      ops: raw.ops === 'all' ? 'all' : 'addsub',
      correct,
      total,
      score: correct * 100,
      bestStreak: clampInt(raw.bestStreak, 0, total, 0),
      avgMs: clampInt(raw.avgMs, 0, 60 * 60 * 1000, 0),
      durationMs: clampInt(raw.durationMs, 0, 24 * 60 * 60 * 1000, 0)
    };
  }

  function sanitizeStore(raw) {
    const fallback = {
      version: 1,
      settings: { n: 1, digits: 1, ops: 'addsub' },
      theme: null,
      language: 'zh',
      setupMode: 'normal',
      sessions: []
    };
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fallback;

    const settings = normalizeConfig(raw.settings);
    const theme = raw.theme === 'dark' || raw.theme === 'light' ? raw.theme : null;
    const language = raw.language === 'en' ? 'en' : 'zh';
    const setupMode = raw.setupMode === 'endless' ? 'endless' : 'normal';
    const sessions = [];

    if (Array.isArray(raw.sessions)) {
      raw.sessions.slice(-60).forEach((item) => {
        const session = sanitizeSession(item);
        if (session) sessions.push(session);
      });
    }

    return {
      version: 1,
      settings,
      theme,
      language,
      setupMode,
      sessions: sessions.slice(-MAX_SESSIONS)
    };
  }

  function findBest(sessions, config, mode) {
    const normalized = normalizeConfig(config);
    const wantedMode = mode === 'endless' ? 'endless' : 'normal';
    const matches = (Array.isArray(sessions) ? sessions : []).filter((session) => (
      session
      && session.mode === wantedMode
      && session.n === normalized.n
      && (wantedMode === 'endless' || session.digits === normalized.digits)
      && session.ops === normalized.ops
    ));
    let best = null;
    matches.forEach((session) => {
      if (!best) {
        best = session;
        return;
      }
      if (session.correct > best.correct) {
        best = session;
        return;
      }
      if (session.correct === best.correct) {
        const speed = session.avgMs > 0 ? session.avgMs : Number.POSITIVE_INFINITY;
        const bestSpeed = best.avgMs > 0 ? best.avgMs : Number.POSITIVE_INFINITY;
        if (speed < bestSpeed) best = session;
      }
    });
    return best;
  }

  function findEndlessBest(sessions, config) {
    const normalized = normalizeConfig(config);
    const matches = (Array.isArray(sessions) ? sessions : []).filter((session) => (
      session
      && session.mode === 'endless'
      && session.n === normalized.n
      && session.ops === normalized.ops
    ));
    let best = null;
    matches.forEach((session) => {
      if (!best) {
        best = session;
        return;
      }
      if (session.score > best.score) {
        best = session;
        return;
      }
      if (session.score === best.score) {
        const accuracy = session.total > 0 ? session.correct / session.total : 0;
        const bestAccuracy = best.total > 0 ? best.correct / best.total : 0;
        if (accuracy > bestAccuracy) {
          best = session;
          return;
        }
        if (accuracy === bestAccuracy) {
          const speed = session.avgMs > 0 ? session.avgMs : Number.POSITIVE_INFINITY;
          const bestSpeed = best.avgMs > 0 ? best.avgMs : Number.POSITIVE_INFINITY;
          if (speed < bestSpeed) best = session;
        }
      }
    });
    return best;
  }

  function findQuickBest(sessions, config) {
    const normalized = normalizeConfig(config);
    const quickSessions = (Array.isArray(sessions) ? sessions : []).filter((session) => (
      session
      && session.mode === 'endless'
      && session.total === QUICK_TOTAL
      && session.correct > QUICK_TOTAL * 0.9
    ));
    return findEndlessBest(quickSessions, { ...normalized, ops: 'all', digits: 1 });
  }

  const api = {
    TOTAL_QUESTIONS,
    QUICK_TOTAL,
    MIN_N,
    MAX_N,
    MAX_SESSIONS,
    OP_SYMBOL,
    OP_NAME,
    clampInt,
    randInt,
    normalizeConfig,
    createQuestion,
    createUniqueQuestion,
    createEndlessQuestion,
    createUniqueEndlessQuestion,
    GameSession,
    rankFor,
    maxInputDigits,
    statusText,
    configLabel,
    endlessLabel,
    questionLabel,
    formatDuration,
    formatAverage,
    sanitizeSession,
    sanitizeStore,
    findBest,
    findEndlessBest,
    findQuickBest
  };

  global.DevilEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
