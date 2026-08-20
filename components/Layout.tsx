"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBlog } from "../context/BlogContext";
import { Sun, Moon, Laptop, Menu, X, Mail } from "lucide-react";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme, isAdmin, adminLogout } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  // Bypass entire blog layout for Swagger documentation to keep it full-screen and standalone
  if (pathname === "/swaggers") {
    return <>{children}</>;
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/posts" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-250">
      
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/90 backdrop-blur-sm dark:border-zinc-900 dark:bg-zinc-950/90">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-base tracking-tight hover:opacity-80 transition">
            🖋️ HyewonDev
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-1.5 transition-colors duration-150 ${
                    isActive
                      ? "text-zinc-900 dark:text-white font-bold border-b-2 border-zinc-900 dark:border-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

          </nav>

          {/* Right Action Switcher */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={adminLogout}
                className="text-xs font-semibold text-zinc-550 hover:text-red-500 transition cursor-pointer"
              >
                Log Out
              </button>
            )}

            {/* Simple Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg transition cursor-pointer text-zinc-555"
              >
                {theme === "light" && <Sun size={16} />}
                {theme === "dark" && <Moon size={16} />}
                {theme === "system" && <Laptop size={16} />}
              </button>

              {themeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-1 z-50 text-xs flex flex-col gap-0.5">
                    {(["light", "dark", "system"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTheme(t);
                          setThemeMenuOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded text-left capitalize transition cursor-pointer ${
                          theme === t ? "bg-zinc-100 dark:bg-zinc-800 font-bold" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg"
            >
              {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-6 py-4 space-y-1.5 shadow-md">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition ${
                    isActive ? "text-zinc-900 dark:text-white font-bold" : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <div>
            <span>© HyewonDev.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://github.com" target="_blank" className="hover:text-zinc-900 dark:hover:text-white transition">
              <GithubIcon size={15} />
            </Link>
            <Link href="mailto:jhw030329@gmail.com" className="hover:text-zinc-900 dark:hover:text-white transition">
              <Mail size={15} />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="hover:text-zinc-900 dark:hover:text-white transition">
              <LinkedinIcon size={15} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
