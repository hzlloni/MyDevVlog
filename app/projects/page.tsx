"use client";

import React from "react";

export default function ProjectsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-zinc-100 dark:border-zinc-900 pb-6">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Side Projects</h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-1">지금까지 기획하고 기여한 사이드 프로젝트 리스트입니다.</p>
      </div>

      <p className="text-zinc-400 dark:text-zinc-500 italic text-sm">
        등록된 프로젝트가 없습니다.
      </p>
    </div>
  );
}
