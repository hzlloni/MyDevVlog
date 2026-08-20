"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, Comment } from "../lib/blogTypes";

interface BlogContextType {
  posts: Post[];
  isAdmin: boolean;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  addPost: (post: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt" | "readTime">) => Promise<Post | null>;
  updatePost: (id: string, updatedFields: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  addComment: (postId: string, author: string, content: string) => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");

  const printError = (message: string, error: any) => {
    console.error(message, error);
  };

  // Fetch posts from local Next.js Route Handlers (which query Supabase on the server)
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts?published=false");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        const err = await res.json();
        printError("Failed to fetch posts:", err);
      }
    } catch (err) {
      printError("Failed to fetch posts from API:", err);
    }
  };

  // On mount: fetch posts and load settings
  useEffect(() => {
    fetchPosts();

    const savedAdmin = localStorage.getItem("blog_admin");
    if (savedAdmin === "true") {
      setIsAdmin(true);
    }

    const savedTheme = localStorage.getItem("blog_theme") as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  // Sync dark theme class
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

  // Simple admin session management
  const adminLogin = async (password: string): Promise<boolean> => {
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

  // Add post via API route
  const addPost = async (postFields: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt" | "readTime">): Promise<Post | null> => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postFields),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.post) {
          await fetchPosts();
          return data.post;
        }
      } else {
        const err = await res.json();
        printError("Failed to add post:", err);
      }
    } catch (err) {
      printError("Failed to add post to API:", err);
    }
    return null;
  };

  // Update post via API route
  const updatePost = async (id: string, updatedFields: Partial<Post>) => {
    try {
      const currentPost = posts.find((p) => p.id === id);
      if (!currentPost) return;

      const merged = {
        title: updatedFields.title ?? currentPost.title,
        summary: updatedFields.summary ?? currentPost.summary,
        content: updatedFields.content ?? currentPost.content,
        category: updatedFields.category ?? currentPost.category,
        tags: updatedFields.tags ?? currentPost.tags,
        isPublished: updatedFields.isPublished ?? currentPost.isPublished,
      };

      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });

      if (res.ok) {
        await fetchPosts();
      } else {
        const err = await res.json();
        printError("Failed to update post:", err);
      }
    } catch (err) {
      printError("Failed to update post in API:", err);
    }
  };

  // Delete post via API route
  const deletePost = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchPosts();
      } else {
        const err = await res.json();
        printError("Failed to delete post:", err);
      }
    } catch (err) {
      printError("Failed to delete post from API:", err);
    }
  };

  // Increment view count via API route (controlled double-count prevention)
  const incrementViews = async (id: string) => {
    const viewedKey = `viewed_${id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      try {
        const res = await fetch(`/api/posts/${id}/view`, {
          method: "POST",
        });
        if (res.ok) {
          // Update locally for responsive UI update
          setPosts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p))
          );
          sessionStorage.setItem(viewedKey, "true");
        }
      } catch (err) {
        printError("Failed to increment views:", err);
      }
    }
  };

  // Add comment via API route
  const addComment = async (postId: string, author: string, content: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.comment) {
          // Append locally
          setPosts((prev) =>
            prev.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments: [...post.comments, data.comment as Comment],
                };
              }
              return post;
            })
          );
        }
      } else {
        const err = await res.json();
        printError("Failed to add comment:", err);
      }
    } catch (err) {
      printError("Failed to add comment in API:", err);
    }
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
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
}
