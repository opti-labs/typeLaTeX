import { useCallback, useEffect, useRef, useState } from "react";
import {
  DIFFICULTY_INFO,
  timeLimitFor,
  type Difficulty,
  type Problem,
} from "../data/problems";
import { latexEquals } from "../lib/normalizeLatex";
import {
  scoreBreakdownFor,
  type QuestionResult,
  type ScoreBreakdown,
} from "../lib/score";
import LatexRenderer from "./LatexRenderer";

type Props = {
  difficulty: Difficulty;
  problems: Problem[];
  onFinish: (results: QuestionResult[]) => void;
};

type Feedback = "correct" | "wrong" | "pass" | "timeout" | null;

const TICK_MS = 100;

export default function GameScreen({ difficulty, problems, onFinish }: Props) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => timeLimitFor(problems[0]));
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [lastGain, setLastGain] = useState<ScoreBreakdown | null>(null);

  const resultsRef = useRef<QuestionResult[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transitioningRef = useRef(false);

  const problem = problems[index];
  const timeLimit = timeLimitFor(problem);
  const info = DIFFICULTY_INFO[difficulty];

  const goNext = useCallback(
    (result: QuestionResult) => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      resultsRef.current = [...resultsRef.current, result];
      setFeedback(
        result.status === "correct"
          ? "correct"
          : result.status === "pass"
            ? "pass"
            : "timeout",
      );
      if (result.status === "correct") {
        setTotalScore((s) => s + result.score);
        setLastGain({
          base: result.base,
          timeBonus: result.timeBonus,
          total: result.score,
        });
      }
      window.setTimeout(() => {
        if (index + 1 >= problems.length) {
          onFinish(resultsRef.current);
          return;
        }
        setIndex(index + 1);
        setInput("");
        setWrongAttempts(0);
        setTimeLeft(timeLimitFor(problems[index + 1]));
        setFeedback(null);
        transitioningRef.current = false;
        inputRef.current?.focus();
      }, result.status === "correct" ? 900 : 700);
    },
    [index, problems, onFinish],
  );

  // タイマー
  useEffect(() => {
    const id = window.setInterval(() => {
      if (transitioningRef.current) return;
      setTimeLeft((t) => {
        const next = Math.max(0, t - TICK_MS / 1000);
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [index]);

  // 時間切れ判定
  useEffect(() => {
    if (timeLeft > 0 || transitioningRef.current) return;
    goNext({
      problem,
      status: wrongAttempts > 0 || input.trim() ? "incorrect" : "timeout",
      score: 0,
      base: 0,
      timeBonus: 0,
      remaining: 0,
      finalInput: input,
    });
  }, [timeLeft, goNext, problem, wrongAttempts, input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (transitioningRef.current) return;
    if (latexEquals(input, problem.latex)) {
      const breakdown = scoreBreakdownFor(problem, Math.floor(timeLeft));
      goNext({
        problem,
        status: "correct",
        score: breakdown.total,
        base: breakdown.base,
        timeBonus: breakdown.timeBonus,
        remaining: Math.floor(timeLeft),
        finalInput: input,
      });
    } else {
      setWrongAttempts((n) => n + 1);
      setFeedback("wrong");
      window.setTimeout(() => {
        setFeedback((f) => (f === "wrong" ? null : f));
      }, 500);
    }
  };

  const pass = () => {
    if (transitioningRef.current) return;
    goNext({
      problem,
      status: "pass",
      score: 0,
      base: 0,
      timeBonus: 0,
      remaining: Math.floor(timeLeft),
      finalInput: input,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      pass();
    }
  };

  const timeRatio = timeLeft / timeLimit;
  const timerColor =
    timeRatio > 0.5
      ? "bg-emerald-500"
      : timeRatio > 0.25
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* ヘッダー */}
      <div className="w-full max-w-3xl flex items-center justify-between text-sm text-gray-500">
        <span className="font-semibold">
          {info.name}　第 {index + 1} / {problems.length} 問
        </span>
        <span className="text-lg font-bold text-gray-800 tabular-nums">
          SCORE {totalScore.toLocaleString()}
          {lastGain && feedback === "correct" && (
            <span className="ml-2 text-emerald-500 animate-score-pop inline-block">
              +{lastGain.total.toLocaleString()}
              <span className="ml-1 text-xs font-semibold text-emerald-400">
                （基本{lastGain.base} + 時間{lastGain.timeBonus}）
              </span>
            </span>
          )}
        </span>
      </div>

      {/* タイマーバー */}
      <div className="w-full max-w-3xl mt-3">
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${timerColor} rounded-full transition-[width] duration-100 ease-linear`}
            style={{ width: `${timeRatio * 100}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-400 mt-1 tabular-nums">
          残り {Math.ceil(timeLeft)} 秒
        </div>
      </div>

      {/* お手本数式 */}
      <div
        className={`relative w-full max-w-3xl mt-4 bg-white rounded-2xl border-2 shadow-sm p-8 flex flex-col items-center justify-center min-h-36 transition-colors ${
          feedback === "correct"
            ? "border-emerald-400 animate-correct-flash"
            : "border-gray-200"
        }`}
      >
        <span className="absolute top-3 left-4 text-xs font-semibold text-gray-400">
          お手本
        </span>
        <LatexRenderer latex={problem.latex} className="text-xl text-gray-800" />
        {feedback === "correct" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl font-black text-emerald-500/90 animate-stamp">
              正解！
            </span>
          </div>
        )}
        {(feedback === "pass" || feedback === "timeout") && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-white/70 rounded-2xl">
            <span className="text-4xl font-black text-gray-400 animate-stamp">
              {feedback === "pass" ? "PASS" : "時間切れ"}
            </span>
          </div>
        )}
      </div>

      {/* 入力プレビュー */}
      <div className="w-full max-w-3xl mt-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-6 flex flex-col items-center justify-center min-h-28 relative">
        <span className="absolute top-3 left-4 text-xs font-semibold text-gray-400">
          あなたの入力
        </span>
        <LatexRenderer
          latex={input}
          className="text-xl text-blue-700"
          fallback="ここにリアルタイムでレンダリングされます"
        />
      </div>

      {/* 入力フォーム */}
      <div
        className={`w-full max-w-3xl mt-4 ${feedback === "wrong" ? "animate-shake" : ""}`}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          spellCheck={false}
          placeholder="LaTeX を入力（例: \frac{1}{2}）— Enter で判定"
          className="w-full font-mono text-lg bg-white border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 resize-none shadow-sm"
        />
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={pass}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-300 text-gray-500 font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Pass（Esc）
          </button>
          {feedback === "wrong" && (
            <span className="text-red-500 font-semibold text-sm">
              まだ一致していません…
            </span>
          )}
          <button
            onClick={submit}
            className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow cursor-pointer"
          >
            判定（Enter）
          </button>
        </div>
      </div>
    </div>
  );
}
