import { useMemo } from "react";
import katex from "katex";
import { katexMacros } from "../lib/katexMacros";
import { expandDerivatives } from "../lib/latexPreprocess";

type Props = {
  latex: string;
  displayMode?: boolean;
  className?: string;
  /** 構文エラー時に表示するプレースホルダ */
  fallback?: string;
};

/**
 * KaTeX で LaTeX 文字列をレンダリングする共通コンポーネント。
 * physics / bm / braket 相当のカスタムマクロを常に適用する。
 */
export default function LatexRenderer({
  latex,
  displayMode = true,
  className = "",
  fallback = "…",
}: Props) {
  const { html, error } = useMemo(() => {
    if (!latex.trim()) return { html: "", error: false };
    try {
      const html = katex.renderToString(expandDerivatives(latex), {
        displayMode,
        macros: { ...katexMacros },
        throwOnError: true,
        strict: false,
        trust: false,
      });
      return { html, error: false };
    } catch {
      return { html: "", error: true };
    }
  }, [latex, displayMode]);

  if (!latex.trim()) {
    return <span className={`text-gray-300 ${className}`}>{fallback}</span>;
  }
  if (error) {
    return (
      <span className={`text-amber-500 text-sm ${className}`}>
        構文エラー（入力途中？）
      </span>
    );
  }
  return (
    <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
