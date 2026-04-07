'use client';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { ALL_TOPICS, ALL_TYPES } from '@/constants/topics';
import type {
  Question, Feedback, Score, SessionStats,
  Phase, QuestionType, Difficulty,
} from '@/types/exam';

const getKey = (): string =>
  typeof window !== 'undefined' ? (localStorage.getItem('rx-exam-gemini-key') ?? '') : '';

async function api<T>(endpoint: string, body: object): Promise<T> {
  const res  = await fetch(`/api/${endpoint}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': getKey() },
    body:    JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export function useExamEngine(speakText: (t: string) => void) {
  const [phase,       setPhase]       = useState<Phase>('welcome');
  const [qNum,        setQNum]        = useState(0);
  const [score,       setScore]       = useState<Score>({ c: 0, w: 0, p: 0 });
  const [q,           setQ]           = useState<Question | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [loadTxt,     setLoadTxt]     = useState('');
  const [answered,    setAnswered]    = useState(false);
  const [selOpt,      setSelOpt]      = useState<string | null>(null);
  const [fillVal,     setFillVal]     = useState('');
  const [expVal,      setExpVal]      = useState('');
  const [fb,          setFb]          = useState<Feedback | null>(null);
  const [hints,       setHints]       = useState<string[]>([]);
  const [hintLoading, setHintLoading] = useState(false);
  const [toast,       setToast]       = useState({ show: false, msg: '' });
  const [listening,   setListening]   = useState(false);

  const timerRef     = useRef<ReturnType<typeof setTimeout>>();
  const usedTopics   = useRef(new Set<string>());
  const usedTypes    = useRef<QuestionType[]>([]);
  const streakRef    = useRef(0);
  const questionPool = useRef<Question[]>([]);
  const isPreloading = useRef(false);
  const loadingRef   = useRef(false);
  const recRef       = useRef<SpeechRecognition | null>(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const total  = score.c + score.w + score.p;
  const points = score.c + score.p * 0.5;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sessionStats: SessionStats = useMemo(() => ({
    points,
    accuracy:    total > 0 ? Math.round((points / total) * 100) : 0,
    topicsUsed:  usedTopics.current.size,
    streak:      streakRef.current,
    totalTopics: ALL_TOPICS.length,
  }), [score]);

  const showToast = useCallback((msg: string) => {
    setToast({ show: true, msg });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pickConstraints = useCallback(() => {
    const acc        = total > 0 ? (points / total) * 100 : 50;
    const difficulty: Difficulty = acc > 75 ? 'hard' : acc >= 45 ? 'medium' : 'easy';
    const unused     = ALL_TOPICS.filter((t) => !usedTopics.current.has(t));
    const topicPool  = unused.length > 0 ? unused : ALL_TOPICS;
    const topic      = topicPool[Math.floor(Math.random() * topicPool.length)];
    const recent     = usedTypes.current.slice(-5);
    const typePool   = ALL_TYPES.filter((t) => !recent.includes(t));
    const pool       = typePool.length > 0 ? typePool : ALL_TYPES;
    const type       = pool[Math.floor(Math.random() * pool.length)];
    return { topic, type, difficulty };
  }, [score]);

  const triggerPreload = useCallback(async (nextNum: number) => {
    if (isPreloading.current || questionPool.current.length >= 2) return;
    isPreloading.current = true;
    try {
      const c    = pickConstraints();
      const data = await api<{ question: Question }>('generate-question', {
        ...c,
        questionNumber: nextNum,
        usedTopics: Array.from(usedTopics.current).slice(-20),
      });
      questionPool.current.push({
        ...data.question,
        _topic:      c.topic,
        _type:       c.type,
        _difficulty: c.difficulty,
      });
    } catch (e) { console.warn('Preload:', (e as Error).message); }
    finally { isPreloading.current = false; }
  }, [pickConstraints]);

  const loadQ = useCallback(async (num: number, preloaded?: Question) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    setQ(null); setFb(null); setAnswered(false);
    setSelOpt(null); setFillVal(''); setExpVal(''); setHints([]);

    if (!preloaded) { setLoading(true); setLoadTxt('جارٍ توليد السؤال…'); }

    try {
      let parsed: Question;
      let topic: string, type: QuestionType, difficulty: Difficulty;

      if (preloaded) {
        parsed     = preloaded;
        topic      = preloaded._topic      ?? preloaded.topic;
        type       = (preloaded._type      ?? preloaded.type) as QuestionType;
        difficulty = (preloaded._difficulty ?? preloaded.difficulty) as Difficulty;
      } else {
        const c = pickConstraints();
        ({ topic, type, difficulty } = c);
        const data = await api<{ question: Question }>('generate-question', {
          topic, type, difficulty,
          questionNumber: num,
          usedTopics: Array.from(usedTopics.current).slice(-20),
        });
        parsed = data.question;
      }

      usedTopics.current.add(topic);
      usedTypes.current = [...usedTypes.current.slice(-5), type];
      setQ(parsed);
      speakText(parsed.question);
      triggerPreload(num + 1);

    } catch (e) {
      const msg = (e as Error).message;
      showToast('❌ ' + msg);
      setQ({ type: 'mcq', difficulty: 'medium', topic: '', question: '', correct: '', error: msg });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [pickConstraints, triggerPreload, speakText, showToast]);

  const start = useCallback(() => {
    usedTopics.current.clear();
    usedTypes.current  = [];
    streakRef.current  = 0;
    questionPool.current = [];
    setScore({ c: 0, w: 0, p: 0 });
    setPhase('exam');
    setQNum(1);
    loadQ(1);
  }, [loadQ]);

  const next = useCallback(() => {
    if (qNum > 0 && qNum % 10 === 0) { setPhase('results'); return; }
    const n = qNum + 1;
    setQNum(n);
    loadQ(n, questionPool.current.shift());
  }, [qNum, loadQ]);

  const resumeFromResults = useCallback(() => {
    setPhase('exam');
    const n = qNum + 1;
    setQNum(n);
    loadQ(n, questionPool.current.shift());
  }, [qNum, loadQ]);

  const bump = (ok: boolean) => { if (ok) streakRef.current++; else streakRef.current = 0; };

  const submitMCQ = useCallback((opt: string) => {
    if (answered || !q) return;
    setSelOpt(opt); setAnswered(true);
    const ok = opt === q.correct;
    setScore((s) => ok ? { ...s, c: s.c + 1 } : { ...s, w: s.w + 1 });
    bump(ok);
    setFb({
      t:    ok ? 'ok' : 'bad',
      title: ok ? 'ممتاز! 🎉' : 'إجابة خاطئة',
      body:  ok ? '' : `الإجابة الصحيحة: ${q.correct}`,
      fact:  ok ? q.fact : undefined,
    });
    speakText(ok ? 'Correct! Well done.' : `Incorrect. The correct answer is ${q.correct}.`);
  }, [answered, q, speakText]);

  const submitTF = useCallback((val: string) => {
    if (answered || !q) return;
    setAnswered(true);
    const ok = val === q.correct;
    setScore((s) => ok ? { ...s, c: s.c + 1 } : { ...s, w: s.w + 1 });
    bump(ok);
    setFb({
      t:    ok ? 'ok' : 'bad',
      title: ok ? 'ممتاز! 🎉' : 'إجابة خاطئة',
      body:  ok ? '' : `الإجابة الصحيحة: ${q.correct === 'true' ? 'صحيح' : 'خطأ'}`,
      fact:  ok ? q.fact : undefined,
    });
    speakText(ok ? 'Correct!' : `Incorrect. The answer is ${q.correct === 'true' ? 'True' : 'False'}.`);
  }, [answered, q, speakText]);

  const submitOpen = useCallback(async () => {
    if (answered || !q) return;
    setAnswered(true);
    const userAnswer = q.type === 'fill' ? fillVal : expVal;
    setLoading(true);
    setLoadTxt('الذكاء الاصطناعي يقيّم إجابتك…');
    try {
      const { grading: g } = await api<{
        grading: { result: string; verdict: string; explanation: string };
      }>('grade-answer', { question: q.question, correct: q.correct, userAnswer, type: q.type });

      const isOk   = g.result === 'correct';
      const isPart = g.result === 'partial';
      if (isOk)        setScore((s) => ({ ...s, c: s.c + 1 }));
      else if (isPart) setScore((s) => ({ ...s, p: s.p + 1 }));
      else             setScore((s) => ({ ...s, w: s.w + 1 }));
      bump(isOk);

      setFb({
        t:    isOk ? 'ok' : isPart ? 'partial' : 'bad',
        title: g.verdict,
        body:  g.explanation,
        fact:  isOk ? q.fact : undefined,
      });
      speakText(isOk ? 'Correct!' : isPart ? 'Partially correct.' : 'Incorrect.');

    } catch (e) {
      setScore((s) => ({ ...s, w: s.w + 1 }));
      streakRef.current = 0;
      setFb({ t: 'bad', title: 'تعذّر التقييم', body: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, [answered, q, fillVal, expVal, speakText]);

  const getHint = useCallback(async () => {
    if (!q || hintLoading || hints.length >= 3) return;
    setHintLoading(true);
    try {
      const { hint } = await api<{ hint: string }>('get-hint', {
        question:      q.question,
        hintNumber:    hints.length + 1,
        previousHints: hints,
      });
      setHints((h) => [...h, hint]);
      speakText(hint);
    } catch (e) { showToast('❌ ' + (e as Error).message); }
    finally { setHintLoading(false); }
  }, [q, hintLoading, hints, speakText, showToast]);

  const toggleVoice = useCallback(() => {
    if (answered) return;
    const SR = (window as Window & typeof globalThis).SpeechRecognition
            || (window as Window & typeof globalThis).webkitSpeechRecognition;
    if (!SR) { showToast('استخدم Chrome للصوت'); return; }
    if (listening) { recRef.current?.stop(); return; }

    const r = new SR();
    recRef.current      = r;
    r.lang              = 'ar-SA';
    r.continuous        = false;
    r.interimResults    = false;

    r.onstart  = () => setListening(true);
    r.onend    = () => setListening(false);
    r.onerror  = () => setListening(false);
    r.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[0][0].transcript.trim();
      if      (q?.type === 'fill')                           setFillVal(t);
      else if (q?.type === 'explain' || q?.type === 'case')  setExpVal(t);
      else if (q?.type === 'mcq') {
        const u = t.toUpperCase();
        if      (/\bA\b|أ|الأول/.test(u))  submitMCQ('A');
        else if (/\bB\b|ب|الثاني/.test(u)) submitMCQ('B');
        else if (/\bC\b|ج|الثالث/.test(u)) submitMCQ('C');
        else if (/\bD\b|د|الرابع/.test(u)) submitMCQ('D');
      } else if (q?.type === 'tf') {
        if      (/صحيح|نعم|true|yes/i.test(t))  submitTF('true');
        else if (/خطأ|لا|false|no/i.test(t))     submitTF('false');
      }
      showToast('🎤 ' + t);
    };
    r.start();
  }, [answered, listening, q, submitMCQ, submitTF, showToast]);

  const canSubmit: boolean = !!(q && !answered && !loading && (
    (q.type === 'mcq'     && !!selOpt)                               ||
    (q.type === 'fill'    && fillVal.trim().length > 0)              ||
    ((q.type === 'explain' || q.type === 'case') && expVal.trim().length > 0)
  ));

  return {
    phase, setPhase, qNum, score, total, points, sessionStats,
    q, loading, loadTxt, answered, selOpt, fillVal, setFillVal,
    expVal, setExpVal, fb, hints, hintLoading, toast, listening, canSubmit,
    streakRef, questionPool,
    start, next, resumeFromResults,
    submitMCQ, submitTF, submitOpen, getHint, toggleVoice, showToast,
  };
}
