/**
 * KaTeX カスタムマクロ定義
 * physics / bm / braket パッケージ相当のコマンドをサポートする。
 * 正誤判定（レンダリング結果の比較）でも同じマクロセットを使うことで、
 * 「\bm{v} と \boldsymbol{v}」のような展開後の同一視を実現する。
 */
export const katexMacros: Record<string, string> = {
  // ===== physics パッケージ相当 =====
  // 微分の d（\dd x / \dd{x} のどちらでも使える）
  "\\dd": "\\mathrm{d}",
  // 偏微分記号の短縮
  "\\pd": "\\partial",
  // 常微分・偏微分（2引数）
  "\\dv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
  "\\pdv": "\\frac{\\partial #1}{\\partial #2}",
  // ベクトル解析
  "\\grad": "\\nabla",
  "\\div": "\\nabla\\cdot",
  "\\rot": "\\nabla\\times",
  "\\curl": "\\nabla\\times",
  "\\laplacian": "\\nabla^2",
  // その他 physics 系
  "\\abs": "\\left|#1\\right|",
  "\\norm": "\\left\\|#1\\right\\|",
  "\\ev": "\\left\\langle #1 \\right\\rangle",
  "\\comm": "\\left[#1, #2\\right]",
  "\\order": "\\mathcal{O}\\left(#1\\right)",
  "\\vb": "\\mathbf{#1}",

  // ===== bm パッケージ相当 =====
  "\\bm": "\\boldsymbol{#1}",

  // ===== braket パッケージ =====
  // KaTeX は \bra, \ket, \braket をネイティブサポートしているが、
  // マクロとして明示定義することでバージョン差異を吸収する。
  "\\bra": "\\left\\langle #1 \\right|",
  "\\ket": "\\left| #1 \\right\\rangle",
  "\\braket": "\\left\\langle #1 \\right\\rangle",
  "\\ketbra": "\\left| #1 \\middle\\rangle\\!\\middle\\langle #2 \\right|",
};
