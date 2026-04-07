export const COLORS = {
  bg:     'var(--rx-bg)',
  s1:     'var(--rx-s1)',
  s2:     'var(--rx-s2)',
  border: 'var(--rx-border)',
  green:  'var(--rx-green)',
  red:    'var(--rx-red)',
  gold:   'var(--rx-gold)',
  text:   'var(--rx-text)',
  muted:  'var(--rx-muted)',
} as const;

// [label, textColor, borderColor, bgColor]
export const BADGE: Record<string, [string, string, string, string]> = {
  mcq:     ['MCQ',     '#5b9fff', 'rgba(91,159,255,.4)',  'rgba(91,159,255,.1)'],
  tf:      ['T/F',     '#ffc940', 'rgba(255,201,64,.4)',  'rgba(255,201,64,.1)'],
  fill:    ['FILL',    '#c084fc', 'rgba(192,132,252,.4)', 'rgba(192,132,252,.1)'],
  explain: ['EXPLAIN', '#00e87a', 'rgba(0,232,122,.4)',   'rgba(0,232,122,.1)'],
  case:    ['CASE',    '#fb923c', 'rgba(251,146,60,.4)',  'rgba(251,146,60,.1)'],
};

export const STRIPE: Record<string, string> = {
  mcq:     '#5b9fff',
  tf:      '#ffc940',
  fill:    '#c084fc',
  explain: '#00e87a',
  case:    '#fb923c',
};

// [label, color]
export const DIFF: Record<string, [string, string]> = {
  easy:   ['◐ Easy',   '#00e87a'],
  medium: ['◑ Medium', '#ffc940'],
  hard:   ['● Hard',   '#ff4d6d'],
};
