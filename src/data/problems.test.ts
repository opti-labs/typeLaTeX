import { describe, it, expect } from "vitest";
import katex from "katex";
import {
  PROBLEMS,
  getProblemPool,
  pickUnusedProblem,
  timeLimitFor,
} from "./problems";
import { katexMacros } from "../lib/katexMacros";
import { expandDerivatives } from "../lib/latexPreprocess";

describe("問題データ", () => {
  it("ID が重複していない", () => {
    const ids = PROBLEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PROBLEMS.map((p) => [p.id, p.label, p.latex]))(
    "%s（%s）が KaTeX でレンダリングできる",
    (_id, _label, latex) => {
      expect(() =>
        katex.renderToString(expandDerivatives(latex), {
          displayMode: true,
          macros: { ...katexMacros },
          throwOnError: true,
          strict: false,
        }),
      ).not.toThrow();
    },
  );

  it("制限時間は 20〜60 秒の範囲", () => {
    for (const p of PROBLEMS) {
      const t = timeLimitFor(p);
      expect(t).toBeGreaterThanOrEqual(20);
      expect(t).toBeLessThanOrEqual(60);
    }
  });
});

describe("pickUnusedProblem（5秒以内Passの差し替え用）", () => {
  it("既出の ID は選ばない", () => {
    const used = new Set<string>();
    const pool = getProblemPool("highschool");
    // プールを 1 問残してすべて使用済みにする
    pool.slice(1).forEach((p) => used.add(p.id));
    const picked = pickUnusedProblem("highschool", used);
    expect(picked).not.toBeNull();
    expect(picked!.id).toBe(pool[0].id);
    expect(used.has(picked!.id)).toBe(false);
  });

  it("候補が尽きたら null", () => {
    const used = new Set(getProblemPool("highschool").map((p) => p.id));
    expect(pickUnusedProblem("highschool", used)).toBeNull();
  });

  it("複合プールは全範囲から選ぶ", () => {
    const picked = pickUnusedProblem("mixed", new Set());
    expect(picked).not.toBeNull();
    expect(PROBLEMS.some((p) => p.id === picked!.id)).toBe(true);
  });
});
