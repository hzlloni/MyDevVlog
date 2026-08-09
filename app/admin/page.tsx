"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useBlog } from "../../context/BlogContext";
import { Lock, FileText, Plus, Trash2, Edit, Eye, LogOut } from "lucide-react";

export default function AdminPage() {
  const { posts, isAdmin, adminLogin, adminLogout, deletePost } = useBlog();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await adminLogin(password);
    if (success) {
      setLoginError(false);
      setPassword("");
    } else {
      setLoginError(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 이 포스트를 삭제하시겠습니까?")) {
      deletePost(id);
    }
  };

  // 1. If not logged in as Admin, show login screen
  if (!isAdmin) {
    return (
      <div className="max-w-sm mx-auto my-20 animate-fade-in">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 rounded-full flex items-center justify-center mx-auto border border-zinc-100 dark:border-zinc-700">
              <Lock size={16} />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Admin Dashboard Login</h2>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              비밀번호를 입력하여 접속하세요. (비밀번호: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-800 dark:text-zinc-200">admin1234</span>)
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
              {loginError && (
                <p className="text-red-500 text-[10px] mt-1.5 font-bold">비밀번호가 올바르지 않습니다.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Admin Dashboard Console
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">블로그 아카이브 포스트를 관리하고 제어합니다.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/new-post"
            className="flex items-center gap-1 px-3.5 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-xs font-bold transition hover:opacity-85 shadow"
          >
            <Plus size={14} />
            새 글 작성
          </Link>
          <button
            onClick={() => {
              adminLogout();
              window.location.reload();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-850 text-zinc-500 hover:text-red-500 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <LogOut size={13} />
            로그아웃
          </button>
        </div>
      </div>

      {/* Posts management list */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
          <h3 className="font-bold text-xs text-zinc-400 dark:text-zinc-550 uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={15} />
            작성글 관리 ({posts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-zinc-100/50 dark:bg-zinc-950/40 text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3">상태</th>
                <th className="px-5 py-3">제목</th>
                <th className="px-5 py-3">카테고리</th>
                <th className="px-5 py-3">조회수</th>
                <th className="px-5 py-3 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 text-sm">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/10 transition">
                    <td className="px-5 py-3.5">
                      {post.isPublished ? (
                        <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[9px] font-bold">
                          발행됨
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[9px] font-bold">
                          임시저장
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-zinc-800 dark:text-zinc-200">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-zinc-450 dark:text-zinc-500">
                      {post.category}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 dark:text-zinc-550 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Eye size={12} />
                        {post.views}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/edit-post/${post.id}`}
                          className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-850 dark:hover:text-white rounded transition"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-red-500 rounded transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-zinc-400 italic text-xs">
                    작성된 글이 존재하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
