/**
 * 客户答案数据结构
 * 存储在 localStorage: dm_answers
 */
export interface Answer {
  slideIndex: number;
  question: string;
  chapter: string;
  transcript: string;
  updatedAt: string;
}

export type AnswersMap = Record<number, Answer>;
