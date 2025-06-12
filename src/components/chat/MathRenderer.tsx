
import React from 'react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

interface MathRendererProps {
  content: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  const renderMath = (latex: string, displayMode: boolean = false) => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: 'ignore',
        trust: false,
        macros: {
          "\\RR": "\\mathbb{R}",
          "\\NN": "\\mathbb{N}",
          "\\ZZ": "\\mathbb{Z}",
          "\\QQ": "\\mathbb{Q}",
          "\\CC": "\\mathbb{C}"
        }
      });
    } catch (error) {
      console.error('KaTeX render error:', error);
      return `<span style="color: #cc0000; font-family: monospace;">[Math Error: ${latex}]</span>`;
    }
  };

  const processContent = (text: string): string => {
    let processed = text;

    // Handle display math blocks $$...$$
    processed = processed.replace(/\$\$([^$]+?)\$\$/g, (match, mathContent) => {
      const rendered = renderMath(mathContent.trim(), true);
      return `<div class="math-display my-4 text-center">${rendered}</div>`;
    });

    // Handle inline math $...$
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
      const rendered = renderMath(mathContent.trim(), false);
      return `<span class="math-inline">${rendered}</span>`;
    });

    // Handle \begin{align} ... \end{align}
    processed = processed.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match, mathContent) => {
      const rendered = renderMath(match, true);
      return `<div class="math-display my-4 text-center">${rendered}</div>`;
    });

    // Handle \begin{equation} ... \end{equation}
    processed = processed.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (match, mathContent) => {
      const rendered = renderMath(match, true);
      return `<div class="math-display my-4 text-center">${rendered}</div>`;
    });

    // Handle other LaTeX environments
    processed = processed.replace(/\\begin\{([^}]+)\}([\s\S]*?)\\end\{\1\}/g, (match) => {
      const rendered = renderMath(match, true);
      return `<div class="math-display my-4 text-center">${rendered}</div>`;
    });

    // Handle bold text **...**
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle italic text *...*
    processed = processed.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

    // Handle inline code `...`
    processed = processed.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>');

    // Convert newlines to <br>
    processed = processed.replace(/\n/g, '<br>');

    return processed;
  };

  return (
    <div
      className="prose prose-sm max-w-none"
      style={{
        lineHeight: '1.6',
        wordBreak: 'break-word'
      }}
      dangerouslySetInnerHTML={{ __html: processContent(content) }}
    />
  );
};

export default MathRenderer;
