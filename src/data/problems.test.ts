import { describe, it, expect } from "vitest";
import katex from "katex";
import { PROBLEMS, timeLimitFor } from "./problems";
import { katexMacros } from "../lib/katexMacros";

describe("問題データ", () => {
  it("ID が重複していない", () => {
    const ids = PROBLEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(PROBLEMS.map((p) => [p.id, p.label, p.latex]))(
    "%s（%s）が KaTeX でレンダリングできる",
    (_id, _label, latex) => {
      expect(() =>
        katex.renderToString(latex, {
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
