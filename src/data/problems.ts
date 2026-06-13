export type Difficulty = "highschool" | "university" | "mixed";

export type Problem = {
  id: string;
  difficulty: Difficulty;
  /** 模範 LaTeX コード */
  latex: string;
  /** 数式の名前・説明（復習画面用） */
  label: string;
};

export const DIFFICULTY_INFO: Record<
  Difficulty,
  { name: string; multiplier: number; description: string; accent: string }
> = {
  highschool: {
    name: "高校範囲",
    multiplier: 1.0,
    description: "微積分・ベクトル・三角関数・力学の基本式",
    accent: "emerald",
  },
  university: {
    name: "大学範囲",
    multiplier: 1.5,
    description: "線形代数・解析学・電磁気学・量子力学",
    accent: "blue",
  },
  mixed: {
    name: "複合範囲",
    multiplier: 2.0,
    description: "全範囲ミックス＋高度な数理物理",
    accent: "purple",
  },
};

export const PROBLEMS: Problem[] = [
  // ===== 高校範囲（数学） =====
  { id: "h1", difficulty: "highschool", latex: "\\int x^2 \\, dx = \\frac{x^3}{3} + C", label: "不定積分" },
  { id: "h2", difficulty: "highschool", latex: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta", label: "ベクトルの内積" },
  { id: "h3", difficulty: "highschool", latex: "\\sin^2\\theta + \\cos^2\\theta = 1", label: "三角関数の基本公式" },
  { id: "h4", difficulty: "highschool", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", label: "二次方程式の解の公式" },
  { id: "h5", difficulty: "highschool", latex: "\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}", label: "自然数の和" },
  { id: "h6", difficulty: "highschool", latex: "\\sum_{k=1}^{n} k^2 = \\frac{n(n+1)(2n+1)}{6}", label: "平方数の和" },
  { id: "h7", difficulty: "highschool", latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1", label: "三角関数の極限" },
  { id: "h8", difficulty: "highschool", latex: "a^2 = b^2 + c^2 - 2bc\\cos A", label: "余弦定理" },
  { id: "h9", difficulty: "highschool", latex: "\\frac{a}{\\sin A} = 2R", label: "正弦定理" },
  { id: "h10", difficulty: "highschool", latex: "\\frac{d}{dx} \\sin x = \\cos x", label: "sin の微分" },
  { id: "h11", difficulty: "highschool", latex: "\\frac{d}{dx} e^x = e^x", label: "指数関数の微分" },
  { id: "h12", difficulty: "highschool", latex: "\\log_a MN = \\log_a M + \\log_a N", label: "対数の性質" },
  { id: "h13", difficulty: "highschool", latex: "\\sin(\\alpha + \\beta) = \\sin\\alpha\\cos\\beta + \\cos\\alpha\\sin\\beta", label: "加法定理" },
  { id: "h14", difficulty: "highschool", latex: "\\cos 2\\theta = 1 - 2\\sin^2\\theta", label: "倍角の公式" },
  { id: "h15", difficulty: "highschool", latex: "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}", label: "tan の定義" },
  { id: "h16", difficulty: "highschool", latex: "S = \\frac{1}{2}ab\\sin C", label: "三角形の面積" },
  { id: "h17", difficulty: "highschool", latex: "(a+b)^2 = a^2 + 2ab + b^2", label: "展開公式" },
  { id: "h18", difficulty: "highschool", latex: "y = a(x-p)^2 + q", label: "二次関数の標準形" },
  { id: "h19", difficulty: "highschool", latex: "\\sqrt{a^2} = |a|", label: "根号と絶対値" },
  { id: "h20", difficulty: "highschool", latex: "{}_n \\mathrm{C}_r = \\frac{n!}{r!(n-r)!}", label: "組合せ" },

  // ===== 高校範囲（物理） =====
  { id: "h21", difficulty: "highschool", latex: "v = v_0 + at", label: "等加速度運動の速度" },
  { id: "h22", difficulty: "highschool", latex: "x = v_0 t + \\frac{1}{2}at^2", label: "等加速度運動の変位" },
  { id: "h23", difficulty: "highschool", latex: "v^2 - v_0^2 = 2ax", label: "等加速度運動（時間消去）" },
  { id: "h24", difficulty: "highschool", latex: "F = ma", label: "運動方程式" },
  { id: "h25", difficulty: "highschool", latex: "E = \\frac{1}{2}mv^2", label: "運動エネルギー" },
  { id: "h26", difficulty: "highschool", latex: "F = G\\frac{Mm}{r^2}", label: "万有引力の法則" },
  { id: "h27", difficulty: "highschool", latex: "V = RI", label: "オームの法則" },
  { id: "h28", difficulty: "highschool", latex: "Q = mc\\Delta T", label: "熱量の公式" },
  { id: "h29", difficulty: "highschool", latex: "v = f\\lambda", label: "波の基本式" },
  { id: "h30", difficulty: "highschool", latex: "p = mv", label: "運動量" },
  { id: "h31", difficulty: "highschool", latex: "W = Fx\\cos\\theta", label: "仕事の定義" },
  { id: "h32", difficulty: "highschool", latex: "T = 2\\pi\\sqrt{\\frac{l}{g}}", label: "単振り子の周期" },

  // ===== 高校範囲（数学・追加） =====
  { id: "h33", difficulty: "highschool", latex: "\\int_a^b f(x) \\, dx = F(b) - F(a)", label: "定積分の基本定理" },
  { id: "h34", difficulty: "highschool", latex: "\\frac{d}{dx} x^n = nx^{n-1}", label: "べき関数の微分" },
  { id: "h35", difficulty: "highschool", latex: "\\log_a b = \\frac{\\log_c b}{\\log_c a}", label: "底の変換公式" },
  { id: "h36", difficulty: "highschool", latex: "a_n = a_1 + (n-1)d", label: "等差数列の一般項" },
  { id: "h37", difficulty: "highschool", latex: "S_n = \\frac{a(r^n - 1)}{r - 1}", label: "等比数列の和" },
  { id: "h38", difficulty: "highschool", latex: "\\sum_{k=1}^{n} k^3 = \\left\\{ \\frac{n(n+1)}{2} \\right\\}^2", label: "立方数の和" },
  { id: "h39", difficulty: "highschool", latex: "\\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2", label: "内積の成分表示" },
  { id: "h40", difficulty: "highschool", latex: "\\sin\\theta = \\cos\\left( \\frac{\\pi}{2} - \\theta \\right)", label: "余角の公式" },
  { id: "h41", difficulty: "highschool", latex: "\\frac{d}{dx} \\log x = \\frac{1}{x}", label: "対数関数の微分" },

  // ===== 高校範囲（物理・追加） =====
  { id: "h42", difficulty: "highschool", latex: "a = \\frac{v^2}{r}", label: "向心加速度" },
  { id: "h43", difficulty: "highschool", latex: "F = k\\frac{q_1 q_2}{r^2}", label: "クーロンの法則" },
  { id: "h44", difficulty: "highschool", latex: "P = IV", label: "電力" },
  { id: "h45", difficulty: "highschool", latex: "E = h\\nu", label: "光子のエネルギー" },
  { id: "h46", difficulty: "highschool", latex: "U = mgh", label: "重力による位置エネルギー" },
  { id: "h47", difficulty: "highschool", latex: "x = A\\sin\\omega t", label: "単振動の変位" },
  { id: "h48", difficulty: "highschool", latex: "m_1 v_1 + m_2 v_2 = m_1 v_1' + m_2 v_2'", label: "運動量保存則" },

  // ===== 大学範囲（電磁気学） =====
  { id: "u1", difficulty: "university", latex: "\\rot \\bm{E} = -\\frac{\\partial \\bm{B}}{\\partial t}", label: "ファラデーの法則（マクスウェル方程式）" },
  { id: "u2", difficulty: "university", latex: "\\div \\bm{B} = 0", label: "磁場のガウスの法則" },
  { id: "u3", difficulty: "university", latex: "\\div \\bm{E} = \\frac{\\rho}{\\varepsilon_0}", label: "ガウスの法則" },
  { id: "u4", difficulty: "university", latex: "\\bm{F} = q(\\bm{E} + \\bm{v} \\times \\bm{B})", label: "ローレンツ力" },
  { id: "u5", difficulty: "university", latex: "\\oint_C \\bm{B} \\cdot \\dd\\bm{l} = \\mu_0 I", label: "アンペールの法則" },
  { id: "u6", difficulty: "university", latex: "\\nabla^2 \\phi = -\\frac{\\rho}{\\varepsilon_0}", label: "ポアソン方程式（静電場）" },

  // ===== 大学範囲（量子力学） =====
  { id: "u7", difficulty: "university", latex: "\\hat{H}\\psi = E\\psi", label: "時間に依存しないシュレーディンガー方程式" },
  { id: "u8", difficulty: "university", latex: "i\\hbar \\frac{\\partial}{\\partial t} \\ket{\\psi} = \\hat{H} \\ket{\\psi}", label: "シュレーディンガー方程式" },
  { id: "u9", difficulty: "university", latex: "\\braket{\\phi|\\psi}", label: "内積（ブラケット記法）" },
  { id: "u10", difficulty: "university", latex: "\\braket{\\psi|\\psi} = 1", label: "規格化条件" },
  { id: "u11", difficulty: "university", latex: "[\\hat{x}, \\hat{p}] = i\\hbar", label: "正準交換関係" },
  { id: "u12", difficulty: "university", latex: "\\hat{p} = -i\\hbar\\frac{\\partial}{\\partial x}", label: "運動量演算子" },
  { id: "u13", difficulty: "university", latex: "E = \\hbar\\omega", label: "光量子のエネルギー" },

  // ===== 大学範囲（線形代数） =====
  { id: "u14", difficulty: "university", latex: "A\\bm{x} = \\lambda\\bm{x}", label: "固有値方程式" },
  { id: "u15", difficulty: "university", latex: "\\det(A - \\lambda I) = 0", label: "固有方程式" },
  { id: "u16", difficulty: "university", latex: "(AB)^{-1} = B^{-1}A^{-1}", label: "逆行列の性質" },
  { id: "u17", difficulty: "university", latex: "\\mathrm{tr}(AB) = \\mathrm{tr}(BA)", label: "トレースの巡回性" },
  { id: "u18", difficulty: "university", latex: "\\|\\bm{x} + \\bm{y}\\| \\leq \\|\\bm{x}\\| + \\|\\bm{y}\\|", label: "三角不等式" },

  // ===== 大学範囲（解析学） =====
  { id: "u19", difficulty: "university", latex: "\\int_{-\\infty}^{\\infty} e^{-x^2} \\, \\dd x = \\sqrt{\\pi}", label: "ガウス積分" },
  { id: "u20", difficulty: "university", latex: "\\int_0^\\infty \\frac{\\sin x}{x} \\, \\dd x = \\frac{\\pi}{2}", label: "ディリクレ積分" },
  { id: "u21", difficulty: "university", latex: "\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u", label: "波動方程式" },
  { id: "u22", difficulty: "university", latex: "e^{i\\pi} + 1 = 0", label: "オイラーの等式" },
  { id: "u23", difficulty: "university", latex: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta", label: "オイラーの公式" },
  { id: "u24", difficulty: "university", latex: "\\Gamma(n+1) = n!", label: "ガンマ関数と階乗" },
  { id: "u25", difficulty: "university", latex: "\\frac{\\dd^2 x}{\\dd t^2} + \\omega^2 x = 0", label: "単振動の方程式" },
  { id: "u26", difficulty: "university", latex: "\\dv{x}{t} = v", label: "速度の定義（微分）" },

  // ===== 大学範囲（物理数学） =====
  { id: "u27", difficulty: "university", latex: "\\hat{f}(k) = \\int_{-\\infty}^{\\infty} f(x) e^{-ikx} \\, \\dd x", label: "フーリエ変換" },
  { id: "u28", difficulty: "university", latex: "f(x) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} \\hat{f}(k) e^{ikx} \\, \\dd k", label: "フーリエ逆変換" },
  { id: "u29", difficulty: "university", latex: "f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)", label: "フーリエ級数" },
  { id: "u30", difficulty: "university", latex: "f(z) = \\sum_{n=-\\infty}^{\\infty} a_n (z - z_0)^n", label: "ローラン展開" },
  { id: "u31", difficulty: "university", latex: "\\oint_C f(z) \\, \\dd z = 2\\pi i \\sum_k \\mathrm{Res}(f, z_k)", label: "留数定理" },
  { id: "u32", difficulty: "university", latex: "f(a) = \\frac{1}{2\\pi i} \\oint_C \\frac{f(z)}{z - a} \\, \\dd z", label: "コーシーの積分公式" },
  { id: "u33", difficulty: "university", latex: "\\Gamma(z) = \\int_0^\\infty t^{z-1} e^{-t} \\, \\dd t", label: "ガンマ関数の定義" },
  { id: "u34", difficulty: "university", latex: "P_n(x) = \\frac{1}{2^n n!} \\frac{\\dd^n}{\\dd x^n} (x^2 - 1)^n", label: "ロドリゲスの公式（ルジャンドル多項式）" },
  { id: "u35", difficulty: "university", latex: "x^2 y'' + x y' + (x^2 - n^2) y = 0", label: "ベッセルの微分方程式" },
  { id: "u36", difficulty: "university", latex: "\\int_{-\\infty}^{\\infty} \\delta(x) f(x) \\, \\dd x = f(0)", label: "デルタ関数の性質" },
  { id: "u37", difficulty: "university", latex: "\\ln n! \\approx n \\ln n - n", label: "スターリングの近似" },

  // ===== 大学範囲（応用物理） =====
  { id: "u38", difficulty: "university", latex: "Z_1 = V \\left( \\frac{2\\pi m k_B T}{h^2} \\right)^{3/2}", label: "理想気体の1粒子分配関数" },
  { id: "u39", difficulty: "university", latex: "\\gamma_n = i \\oint \\braket{n(\\bm{R}) | \\nabla_{\\bm{R}} | n(\\bm{R})} \\cdot \\dd\\bm{R}", label: "Berry位相" },
  { id: "u40", difficulty: "university", latex: "\\bm{\\Omega}_n = \\nabla_{\\bm{R}} \\times \\bm{A}_n(\\bm{R})", label: "Berry曲率" },
  { id: "u41", difficulty: "university", latex: "ds^2 = -\\left(1 - \\frac{r_s}{r}\\right) c^2 dt^2 + \\left(1 - \\frac{r_s}{r}\\right)^{-1} dr^2 + r^2 d\\Omega^2", label: "シュバルツシルト計量" },
  { id: "u42", difficulty: "university", latex: "Z = \\mathrm{tr}(T^N)", label: "転送行列法による分配関数" },
  { id: "u43", difficulty: "university", latex: "f(E) = \\frac{1}{e^{(E - \\mu)/k_B T} + 1}", label: "フェルミ・ディラック分布" },
  { id: "u44", difficulty: "university", latex: "n(E) = \\frac{1}{e^{(E - \\mu)/k_B T} - 1}", label: "ボース・アインシュタイン分布" },
  { id: "u45", difficulty: "university", latex: "E_n^{(1)} = \\braket{n^{(0)} | \\hat{H}' | n^{(0)}}", label: "1次摂動エネルギー" },

  // ===== 複合範囲（高度な数理物理） =====
  { id: "m1", difficulty: "mixed", latex: "\\oint_C \\bm{E} \\cdot \\dd\\bm{l} = -\\frac{\\dd\\Phi}{\\dd t}", label: "電磁誘導の法則（積分形）" },
  { id: "m2", difficulty: "mixed", latex: "R_{\\mu\\nu} - \\frac{1}{2}g_{\\mu\\nu}R = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}", label: "アインシュタイン方程式" },
  { id: "m3", difficulty: "mixed", latex: "\\mathcal{L} = \\frac{1}{2}m\\dot{q}^2 - V(q)", label: "ラグランジアン" },
  { id: "m4", difficulty: "mixed", latex: "Z = \\sum_n e^{-\\beta E_n}", label: "分配関数" },
  { id: "m5", difficulty: "mixed", latex: "\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}", label: "リーマンゼータ関数" },
  { id: "m6", difficulty: "mixed", latex: "\\bra{\\psi}\\hat{A}\\ket{\\psi}", label: "期待値（ブラケット記法）" },
  { id: "m7", difficulty: "mixed", latex: "\\Delta x \\, \\Delta p \\geq \\frac{\\hbar}{2}", label: "不確定性原理" },
  { id: "m8", difficulty: "mixed", latex: "f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!}x^n", label: "マクローリン展開" },
  { id: "m9", difficulty: "mixed", latex: "\\nabla^2 \\phi = 4\\pi G \\rho", label: "重力場のポアソン方程式" },
  { id: "m10", difficulty: "mixed", latex: "\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n = e", label: "ネイピア数の定義" },
  { id: "m11", difficulty: "mixed", latex: "S = k_B \\ln W", label: "ボルツマンの公式" },
  { id: "m12", difficulty: "mixed", latex: "PV = nRT", label: "理想気体の状態方程式" },
  { id: "m13", difficulty: "mixed", latex: "E = mc^2", label: "質量とエネルギーの等価性" },
  { id: "m14", difficulty: "mixed", latex: "\\lambda = \\frac{h}{p}", label: "ド・ブロイ波長" },
  { id: "m15", difficulty: "mixed", latex: "\\cosh^2 x - \\sinh^2 x = 1", label: "双曲線関数の基本公式" },
  { id: "m16", difficulty: "mixed", latex: "\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}", label: "バーゼル問題" },
  { id: "m17", difficulty: "mixed", latex: "\\nabla \\times (\\nabla \\times \\bm{A}) = \\nabla(\\nabla \\cdot \\bm{A}) - \\nabla^2 \\bm{A}", label: "ベクトル解析の恒等式" },
  { id: "m18", difficulty: "mixed", latex: "\\mathcal{F}[f](k) = \\int_{-\\infty}^{\\infty} f(x) e^{-ikx} \\, \\dd x", label: "フーリエ変換" },
];

/** 指定難易度の問題プール（複合は全範囲から出題） */
export function getProblemPool(difficulty: Difficulty): Problem[] {
  if (difficulty === "mixed") return [...PROBLEMS];
  return PROBLEMS.filter((p) => p.difficulty === difficulty);
}

/** プールからランダムに n 問選ぶ（毎回シャッフルして重複なく出題） */
export function pickProblems(difficulty: Difficulty, n: number): Problem[] {
  const pool = getProblemPool(difficulty);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

/**
 * まだ出題していない問題をプールからランダムに 1 問選ぶ。
 * （5 秒以内の Pass で問題を差し替える際に使用）
 * 候補が無ければ null。
 */
export function pickUnusedProblem(
  difficulty: Difficulty,
  usedIds: ReadonlySet<string>,
): Problem | null {
  const candidates = getProblemPool(difficulty).filter(
    (p) => !usedIds.has(p.id),
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** 数式の長さに応じた制限時間（20〜60秒） */
export function timeLimitFor(problem: Problem): number {
  const len = problem.latex.replace(/\s+/g, "").length;
  return Math.min(60, Math.max(20, Math.round(len * 1.2)));
}
