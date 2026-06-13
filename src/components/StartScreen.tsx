import { DIFFICULTY_INFO, type Difficulty } from "../data/problems";
import LatexRenderer from "./LatexRenderer";

type Props = {
  onStart: (difficulty: Difficulty) => void;
};

const CARD_STYLES: Record<Difficulty, { border: string; badge: string; button: string }> = {
  highschool: {
    border: "border-emerald-200 hover:border-emerald-400",
    badge: "bg-emerald-100 text-emerald-700",
    button: "bg-emerald-600 hover:bg-emerald-500",
  },
  university: {
    border: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-500",
  },
  mixed: {
    border: "border-purple-200 hover:border-purple-400",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-500",
  },
};

const SAMPLE: Record<Difficulty, string> = {
  highschool: "\\int x^2 \\, dx",
  university: "\\hat{H}\\psi = E\\psi",
  mixed: "\\Delta x \\, \\Delta p \\geq \\frac{\\hbar}{2}",
};

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
        数式タイピング
      </h1>
      <p className="mt-3 text-gray-500">
        LaTeX で数式を打ち込め。表記揺れは自動判定 — 意味が合っていれば正解。
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {(Object.keys(DIFFICULTY_INFO) as Difficulty[]).map((d) => {
          const info = DIFFICULTY_INFO[d];
          const style = CARD_STYLES[d];
          return (
            <button
              key={d}
              onClick={() => onStart(d)}
              className={`group bg-white rounded-2xl border-2 ${style.border} shadow-sm hover:shadow-lg transition-all p-6 text-left flex flex-col gap-4 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                  ×{info.multiplier.toFixed(1)} 倍率
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{info.name}</h2>
              <p className="text-sm text-gray-500 min-h-10">{info.description}</p>
              <div className="bg-gray-50 rounded-lg py-3 flex items-center justify-center min-h-16">
                <LatexRenderer latex={SAMPLE[d]} className="text-gray-700" />
              </div>
              <span
                className={`mt-auto text-center text-white font-semibold rounded-xl py-2.5 ${style.button} transition-colors`}
              >
                スタート
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 text-sm text-gray-400 max-w-2xl text-center leading-relaxed">
        <p>
          全10問・制限時間は数式の長さに応じて20〜60秒。Enter で判定、Esc で Pass。
        </p>
        <p className="mt-1 text-sky-500">
          出題から最初の5秒以内に Pass すれば、ノーカウントで別の問題に交換できます。
        </p>
        <p className="mt-1">
          physics（\dd, \grad, \rot…）・bm（\bm）・braket（\bra, \ket, \braket）マクロ対応。
        </p>
      </div>
    </div>
  );
}
