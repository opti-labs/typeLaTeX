import { describe, it, expect } from "vitest";
import { normalizeLatex, latexEquals, tokenizeLatex } from "./normalizeLatex";

describe("tokenizeLatex", () => {
  it("コマンド・記号・文字に分解する", () => {
    expect(tokenizeLatex("\\frac{1}{2}")).toEqual([
      "\\frac",
      "{",
      "1",
      "}",
      "{",
      "2",
      "}",
    ]);
  });
  it("空白を無視する", () => {
    expect(tokenizeLatex("x + y")).toEqual(["x", "+", "y"]);
  });
});

describe("normalizeLatex: 空白の揺れ", () => {
  it("スペースの有無を無視する", () => {
    expect(normalizeLatex("\\int x dx")).toBe(normalizeLatex("\\int xdx"));
  });
  it("コマンド境界は維持する（\\mathrm d が壊れない）", () => {
    expect(normalizeLatex("\\mathrm d x")).not.toContain("\\mathrmd");
  });
});

describe("normalizeLatex: 省略可能な中括弧", () => {
  it("\\frac12 と \\frac{1}{2} を同一視", () => {
    expect(normalizeLatex("\\frac{1}{2}")).toBe(normalizeLatex("\\frac12"));
  });
  it("\\sqrt2 と \\sqrt{2} を同一視", () => {
    expect(normalizeLatex("\\sqrt{2}")).toBe(normalizeLatex("\\sqrt2"));
  });
  it("ネストした冗長括弧 {{x}} も除去", () => {
    expect(normalizeLatex("{{x}}")).toBe("x");
  });
  it("複数トークンの括弧は維持する", () => {
    expect(normalizeLatex("\\frac{a+b}{2}")).not.toBe(
      normalizeLatex("\\frac a+b2"),
    );
  });
});

describe("normalizeLatex: コマンドの同義語", () => {
  it("\\to と \\rightarrow を同一視", () => {
    expect(normalizeLatex("x \\to 0")).toBe(normalizeLatex("x \\rightarrow 0"));
  });
  it("\\le と \\leq を同一視", () => {
    expect(normalizeLatex("a \\le b")).toBe(normalizeLatex("a \\leq b"));
  });
  it("\\dfrac と \\frac を同一視", () => {
    expect(normalizeLatex("\\dfrac{1}{2}")).toBe(normalizeLatex("\\frac{1}{2}"));
  });
});

describe("latexEquals: レンダリング比較による意味的一致", () => {
  it("空白の揺れを吸収する", () => {
    expect(latexEquals("\\int x^2 \\, dx", "\\int x^2 \\,dx")).toBe(true);
  });
  it("\\frac12 と \\frac{1}{2}", () => {
    expect(latexEquals("\\frac12", "\\frac{1}{2}")).toBe(true);
  });
  it("\\bm{v} と \\boldsymbol{v} を同一視（マクロ展開）", () => {
    expect(latexEquals("\\bm{v}", "\\boldsymbol{v}")).toBe(true);
  });
  it("\\to と \\rightarrow を同一視", () => {
    expect(latexEquals("x \\to \\infty", "x \\rightarrow \\infty")).toBe(true);
  });
  it("\\grad と \\nabla を同一視（physics マクロ）", () => {
    expect(latexEquals("\\grad f", "\\nabla f")).toBe(true);
  });
  it("\\rot と \\nabla\\times を同一視", () => {
    expect(latexEquals("\\rot \\bm{E}", "\\nabla\\times\\boldsymbol{E}")).toBe(
      true,
    );
  });
  it("\\dd x と \\mathrm{d}x を同一視", () => {
    expect(latexEquals("\\dd x", "\\mathrm{d}x")).toBe(true);
  });
  it("異なる数式は不正解", () => {
    expect(latexEquals("x^2", "x^3")).toBe(false);
    expect(latexEquals("\\frac{1}{2}", "\\frac{1}{3}")).toBe(false);
  });
  it("空入力は不正解", () => {
    expect(latexEquals("", "x")).toBe(false);
    expect(latexEquals("   ", "x")).toBe(false);
  });
  it("構文エラーの入力は正規化フォールバックで判定", () => {
    expect(latexEquals("\\frac{1}{", "\\frac{1}{2}")).toBe(false);
  });
  it("ローマン体: \\mathrm{d}x と dx を同一視", () => {
    expect(latexEquals("\\int x^2 \\mathrm{d}x", "\\int x^2 dx")).toBe(true);
  });
  it("ローマン体: \\dd x と dx を同一視", () => {
    expect(latexEquals("\\dd x", "dx")).toBe(true);
    expect(latexEquals("dx", "\\dd x")).toBe(true);
  });
  it("ローマン体: \\mathrm{tr} と tr を同一視", () => {
    expect(latexEquals("\\mathrm{tr}(AB)", "tr(AB)")).toBe(true);
  });
  it("ローマン体でも中身が違えば不正解", () => {
    expect(latexEquals("\\mathrm{d}y", "dx")).toBe(false);
  });
  it("braket 記法", () => {
    expect(latexEquals("\\braket{\\phi|\\psi}", "\\braket{\\phi | \\psi}")).toBe(
      true,
    );
  });
});

