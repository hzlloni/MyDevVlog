"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

// Local SVG brand icons
const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AboutPage() {
  return (
    <div className="space-y-12 animate-fade-in max-w-2xl mx-auto">
      {/* Profile Header */}
      <section className="space-y-4 pb-8 border-b border-zinc-100 dark:border-zinc-900">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-zinc-950 dark:text-white">
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">전혜원</span>
          </h1>
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest">[전문 분야 / 직무]</p>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed break-keep italic">
          여기에 본인을 소개하는 한 줄 요약 혹은 커리어 철학을 채워주세요. (예: &ldquo;사용자 인터랙션과 확장성 있는 설계를 지향하는 프론트엔드 엔지니어입니다.&rdquo;)
        </p>

        {/* Social Link List */}
        <div className="flex flex-wrap gap-4 text-xs font-semibold pt-2">
          <Link
            href="mailto:jhw030329@gmail.com"
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <Mail size={14} />
            jhw030329@gmail.com
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <GithubIcon size={14} />
            GitHub
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
          >
            <LinkedinIcon size={14} />
            LinkedIn
          </Link>
        </div>
      </section>

      {/* Main Biography content (Sections) */}
      <div className="space-y-10">
        {/* Career Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-900 pb-2">
            Work Experience
          </h2>
          <p className="text-zinc-400 dark:text-zinc-500 italic text-xs">
            등록된 경력 사항이 없습니다.
          </p>
        </section>

        {/* Skills Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-900 pb-2">
            Technical Skills
          </h2>
          <p className="text-zinc-400 dark:text-zinc-500 italic text-xs">
            등록된 기술 스택이 없습니다.
          </p>
        </section>

        {/* Certifications and education */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-900 pb-2">
            Certifications & Education
          </h2>
          <ul className="space-y-3.5 text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed list-disc pl-4">
            <li>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">[자격증 1]</span> - [발행 기관] | [취득 년도]
            </li>
            <li>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">[자격증 2]</span> - [발행 기관] | [취득 년도]
            </li>
            <li>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">[학력 사항]</span> - [학교명 및 전공] | [학위 종류]
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
