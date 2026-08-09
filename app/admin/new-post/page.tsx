"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBlog } from "../../../context/BlogContext";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import { ChevronLeft, Save, Eye, FileText, Send } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const { addPost, isAdmin } = useBlog();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    await addPost({
      title,
      summary,
      category,
      tags,
      content,
      isPublished,
    });

    router.push("/admin");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header navbar */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
        <button
          onClick={() => router.push("/admin")}
          className="inline-flex items-center gap-1 text-xs font-bold text-zinc-450 hover:text-zinc-900 dark:hover:text-white transition cursor-pointer"
        >
          <ChevronLeft size={14} /> Back to dashboard
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "edit" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-400"
            }`}
          >
            <FileText size={13} />
            Editor
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
              activeTab === "preview" ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white" : "text-zinc-400"
            }`}
          >
            <Eye size={13} />
            Preview
          </button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Title & Metadata (Left 2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
                  Post Title
                </label>
                <input
                  type="text"
                  placeholder="제목을 입력해 주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
                  Summary
                </label>
                <textarea
                  placeholder="짧은 요약 설명글을 작성해 주세요"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 h-16 leading-relaxed"
                />
              </div>
            </div>

            {/* Post Settings (Right 1 col) */}
            <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-850 rounded-2xl p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="AI">AI</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider block">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Nextjs, React, Web"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none"
                />
              </div>


              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-3.5 h-3.5 border-zinc-300 rounded text-zinc-900 focus:ring-zinc-400 cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-xs text-zinc-650 dark:text-zinc-400 font-semibold cursor-pointer">
                  즉시 발행하기
                </label>
              </div>
            </div>
          </div>

          {/* Markdown Content text area */}
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
              Content (Markdown 지원)
            </label>
            <textarea
              placeholder="마크다운 양식으로 글 본문을 작성하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400 h-96 leading-relaxed"
              required
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:text-zinc-900 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer ml-auto"
          >
            <Send size={14} />
            포스트 저장하기
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 sm:p-8 min-h-[300px]">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white leading-tight mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-900">
            {title || "제목 없음"}
          </h1>
          <MarkdownRenderer content={content || "*작성된 내용이 없습니다.*"} />
        </div>
      )}
    </div>
  );
}
