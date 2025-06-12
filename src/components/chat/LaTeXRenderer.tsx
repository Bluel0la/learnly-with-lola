
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
        fleqn: displayMode, // Left-align display math
      });
    } catch (error) {
      console.error("LaTeX render error:", error);
      return `<span style="color: #cc0000;">${latex}</span>`;
    }
  };

  const processContent = (text: string): string => {
    let processed = text;

    // Handle \begin{aligned}...\end{aligned} blocks
    processed = processed.replace(
      /\\begin\{aligned\}([\s\S]*?)\\end\{aligned\}/g,
      (match, content) => {
        const rendered = renderLatex(match, true);
        return `<div class="math-display my-4 overflow-x-auto">${rendered}</div>`;
      }
    );

    // Handle \text{...} blocks - render as regular text
    processed = processed.replace(/\\text\{([^}]*)\}/g, (match, textContent) => {
      return textContent;
    });

    // Handle display math blocks $$...$$
    processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
      const rendered = renderLatex(mathContent.trim(), true);
      return `<div class="math-display my-4 overflow-x-auto">${rendered}</div>`;
    });

    // Handle inline math $...$
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
      const rendered = renderLatex(mathContent.trim(), false);
      return `<span class="math-inline">${rendered}</span>`;
    });

    // Handle arrow symbols
    processed = processed.replace(/\\rightarrow|→/g, '→');
    processed = processed.replace(/\\leftarrow|←/g, '←');

    // Bold formatting **text**
    processed = processed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Inline code `text`
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>'
    );

    // Handle checkmarks and other symbols
    processed = processed.replace(/✅/g, '<span class="text-green-600">✅</span>');
    processed = processed.replace(/❌/g, '<span class="text-red-600">❌</span>');

    // Convert newlines to line breaks
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
