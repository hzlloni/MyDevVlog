"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useBlog } from "../context/BlogContext";
import { Calendar, Clock, Eye, MessageSquare, ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export default function Home() {
  const { posts } = useBlog();

  // Filter published posts and get latest 3
  const latestPosts = [...posts]
    .filter((p) => p.isPublished)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-24 animate-fade-in max-w-2xl mx-auto py-8 relative">
      
      {/* Glow Backdrop - Sophisticated Indigo Glow */}
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. Large Typography Intro (Clean Vertical Flow, No widgets, Indigo Accent) */}
      <section className="min-h-[70vh] flex flex-col justify-center relative border-b border-zinc-150 dark:border-zinc-900 pb-16">
        <div className="space-y-8 relative z-10">
          
          {/* Micro Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold bg-zinc-50 dark:bg-zinc-900 text-zinc-550 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800 w-fit">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Developer
          </div>

          {/* Name & English & Monchhichi Profile Image */}
          <div className="flex items-center gap-4 flex-wrap">
            <Image
              src="/monchhichi.jpg"
              alt="Monchhichi Profile"
              width={64}
              height={64}
              className="rounded-full shadow-md border-2 border-indigo-100 dark:border-zinc-800 object-cover"
            />
            <div className="space-y-1">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-zinc-950 dark:text-white leading-none">
                  전혜원
                </h1>
                <span className="text-zinc-350 dark:text-zinc-700 text-xl sm:text-2xl font-light">/</span>
                <span className="text-xs sm:text-sm font-bold text-indigo-500 dark:text-indigo-400 font-mono tracking-widest uppercase">
                  Hyewon Jeon
                </span>
              </div>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                [ Developer ]
              </p>
            </div>
          </div>

          {/* Simplified Core Bio with Violet Border */}
          <div className="border-l-4 border-indigo-500 pl-6 sm:pl-8">
            <p className="text-xl sm:text-2xl font-extrabold leading-normal text-zinc-950 dark:text-white tracking-tight break-keep">
              매일 조금씩, <br className="hidden sm:inline" />
              기록하며 성장하는 개발자 전혜원입니다.
            </p>
          </div>

          {/* Core Philosophy: Good Influence */}
          <div className="pt-8 border-t border-zinc-150 dark:border-zinc-900 max-w-xl space-y-3">
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 dark:text-zinc-555 uppercase tracking-widest">
              <Sparkles size={11} className="text-indigo-500 dark:text-indigo-400" />
              <span>Philosophy</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-305 leading-relaxed break-keep font-semibold">
              &ldquo;기술은 사람을 편리하게 만들 때 가장 빛난다고 믿습니다. 솔루션을 통해 사용자의 일상에 긍정적인 가치와 선한 영향력을 실천하고자 합니다.&rdquo;
            </p>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-4 left-6 text-zinc-400 dark:text-zinc-650 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest animate-bounce">
          <ChevronDown size={13} />
          Scroll to explore writings
        </div>
      </section>

      {/* 2. Recent Writings Section */}
      <section className="space-y-12 py-4">
        <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-900 pb-4">
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
                className="group relative -mx-4 px-4 py-8 rounded-2xl border border-transparent hover:border-zinc-150 dark:hover:border-zinc-900 hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-all duration-350 space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[9px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-wider">
                    <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded font-extrabold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={10} />
                      {post.createdAt}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  </h3>

                  <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-zinc-400 dark:text-zinc-550 pt-2 border-t border-zinc-100/50 dark:border-zinc-900/30 font-bold uppercase tracking-wider">
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