describe("latexEquals: 追加の表記許容ルール", () => {
  it("積分と dx の間の \\, は省略可", () => {
    expect(latexEquals("\\int x^2 dx", "\\int x^2 \\, dx")).toBe(true);
    expect(latexEquals("\\int x^2 \\, dx", "\\int x^2 dx")).toBe(true);
  });
  it("\\; \\: \\! \\quad などの空白コマンドも省略可", () => {
    expect(latexEquals("a b", "a \\quad b")).toBe(true);
    expect(latexEquals("a+b", "a\\!+\\;b")).toBe(true);
  });
  it("\\frac は 1 文字引数なら {} 不要", () => {
    expect(latexEquals("\\frac lg", "\\frac{l}{g}")).toBe(true);
    expect(latexEquals("T = 2\\pi\\sqrt{\\frac lg}", "T = 2\\pi\\sqrt{\\frac{l}{g}}")).toBe(true);
    expect(latexEquals("\\frac12", "\\frac{1}{2}")).toBe(true);
  });
  it("絶対値は | / \\lvert\\rvert / \\abs のいずれでも可", () => {
    expect(latexEquals("\\lvert x \\rvert", "|x|")).toBe(true);
    expect(latexEquals("\\abs{x}", "|x|")).toBe(true);
    expect(latexEquals("\\abs{x}", "\\lvert x \\rvert")).toBe(true);
    expect(latexEquals("\\left| x \\right|", "|x|")).toBe(true);
  });
  it("プライムは ' でも \\prime でも可", () => {
    expect(latexEquals("f'(x)", "f^{\\prime}(x)")).toBe(true);
    expect(latexEquals("f'", "f\\prime")).toBe(true);
    expect(latexEquals("x'", "x^\\prime")).toBe(true);
  });
  it("分数は \\frac でも {A \\over B} でも可", () => {
    expect(latexEquals("\\frac{a}{b}", "{a \\over b}")).toBe(true);
    expect(latexEquals("{a+b \\over c}", "\\frac{a+b}{c}")).toBe(true);
  });
  it("中身が違う絶対値・分数は不正解のまま", () => {
    expect(latexEquals("\\abs{x}", "|y|")).toBe(false);
    expect(latexEquals("{a \\over b}", "\\frac{a}{c}")).toBe(false);
  });
});

describe("latexEquals: 微分の d は通常の d でも \\dd でも可（全問題統一）", () => {
  it("dx ⇔ \\dd x ⇔ \\mathrm{d}x", () => {
    expect(latexEquals("\\int x^2 dx", "\\int x^2 \\, \\dd x")).toBe(true);
    expect(latexEquals("\\int x^2 \\dd x", "\\int x^2 dx")).toBe(true);
    expect(latexEquals("\\int x^2 \\mathrm{d}x", "\\int x^2 \\dd x")).toBe(true);
  });
  it("ガウス積分: dx 表記でも \\, \\dd x の模範解答に一致", () => {
    expect(
      latexEquals(
        "\\int_{-\\infty}^{\\infty} e^{-x^2} dx=\\sqrt \\pi",
        "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, \\dd x = \\sqrt{\\pi}",
      ),
    ).toBe(true);
  });
});

describe("latexEquals: スクリーンショットの実ケース（AST比較）", () => {
  it("立方数の和: 上付き・下付きの順序が逆でも可", () => {
    expect(
      latexEquals(
        "\\sum^n_{k=1}k^3=\\left\\{ \\frac{n(n+1)}{2}\\right\\}^2",
        "\\sum_{k=1}^{n} k^3 = \\left\\{ \\frac{n(n+1)}{2} \\right\\}^2",
      ),
    ).toBe(true);
  });
  it("倍角: スペースの有無", () => {
    expect(
      latexEquals(
        "\\cos2\\theta=1-2\\sin^2\\theta",
        "\\cos 2\\theta = 1 - 2\\sin^2\\theta",
      ),
    ).toBe(true);
  });
  it("単振り子: \\sqrt\\frac lg（中括弧省略）", () => {
    expect(
      latexEquals("T=2\\pi\\sqrt\\frac lg", "T = 2\\pi\\sqrt{\\frac{l}{g}}"),
    ).toBe(true);
  });
});
