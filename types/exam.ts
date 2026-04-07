export type QuestionType = 'mcq' | 'tf' | 'fill' | 'explain' | 'case';
export type Difficulty   = 'easy' | 'medium' | 'hard';
export type Phase        = 'welcome' | 'exam' | 'results';
export type ResultType   = 'ok' | 'partial' | 'bad';

export interface Question {
  type: QuestionType;
  difficulty: Difficulty;
  topic: string;
  question: string;
  options?: string[];
  correct: string;
  fact?: string;
  error?: string;
  _topic?: string;
  _type?: string;
  _difficulty?: string;
}

export interface Feedback {
  t: ResultType;
  title: string;
  body?: string;
  fact?: string;
}

export interface Score {
  c: number;
  w: number;
  p: number;
}

export interface SessionStats {
  points: number;
  accuracy: number;
  topicsUsed: number;
  streak: number;
  totalTopics: number;
}

export interface Bookmark {
  id?: string;
  question_text: string;
  correct_answer: string;
  topic: string;
  difficulty: string;
  question_type: string;
  created_at?: string;
}

export interface ToastState {
  show: boolean;
  msg: string;
}

export interface AttemptRecord {
  topic: string;
  result: 'correct' | 'partial' | 'wrong';
  question_type: QuestionType;
  difficulty: Difficulty;
  answered_at: string;
}
