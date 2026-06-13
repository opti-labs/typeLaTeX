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

/**
 * 表記の揺れを「同じ意味なら同じ文字列」に寄せる正準化。
 * latexEquals がレンダリング比較する前に input/target の両方へ適用するので、
 * 見た目（位置やデリミタの種類）が多少違っても同一視できる。
 *
 * 吸収する揺れ:
 * - 空白コマンド `\,` `\;` `\:` `\!` `\quad` `\qquad` `\ `（積分と dx の間など）は無くても可
 * - デリミタの自動サイズ `\left` `\right` は無視（`\left\langle` ⇔ `\langle`）
 * - 絶対値・縦棒: `\lvert` `\rvert` `\vert` `\abs{…}` を素の `|…|` に統一
 * - プライム: `\prime` / `^{\prime}` / `^{\prime\prime}`（多重）/ `^'` を `'` に統一
 * - 中置分数: `{A \over B}` を `\frac{A}{B}` に統一
 * - 微分の d: `\dd` と素の `d` を同一視
 * - 空の中括弧 `{}`（`{}_n` ⇔ `_n`）を除去
 */
export function canonicalize(latex: string): string {
  let s = latex;

  // --- 空白コマンドの除去 ---
  s = s.replace(/\\[,;:!]/g, "");
  s = s.replace(/\\(?:quad|qquad)\b/g, "");
  s = s.replace(/\\ /g, "");

  // --- デリミタの自動サイズ \left \right を無視 ---
  //     \left\langle ⇔ \langle、\left| ⇔ |、\left( ⇔ ( など
  s = s.replace(/\\left\b/g, "").replace(/\\right\b/g, "");

  // --- 中置分数 {A \over B} → \frac{A}{B} ---
  let prevOver = "";
  while (prevOver !== s) {
    prevOver = s;
    s = s.replace(/\{([^{}]*?)\\over\b([^{}]*?)\}/g, "\\frac{$1}{$2}");
  }

  // --- 絶対値・縦棒デリミタを | に統一 ---
  s = s.replace(/\\vert\b/g, "|");
  s = s.replace(/\\lvert\b/g, "|").replace(/\\rvert\b/g, "|");
  let prevAbs = "";
  while (prevAbs !== s) {
    prevAbs = s;
    s = s.replace(/\\abs\s*\{([^{}]*)\}/g, "|$1|");
  }

  // --- プライムを ' に統一（多重プライム・上付き表記も含む） ---
  s = s.replace(/\\prime/g, "'");
  s = s.replace(/\^\s*\{\s*('+)\s*\}/g, "$1"); // ^{''} → ''
  s = s.replace(/\^\s*('+)/g, "$1"); //          ^'   → '

  // --- 微分の d を統一: \dd（physics の upright d）と素の d を同一視 ---
  //     「微分の d は通常の d でも \dd でも正解」を全問題で実現する。
  s = s.replace(/\\dd\b/g, "d");

  // --- 空の中括弧 {} を除去（{}_n と _n を同一視） ---
  s = s.replace(/\{\}(?=[_^])/g, "");

  return s;
}

/**
 * AST 比較用のマクロセット。表示用の katexMacros とは別に、
 * デリミタを自動サイズ（\left\right）にしない素の形へ展開する。
 * これにより `\braket{\phi|\psi}` と手書きの `\langle\phi|\psi\rangle`、
 * `\abs{x}` と `|x|` などが同じ AST になる。
 */
const comparisonMacros: Record<string, string> = {
  ...katexMacros,
  "\\abs": "|#1|",
  "\\norm": "\\|#1\\|",
  "\\bra": "\\langle #1|",
  "\\ket": "|#1\\rangle",
  "\\braket": "\\langle #1\\rangle",
  "\\ketbra": "|#1\\rangle\\langle #2|",
  "\\ev": "\\langle #1\\rangle",
  "\\comm": "[#1,#2]",
};

/**
 * KaTeX のパースツリー（AST）を正準化した文字列キーを返す。
 * AST 比較により、HTML レンダリング比較では吸収しきれない次の揺れを同一視する:
 * - 中括弧の省略（`\frac lg` ⇔ `\frac{l}{g}`、`\sqrt2` ⇔ `\sqrt{2}`）
 *   → 1 要素だけの ordgroup を取り除いて比較
 * - 上付き・下付きの順序（`\sum^n_{k=1}` ⇔ `\sum_{k=1}^{n}`）
 *   → supsub ノードは sub/sup をフィールドで持つため順序非依存。さらにキーをソート
 * canonicalize で空白・絶対値・プライム・\dd・中置分数を吸収してからパースする。
 * 失敗時は null。
 */
function astKey(latex: string): string | null {
  try {
    // katex.__parse は AST（ParseNode[]）を返す内部 API
    const tree = (
      katex as unknown as {
        __parse: (e: string, o: object) => unknown;
      }
    ).__parse(canonicalize(latex), {
      macros: { ...comparisonMacros },
      throwOnError: true,
      strict: false,
    });
    return stableStringify(stripAst(tree));
  } catch {
    return null;
  }
}

/** AST を正準化: loc（ソース位置）を除去し、1 要素 ordgroup を展開する */
function stripAst(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(stripAst);
  if (node && typeof node === "object") {
    const n = node as Record<string, unknown>;
    // 1 要素だけの ordgroup（= 冗長な中括弧）は中身に展開して括弧の有無を無視
    if (n.type === "ordgroup" && Array.isArray(n.body) && n.body.length === 1) {
      return stripAst(n.body[0]);
    }
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(n)) {
      if (k === "loc") continue; // ソース位置は意味に無関係
      out[k] = stripAst(n[k]);
    }
    return out;
  }
  return node;
}

/** オブジェクトのキー順に依存しない安定した JSON 文字列化 */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(val as object).sort()) {
        sorted[k] = (val as Record<string, unknown>)[k];
      }
      return sorted;
    }
    return val;
  });
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

  // 1) AST（パースツリー）比較 — メインの判定
  //    中括弧の省略・上下付きの順序・空白・\dd/d・絶対値・プライム・中置分数を吸収
  const ka = astKey(a);
  const kb = astKey(b);
  if (ka !== null && kb !== null && ka === kb) return true;

  // 2) 素のままレンダリング比較（AST が取れない構文のフォールバック）
  const ra = renderOrNull(a);
  const rb = renderOrNull(b);
  if (ra !== null && rb !== null && ra === rb) return true;

  // 3) 正準化してからレンダリング比較
  const ca = canonicalize(a);
  const cb = canonicalize(b);
  const rca = renderOrNull(ca);
  const rcb = renderOrNull(cb);
  if (rca !== null && rcb !== null && rca === rcb) return true;

  // 4) 文字列正規化での比較（レンダリング不能時のフォールバック）
  if (normalizeLatex(a) === normalizeLatex(b)) return true;
  if (normalizeLatex(ca) === normalizeLatex(cb)) return true;
  // 5) さらにローマン体の揺れ（\mathrm{d}x と dx など）を無視して比較
  return (
    normalizeLatexRomanInsensitive(a) === normalizeLatexRomanInsensitive(b)
  );
}
