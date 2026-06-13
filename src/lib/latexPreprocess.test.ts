import { describe, it, expect } from "vitest";
import { expandDerivatives } from "./latexPreprocess";

describe("expandDerivatives", () => {
  it("\\pdv[2]{x}{t} を n 階偏微分に展開", () => {
    expect(expandDerivatives("\\pdv[2]{x}{t}")).toBe(
      "\\frac{\\partial^{2} x}{\\partial t^{2}}",
    );
  });
  it("\\pdv{f}{x}（階数なし）", () => {
    expect(expandDerivatives("\\pdv{f}{x}")).toBe(
      "\\frac{\\partial f}{\\partial x}",
    );
  });
  it("\\pdv{x}（演算子形）", () => {
    expect(expandDerivatives("\\pdv{x}")).toBe("\\frac{\\partial}{\\partial x}");
  });
  it("\\dv[2]{x}{t}", () => {
    expect(expandDerivatives("\\dv[2]{x}{t}")).toBe(
      "\\frac{\\mathrm{d}^{2} x}{\\mathrm{d} t^{2}}",
    );
  });
  it("ネストした引数も扱える", () => {
    expect(expandDerivatives("\\pdv[2]{\\psi}{x}")).toBe(
      "\\frac{\\partial^{2} \\psi}{\\partial x^{2}}",
    );
  });
  it("複数出現を順に展開", () => {
    expect(expandDerivatives("\\pdv[2]{u}{t} = c^2 \\pdv[2]{u}{x}")).toBe(
      "\\frac{\\partial^{2} u}{\\partial t^{2}} = c^2 \\frac{\\partial^{2} u}{\\partial x^{2}}",
    );
  });
  it("導関数マクロを含まない式はそのまま", () => {
    expect(expandDerivatives("\\frac{1}{2} + x^2")).toBe("\\frac{1}{2} + x^2");
  });
});
