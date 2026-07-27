"use client";

import React, { useState, useEffect } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse space-y-3"><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4"></div><div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded"></div></div>;
  }

  const parseMarkdown = (text: string) => {
    const blocks: React.ReactNode[] = [];
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];
    let listItems: string[] = [];
    let keyCounter = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        const listKey = `list-${keyCounter++}`;
        const node = (
          <ul key={listKey} className="list-disc pl-6 my-4 space-y-1.5 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
            ))}
          </ul>
        );
        blocks.push(node);
        listItems = [];
      }
    };

    const parseInlineStyles = (txt: string): string => {
      // Inline code `code`
      let formatted = txt.replace(/`([^`]+)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
      
      // Bold **bold**
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-zinc-900 dark:text-white">$1</strong>');
      
      // Italic *italic*
      formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

      // Link [text](url)
      formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-zinc-900 dark:text-white underline font-medium" target="_blank" rel="noopener">$1</a>');

      return formatted;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          const codeText = codeLines.join("\n");
          blocks.push(<CodeBlock key={`code-${keyCounter++}`} code={codeText} language={codeLanguage} />);
          codeLines = [];
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).toLowerCase();
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Headers
      if (line.startsWith("#")) {
        flushList();
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          const level = match[1].length;
          const textContent = match[2];
          const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          const headerClass = [
            "",
            "text-2xl font-black text-zinc-950 dark:text-white mt-8 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-900",
            "text-xl font-bold text-zinc-900 dark:text-zinc-150 mt-6 mb-3",
            "text-lg font-semibold text-zinc-800 dark:text-zinc-200 mt-5 mb-2",
            "text-base font-semibold text-zinc-800 dark:text-zinc-300 mt-4 mb-2"
          ][level] || "text-base font-bold";

          blocks.push(
            <Tag key={`h-${keyCounter++}`} className={headerClass} dangerouslySetInnerHTML={{ __html: parseInlineStyles(textContent) }} />
          );
          continue;
        }
      }

      // Blockquotes
      if (line.startsWith(">")) {
        flushList();
        blocks.push(
          <blockquote key={`quote-${keyCounter++}`} className="border-l-2 border-zinc-900 dark:border-zinc-100 pl-4 py-1 my-4 italic text-zinc-500 text-sm leading-relaxed">
            {parseInlineStyles(line.slice(1).trim())}
          </blockquote>
        );
        continue;
      }

      // Unordered Lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        listItems.push(line.trim().slice(2));
        continue;
      }

      // Empty Lines
      if (line.trim() === "") {
        flushList();
        continue;
      }

      // Paragraph
      flushList();
      blocks.push(
        <p key={`p-${keyCounter++}`} className="my-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed break-keep" dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
      );
    }

    flushList();
    return blocks;
  };

  return <div className="prose dark:prose-invert max-w-none">{parseMarkdown(content)}</div>;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-6 relative border border-zinc-100 dark:border-zinc-850 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-850 bg-zinc-100/50 dark:bg-zinc-950/50 text-[10px] text-zinc-450 dark:text-zinc-500 font-bold font-sans">
        <span className="uppercase tracking-wider">{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto leading-relaxed max-h-[400px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
