"use client";

import React from "react";
import Link from "next/link";
import { useBlog } from "../context/BlogContext";
import { Calendar, Clock, Eye, MessageSquare, ArrowRight, ChevronDown, Terminal, Sparkles } from "lucide-react";

export default function Home() {
  const { posts } = useBlog();

  // Filter published posts and get latest 3
  const latestPosts = [...posts]
    .filter((p) => p.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-28 animate-fade-in max-w-2xl mx-auto py-8">
      
      {/* 1. Large Typography Intro (Occupies almost full height of first page view) */}
      <section className="min-h-[75vh] flex flex-col justify-center relative border-b border-zinc-100 dark:border-zinc-900 pb-16">
        
        {/* Subtle background tech line indicator (Trendy tech style) */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-zinc-200 via-zinc-300 to-transparent dark:from-zinc-800 dark:via-zinc-700 dark:to-transparent pointer-events-none"></div>

        <div className="space-y-10 pl-6 sm:pl-8 relative z-10">
          
          {/* Micro Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-zinc-50 dark:bg-zinc-900 text-zinc-550 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800 w-fit shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            SYSTEM ACTIVE
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-zinc-950 dark:text-white leading-none">
                전혜원
              </h1>
              <span className="text-zinc-400 dark:text-zinc-500 font-mono text-sm tracking-normal uppercase">
                / Hyewon Jeon
              </span>
            </div>
            <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] font-mono">
              [ Developer ]
            </p>
          </div>

          {/* Simple and Cool Bio */}
          <div className="space-y-4 max-w-2xl">
            <p className="text-xl sm:text-3xl font-extrabold leading-tight text-zinc-900 dark:text-zinc-100 tracking-tight break-keep">
              복잡함을 걷어내고 본질에 집중합니다. <br className="hidden sm:inline" />
              단순하고 단단한 코드로 문제를 해결합니다.
            </p>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-450 leading-relaxed break-keep font-medium">
              배움의 깊이를 더하고 경험을 기록하며 성장의 흔적을 아카이브합니다.
            </p>
          </div>

          {/* Core Philosophy: Good Influence */}
          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-900 max-w-xl space-y-3">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              <Sparkles size={11} className="text-indigo-500 dark:text-indigo-400" />
              <span>Philosophy</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed break-keep italic font-medium">
              &ldquo;기술은 사람을 편리하게 만들 때 가장 빛난다고 믿습니다. 웹 기술로 일상에 긍정적인 가치와 선한 영향력을 실천합니다.&rdquo;
            </p>
          </div>
        </div>

        {/* Subtle scroll down indicator */}
        <div className="absolute bottom-4 left-6 text-zinc-400 dark:text-zinc-600 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest animate-bounce">
          <ChevronDown size={13} />
          Scroll to explore writings
        </div>
      </section>

      {/* 2. Compact Writings List (Trendy Card Grid hover interaction) */}
      <section className="space-y-12 py-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
          <h2 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">
            Recent Writings
          </h2>
          <Link
            href="/posts"
            className="group text-xs font-bold text-zinc-900 dark:text-white hover:text-zinc-500 dark:hover:text-zinc-400 transition flex items-center gap-1"
          >
            All Archive
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="space-y-6">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <article
                key={post.id}
                className="group relative -mx-4 px-4 py-6 rounded-2xl border border-transparent hover:border-zinc-150 dark:hover:border-zinc-900 hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-all duration-300 space-y-3"
              >
                <div className="flex items-center gap-3 text-[9px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded font-extrabold">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={10} />
                    {post.createdAt}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  <Link href={`/posts/${post.id}`}>{post.title}</Link>
                </h3>

                <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2">
                  {post.summary}
                </p>

                <div className="flex items-center gap-4 text-[9px] text-zinc-400 dark:text-zinc-550 pt-1 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.readTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    {post.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={11} />
                    {post.comments.length} comments
                  </span>
                </div>
              </article>
            ))
          ) : (
            <p className="text-zinc-400 dark:text-zinc-550 italic py-6 text-sm">
              작성된 포스트가 없습니다.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
