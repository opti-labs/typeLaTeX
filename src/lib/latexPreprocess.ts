/**
 * physics パッケージの導関数マクロ \pdv / \dv を、省略可能引数（階数）込みで
 * \frac 形に自前展開する前処理。
 * KaTeX のマクロ文字列定義は省略可能引数 [n] を扱えないため、
 * レンダリング前（LatexRenderer）と判定の正準化前（canonicalize）の両方で適用する。
 *
 * 対応する形:
 *   \pdv[2]{x}{t} → \frac{\partial^{2} x}{\partial t^{2}}   （n 階偏微分）
 *   \pdv{f}{x}    → \frac{\partial f}{\partial x}
 *   \pdv{x}       → \frac{\partial}{\partial x}              （演算子形）
 *   \dv[2]{x}{t}  → \frac{\mathrm{d}^{2} x}{\mathrm{d} t^{2}}
 *   \dv{f}{x}     → \frac{\mathrm{d} f}{\mathrm{d} x}
 *   \dv{x}        → \frac{\mathrm{d}}{\mathrm{d} x}
 */

const DERIV_D: Record<string, string> = {
  "\\pdv": "\\partial",
  "\\dv": "\\mathrm{d}",
};

/** s[i] の開き括弧に対応する閉じ括弧までを読む。中身と閉じ括弧直後の位置を返す */
function readGroup(
  s: string,
  i: number,
  open: string,
  close: string,
): { content: string; end: number } | null {
  if (s[i] !== open) return null;
  let depth = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === open) depth++;
    else if (s[j] === close) {
      depth--;
      if (depth === 0) return { content: s.slice(i + 1, j), end: j + 1 };
    }
  }
  return null;
}

function skipSpaces(s: string, i: number): number {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
}

/** cmd（例 "\\pdv"）の出現位置を探す。直後が英字の場合（別コマンド）は除外 */
function findCommand(s: string, cmd: string): number {
  let from = 0;
  for (;;) {
    const idx = s.indexOf(cmd, from);
    if (idx < 0) return -1;
    const after = s[idx + cmd.length];
    if (after === undefined || !/[a-zA-Z]/.test(after)) return idx;
    from = idx + cmd.length;
  }
}

export function expandDerivatives(input: string): string {
  let s = input;
  let guard = 0;
  let changed = true;
  while (changed && guard++ < 50) {
    changed = false;
    for (const cmd of ["\\pdv", "\\dv"]) {
      const idx = findCommand(s, cmd);
      if (idx < 0) continue;

      let i = idx + cmd.length;
      i = skipSpaces(s, i);

      // 省略可能な階数 [n]
      let order = "";
      if (s[i] === "[") {
        const g = readGroup(s, i, "[", "]");
        if (g) {
          order = g.content.trim();
          i = skipSpaces(s, g.end);
        }
      }

      // 第1引数 {…}
      if (s[i] !== "{") continue; // 想定外の形はそのまま残す
      const g1 = readGroup(s, i, "{", "}");
      if (!g1) continue;

      const d = DERIV_D[cmd];
      const j = skipSpaces(s, g1.end);
      let replacement: string;
      let end: number;

      if (s[j] === "{") {
        // 2 引数形 \pdv{f}{x}
        const g2 = readGroup(s, j, "{", "}");
        if (!g2) continue;
        replacement = order
          ? `\\frac{${d}^{${order}} ${g1.content}}{${d} ${g2.content}^{${order}}}`
          : `\\frac{${d} ${g1.content}}{${d} ${g2.content}}`;
        end = g2.end;
      } else {
        // 演算子形 \pdv{x}
        replacement = order
          ? `\\frac{${d}^{${order}}}{${d} ${g1.content}^{${order}}}`
          : `\\frac{${d}}{${d} ${g1.content}}`;
        end = g1.end;
      }

      s = s.slice(0, idx) + replacement + s.slice(end);
      changed = true;
      break; // s が変わったので最初から探し直す
    }
  }
  return s;
}
