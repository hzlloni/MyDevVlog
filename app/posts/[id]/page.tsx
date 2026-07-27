"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBlog } from "../../../context/BlogContext";
import MarkdownRenderer from "../../../components/MarkdownRenderer";
import { Calendar, Clock, Eye, ChevronLeft, MessageSquare, User } from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { posts, incrementViews, addComment, isAdmin } = useBlog();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const post = useMemo(() => posts.find((p) => p.id === id), [posts, id]);

  useEffect(() => {
    if (id) {
      incrementViews(id);
    }
  }, [id, incrementViews]);

  if (!post) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-zinc-400 text-sm italic">포스트를 찾을 수 없습니다.</p>
        <Link
          href="/posts"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-zinc-900 dark:text-white underline"
        >
          <ChevronLeft size={14} /> 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    addComment(post.id, author, content);
    setAuthor("");
    setContent("");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-fade-in">
      {/* Back link */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
      >
        <ChevronLeft size={14} /> Back to list
      </Link>

      {/* Header */}
      <header className="space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-550">
          <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {post.createdAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {post.views} views
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded text-[10px] font-bold"
            >
              #{t}
            </span>
          ))}
        </div>
      </header>

      {/* Main Markdown Body */}
      <article className="pb-10 border-b border-zinc-100 dark:border-zinc-900">
        <MarkdownRenderer content={post.content} />
      </article>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare size={14} />
          Comments ({post.comments.length})
        </h3>

        {/* Comment list */}
        <div className="space-y-4 divide-y divide-zinc-100 dark:divide-zinc-900">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="p-1 bg-zinc-50 dark:bg-zinc-900 rounded-full text-zinc-400">
                    <User size={12} />
                  </div>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{comment.author}</span>
                  <span className="text-[10px] text-zinc-400">{comment.createdAt}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm pl-6 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-zinc-400 dark:text-zinc-500 italic text-xs py-2">
              등록된 댓글이 없습니다.
            </p>
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleCommentSubmit} className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="이름"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="px-3.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
              required
            />
          </div>
          <textarea
            placeholder="댓글 내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 h-20 leading-relaxed"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold transition hover:opacity-85 cursor-pointer ml-auto block"
          >
            댓글 등록
          </button>
        </form>
      </div>
    </div>
  );
}
