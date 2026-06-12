import { DIFFICULTY_INFO, type Difficulty } from "../data/problems";
import type { QuestionResult, QuestionStatus } from "../lib/score";
import LatexRenderer from "./LatexRenderer";

type Props = {
  difficulty: Difficulty;
  results: QuestionResult[];
  onRetry: () => void;
  onHome: () => void;
};

const STATUS_LABEL: Record<QuestionStatus, { text: string; cls: string }> = {
  correct: { text: "正解", cls: "bg-emerald-100 text-emerald-700" },
  incorrect: { text: "不正解", cls: "bg-red-100 text-red-600" },
  pass: { text: "Pass", cls: "bg-gray-200 text-gray-500" },
  timeout: { text: "時間切れ", cls: "bg-amber-100 text-amber-600" },
};

export default function ResultScreen({
  difficulty,
  results,
  onRetry,
  onHome,
}: Props) {
  const total = results.reduce((s, r) => s + r.score, 0);
  const totalBase = results.reduce((s, r) => s + r.base, 0);
  const totalBonus = results.reduce((s, r) => s + r.timeBonus, 0);
  const count = (st: QuestionStatus) =>
    results.filter((r) => r.status === st).length;
  const accuracy =
    results.length > 0
      ? Math.round((count("correct") / results.length) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800">リザルト</h1>
      <p className="text-gray-400 mt-1 text-sm">
        {DIFFICULTY_INFO[difficulty].name}（倍率 ×
        {DIFFICULTY_INFO[difficulty].multiplier.toFixed(1)}）
      </p>

      {/* サマリー */}
      <div className="mt-6 w-full max-w-3xl bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-8 flex flex-col items-center">
        <span className="text-sm font-semibold text-gray-400">SCORE</span>
        <span className="text-6xl font-black text-gray-800 tabular-nums animate-score-pop">
          {total.toLocaleString()}
        </span>
        <span className="mt-1 text-sm text-gray-400 tabular-nums">
          基本点 {totalBase.toLocaleString()} ＋ タイムボーナス{" "}
          {totalBonus.toLocaleString()}
        </span>
        <span className="mt-2 text-gray-500">正解率 {accuracy}%</span>
        <div className="mt-5 grid grid-cols-4 gap-3 w-full max-w-md text-center">
          {(["correct", "incorrect", "pass", "timeout"] as QuestionStatus[]).map(
            (st) => (
              <div key={st} className="bg-gray-50 rounded-xl py-3">
                <div
                  className={`text-xs font-semibold inline-block px-2 py-0.5 rounded-full ${STATUS_LABEL[st].cls}`}
                >
                  {STATUS_LABEL[st].text}
                </div>
                <div className="text-2xl font-bold text-gray-700 mt-1 tabular-nums">
                  {count(st)}
                </div>
              </div>
            ),
          )}
        </div>
        <div className="mt-6 flex gap-4">
          <button
            onClick={onRetry}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow cursor-pointer"
          >
            もう一度挑戦
          </button>
          <button
            onClick={onHome}
            className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            難易度選択へ
          </button>
        </div>
      </div>

      {/* 復習一覧 */}
      <h2 className="mt-10 text-xl font-bold text-gray-700">復習</h2>
      <p className="text-sm text-gray-400 mt-1">
        お手本の数式と模範 LaTeX コードを確認しよう
      </p>
      <div className="mt-4 w-full max-w-3xl flex flex-col gap-4">
        {results.map((r, i) => (
          <div
            key={r.problem.id}
            className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400">
                  Q{i + 1}
                </span>
                <span className="text-sm text-gray-600">{r.problem.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_LABEL[r.status].cls}`}
                >
                  {STATUS_LABEL[r.status].text}
                </span>
                <span className="text-sm font-bold text-gray-600 tabular-nums">
                  +{r.score.toLocaleString()}
                  {r.status === "correct" && (
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      （基本{r.base} + 時間{r.timeBonus}）
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-4 bg-gray-50 rounded-xl py-5 flex items-center justify-center">
              <LatexRenderer
                latex={r.problem.latex}
                className="text-lg text-gray-800"
              />
            </div>
            <pre className="mt-3 bg-gray-800 text-emerald-300 text-sm font-mono rounded-xl px-4 py-3 overflow-x-auto select-all">
              {r.problem.latex}
            </pre>
            {r.status !== "correct" && r.finalInput.trim() && (
              <div className="mt-3 text-sm text-gray-400">
                <span className="font-semibold">あなたの入力：</span>
                <code className="font-mono text-red-400 break-all">
                  {r.finalInput}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
