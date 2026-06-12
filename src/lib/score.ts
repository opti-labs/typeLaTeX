import { DIFFICULTY_INFO, type Problem } from "../data/problems";

/** 数式の実質文字数（空白除外） */
export function latexLength(problem: Problem): number {
  return problem.latex.replace(/\s+/g, "").length;
}

export type ScoreBreakdown = {
  /** 基本点 = 数式の長さ × 難易度倍率 × 10 */
  base: number;
  /** タイムボーナス = 余った秒数 × 難易度倍率 × 5 */
  timeBonus: number;
  total: number;
};

/**
 * 正解した問題のスコア内訳を計算する。
 * 個別の問題点（基本点）に加えて、余った時間に応じたタイムボーナスを加算。
 */
export function scoreBreakdownFor(
  problem: Problem,
  remainingSeconds: number,
): ScoreBreakdown {
  const mult = DIFFICULTY_INFO[problem.difficulty].multiplier;
  const base = Math.round(latexLength(problem) * mult * 10);
  const timeBonus = Math.round(Math.max(0, remainingSeconds) * mult * 5);
  return { base, timeBonus, total: base + timeBonus };
}

export type QuestionStatus = "correct" | "incorrect" | "pass" | "timeout";

export type QuestionResult = {
  problem: Problem;
  status: QuestionStatus;
  /** 合計スコア（基本点＋タイムボーナス）。不正解/Pass/時間切れは0 */
  score: number;
  /** 基本点 */
  base: number;
  /** タイムボーナス */
  timeBonus: number;
  /** 正解時の残り秒数 */
  remaining: number;
  /** 最後に入力していた内容 */
  finalInput: string;
};
