"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, Comment } from "../lib/blogTypes";
import { initialPosts } from "../lib/mockData";

interface BlogContextType {
  posts: Post[];
  isAdmin: boolean;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  addPost: (post: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt">) => Post;
  updatePost: (id: string, updatedFields: Partial<Post>) => void;
  deletePost: (id: string) => void;
  incrementViews: (id: string) => void;
  addComment: (postId: string, author: string, content: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");

  // Load from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem("blog_posts");
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts) as Post[];
      
      // 1. Clean up stale/old dummy posts
      let filtered = parsed.filter(
        (p) => p.id !== "nextjs16-rsc" && 
               p.id !== "spring-security-jwt" &&
               p.id !== "springboot-intro-1" &&
               p.id !== "springboot-intro-2" &&
               p.id !== "springboot-intro-3"
      );

      // 2. Clean up duplicate H1 headers & fix broken LaTeX equations in cached content
      filtered = filtered.map((p) => {
        if (p.id === "ml-math-latex") {
          const cleanModel = initialPosts.find((mock) => mock.id === "ml-math-latex");
          if ((p.content.includes("$$") || p.content.includes("\\hat{y}")) && cleanModel) {
            return { ...p, content: cleanModel.content };
          }
          const cleanedContent = p.content.replace(/^# 머신러닝 이해를 위한 기초 선형대수학 & 경사하강법 수학 공식\s*\n*/, "");
          return { ...p, content: cleanedContent };
        }
        return p;
      });

      // 3. Inject new React vs NextJS comparison post if not in cache
      const hasReactVsNext = filtered.some((p) => p.id === "react-vs-nextjs");
      if (!hasReactVsNext) {
        const reactVsNextPost = initialPosts.find((p) => p.id === "react-vs-nextjs");
        if (reactVsNextPost) {
          filtered.push(reactVsNextPost);
        }
      }

      setPosts(filtered);
      localStorage.setItem("blog_posts", JSON.stringify(filtered));
    } else {
      setPosts(initialPosts);
      localStorage.setItem("blog_posts", JSON.stringify(initialPosts));
    }

    const savedAdmin = localStorage.getItem("blog_admin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    }

    const savedTheme = localStorage.getItem("blog_theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      if (systemTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem("blog_theme", newTheme);
  };

  const adminLogin = (password: string): boolean => {
    if (password === "admin1234") {
      setIsAdmin(true);
      localStorage.setItem("blog_admin", "true");
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("blog_admin");
  };

  const addPost = (postFields: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt">) => {
    const today = new Date().toISOString().split("T")[0];
    const newPost: Post = {
      ...postFields,
      id: postFields.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `post-${Date.now()}`,
      views: 0,
      likes: 0,
      comments: [],
      createdAt: today,
    };

    const nextPosts = [newPost, ...posts];
    setPosts(nextPosts);
    localStorage.setItem("blog_posts", JSON.stringify(nextPosts));
    return newPost;
  };

  const updatePost = (id: string, updatedFields: Partial<Post>) => {
    const nextPosts = posts.map((post) => (post.id === id ? { ...post, ...updatedFields } : post));
    setPosts(nextPosts);
    localStorage.setItem("blog_posts", JSON.stringify(nextPosts));
  };

  const deletePost = (id: string) => {
    const nextPosts = posts.filter((post) => post.id !== id);
    setPosts(nextPosts);
    localStorage.setItem("blog_posts", JSON.stringify(nextPosts));
  };

  const incrementViews = (id: string) => {
    const viewedKey = `viewed_${id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      const nextPosts = posts.map((post) =>
        post.id === id ? { ...post, views: post.views + 1 } : post
      );
      setPosts(nextPosts);
      localStorage.setItem("blog_posts", JSON.stringify(nextPosts));
      sessionStorage.setItem(viewedKey, "true");
    }
  };

  const addComment = (postId: string, author: string, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author,
      content,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    const nextPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });

    setPosts(nextPosts);
    localStorage.setItem("blog_posts", JSON.stringify(nextPosts));
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        isAdmin,
        theme,
        setTheme,
        adminLogin,
        adminLogout,
        addPost,
        updatePost,
        deletePost,
        incrementViews,
        addComment,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
