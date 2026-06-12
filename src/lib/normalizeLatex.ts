import katex from "katex";
import { katexMacros } from "./katexMacros";

/**
 * コマンドの同義語マップ（正規化時に左辺 → 右辺に統一する）
 */
const SYNONYMS: Record<string, string> = {
  "\\to": "\\rightarrow",
  "\\gets": "\\leftarrow",
  "\\le": "\\leq",
  "\\ge": "\\geq",
  "\\ne": "\\neq",
  "\\neq": "\\neq",
  "\\dfrac": "\\frac",
  "\\tfrac": "\\frac",
  "\\cdotp": "\\cdot",
  "\\land": "\\wedge",
  "\\lor": "\\vee",
  "\\lnot": "\\neg",
  "\\owns": "\\ni",
  "\\bm": "\\boldsymbol",
  "\\curl": "\\rot",
  "\\infin": "\\infty",
  "\\implies": "\\Rightarrow",
  "\\impliedby": "\\Leftarrow",
};

/** LaTeX 文字列をトークン列に分解する（空白は区切りとしてのみ機能し、出力には残らない） */
export function tokenizeLatex(input: string): string[] {
  const tokens: string[] = [];
  const re = /\\[a-zA-Z]+|\\.|[^\s]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    tokens.push(m[0]);
  }
  return tokens;
}

/** `{` 単一トークン `}` のような冗長な中括弧を再帰的に除去する */
function stripRedundantBraces(tokens: string[]): string[] {
  let changed = true;
  let current = tokens;
  while (changed) {
    changed = false;
    const next: string[] = [];
    for (let i = 0; i < current.length; i++) {
      if (
        current[i] === "{" &&
        i + 2 < current.length &&
        current[i + 2] === "}" &&
        current[i + 1] !== "{" &&
        current[i + 1] !== "}" &&
        // 単一トークンが添字対象になり得るコマンドの場合は除去しても等価
        true
      ) {
        next.push(current[i + 1]);
        i += 2;
        changed = true;
      } else {
        next.push(current[i]);
      }
    }
    current = next;
  }
  return current;
}

/**
 * 表記揺れを吸収する正規化関数。
 * - 空白の有無を無視
 * - 省略可能な中括弧（\frac12 と \frac{1}{2} など）を統一
 * - コマンドの同義語（\to と \rightarrow など）を統一
 * - \bm → \boldsymbol などマクロ同義語も統一
 */
export function normalizeLatex(input: string): string {
  let tokens = tokenizeLatex(input);
  // 同義語の統一
  tokens = tokens.map((t) => SYNONYMS[t] ?? t);
  // 冗長な中括弧の除去（{x} → x を再帰的に）
  tokens = stripRedundantBraces(tokens);
  // 再結合：コマンド直後に英字が続く場合はスペースで区切る（\mathrm d が \mathrmd にならないように）
  let out = "";
  for (const t of tokens) {
    if (out !== "" && /\\[a-zA-Z]+$/.test(out) && /^[a-zA-Z]/.test(t)) {
      out += " " + t;
    } else {
      out += t;
    }
  }
  return out;
}

/**
 * ローマン体の揺れを無視する正規化。
 * 「ローマン体は \mathrm でも可」: \mathrm{d}x と dx、\dd x と dx を同一視する。
 * \mathrm / \text / \textrm / \rm のラップを外し、\dd を素の d に展開してから
 * 通常の正規化を行う。
 */
export function normalizeLatexRomanInsensitive(input: string): string {
  let s = input;
  // \dd → d（physics マクロのローマン体 d も素の d と同一視）
  s = s.replace(/\\dd\b/g, "d");
  // \mathrm{...} などのラップを除去（ネストは浅いので繰り返し適用）
  const wrapRe = /\\(?:mathrm|textrm|text|rm)\s*\{([^{}]*)\}/g;
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(wrapRe, "$1");
  }
  // 引数括弧なしの \mathrm d のような形（次の1トークンに作用）はトークン除去で対応
  s = s.replace(/\\(?:mathrm|textrm|rm)\b/g, "");
  return normalizeLatex(s);
}

/** KaTeX レンダリング結果（HTML）を取得。失敗時は null */
function renderOrNull(latex: string): string | null {
  try {
    return katex.renderToString(latex, {
      displayMode: true,
      macros: { ...katexMacros },
      throwOnError: true,
      strict: false,
      trust: false,
      // MathML には元入力の LaTeX 文字列がそのまま埋め込まれるため、
      // 意味比較には HTML 出力のみを使う
      output: "html",
    });
  } catch {
    return null;
  }
}

/**
 * 2つの LaTeX 文字列が「意味的に同じ出力」になるかを判定する。
 * 1. KaTeX のレンダリング結果（HTML）が一致すれば正解
 *    → 空白・省略括弧・同義語・マクロ展開の揺れをすべて吸収できる
 * 2. レンダリング不能な場合は正規化文字列の比較にフォールバック
 */
export function latexEquals(input: string, target: string): boolean {
  const a = input.trim();
  const b = target.trim();
  if (!a) return false;
  if (a === b) return true;

  const ra = renderOrNull(a);
  const rb = renderOrNull(b);
  if (ra !== null && rb !== null && ra === rb) return true;
  // レンダリングが異なる／できない場合は正規化文字列で比較
  if (normalizeLatex(a) === normalizeLatex(b)) return true;
  // さらにローマン体の揺れ（\mathrm{d}x と dx など）を無視して比較
  return (
    normalizeLatexRomanInsensitive(a) === normalizeLatexRomanInsensitive(b)
  );
}
