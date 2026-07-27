"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useBlog } from "../../context/BlogContext";
import { Search, Calendar, Clock, Eye, MessageSquare, Plus } from "lucide-react";

export default function PostsPage() {
  const { posts, isAdmin } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get active categories
  const categories = useMemo(() => {
    const cats = new Set(posts.filter((p) => p.isPublished || isAdmin).map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [posts, isAdmin]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const isVisible = post.isPublished || isAdmin;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

      return isVisible && matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory, isAdmin]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Writing Archive</h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">학습 내용과 개발 경험을 아카이브합니다.</p>
        </div>

      </div>

      {/* Search & Category Tabs */}
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input
            type="text"
            placeholder="제목, 내용, 태그로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 text-xs border-b border-zinc-100 dark:border-zinc-900 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.id} className="py-6 flex flex-col gap-2 group">
              <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-550">
                <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  {post.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.createdAt}
                </span>
                {!post.isPublished && (
                  <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-bold">
                    임시저장
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white group-hover:opacity-75 transition-opacity">
                <Link href={`/posts/${post.id}`}>{post.title}</Link>
              </h2>

              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-3xl line-clamp-2">
                {post.summary}
              </p>

              <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-550 pt-2 font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {post.comments.length}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-20 text-zinc-400 dark:text-zinc-500 italic text-sm">
            검색 결과와 일치하는 아카이브 포스트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
