import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import { pickProblems, type Difficulty, type Problem } from "./data/problems";
import type { QuestionResult } from "./lib/score";

const QUESTIONS_PER_GAME = 10;

type Screen =
  | { kind: "start" }
  | { kind: "game"; difficulty: Difficulty; problems: Problem[]; key: number }
  | { kind: "result"; difficulty: Difficulty; results: QuestionResult[] };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ kind: "start" });

  const startGame = (difficulty: Difficulty) => {
    setScreen({
      kind: "game",
      difficulty,
      problems: pickProblems(difficulty, QUESTIONS_PER_GAME),
      key: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800">
      {screen.kind === "start" && <StartScreen onStart={startGame} />}
      {screen.kind === "game" && (
        <GameScreen
          key={screen.key}
          difficulty={screen.difficulty}
          problems={screen.problems}
          onFinish={(results) =>
            setScreen({ kind: "result", difficulty: screen.difficulty, results })
          }
        />
      )}
      {screen.kind === "result" && (
        <ResultScreen
          difficulty={screen.difficulty}
          results={screen.results}
          onRetry={() => startGame(screen.difficulty)}
          onHome={() => setScreen({ kind: "start" })}
        />
      )}
    </div>
  );
}
