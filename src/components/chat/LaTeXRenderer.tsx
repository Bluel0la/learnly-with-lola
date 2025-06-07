import React from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

interface LaTeXRendererProps {
  content: string;
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content }) => {
  const renderLatex = (latex: string, displayMode: boolean = false) => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        errorColor: "#cc0000",
        strict: "warn",
        trust: true,
        fleqn: true, // Left-align display math
      });
    } catch (error) {
      console.error("LaTeX render error:", error);
      return `<span style="color: #cc0000;">${latex}</span>`;
    }
  };

  const processContent = (text: string): string => {
    let processed = text;

    // Render \begin{aligned}...\end{aligned} blocks
    processed = processed.replace(
      /\\begin{aligned}[\s\S]*?\\end{aligned}/g,
      (match) => {
        const rendered = renderLatex(match, true);
        return `<div class="math-display">${rendered}</div>`;
      }
    );

    // Inline math: $...$
    processed = processed.replace(/\$(.+?)\$/gs, (_, mathContent) => {
      const rendered = renderLatex(mathContent.trim(), false);
      return `<span class="math-inline">${rendered}</span>`;
    });

    // Bold (**...**)
    processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Inline code: `...`
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>'
    );

    // Emojis
    processed = processed.replace(
      /✅/g,
      '<span class="text-green-600">✅</span>'
    );

    // Convert newlines to <br> (only inside regular text)
    processed = processed.replace(/\n/g, "<br>");

    return processed;
  };

  return (
    <div
      className="w-full text-left leading-relaxed whitespace-normal"
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
    />
  );
};

export default LaTeXRenderer;
