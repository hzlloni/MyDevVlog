"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, Comment } from "../lib/blogTypes";
import { supabase } from "../lib/supabaseClient";

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
    if (error && typeof error === "object") {
      console.error("🔍 Supabase Error Detail:", error.message || error.details || error.hint || JSON.stringify(error));
    }
  };

  // Fetch posts directly from Supabase Database
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          comments (*)
        `)
        .order("createdAt", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Map postgres snake_case or date formats if necessary
        const mappedPosts = data.map((p: any) => ({
          ...p,
          comments: p.comments || [],
        })) as Post[];
        setPosts(mappedPosts);
      }
    } catch (err) {
      printError("Failed to fetch posts from Supabase:", err);
    }
  };

  // On mount: fetch posts and load configuration
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

  // Sync class-based dark mode
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

  // Add post directly to Supabase table
  const addPost = async (postFields: Omit<Post, "id" | "views" | "likes" | "comments" | "createdAt" | "readTime">): Promise<Post | null> => {
    try {
      const slugId = postFields.title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "") || `post-${Date.now()}`;
      const today = new Date().toISOString().split("T")[0];
      const estimatedReadTime = Math.max(1, Math.round(postFields.content.length / 400));

      const newPostPayload = {
        id: slugId,
        title: postFields.title,
        summary: postFields.summary,
        content: postFields.content,
        category: postFields.category,
        tags: postFields.tags,
        createdAt: today,
        views: 0,
        likes: 0,
        isPublished: postFields.isPublished,
        readTime: estimatedReadTime,
      };

      const { data, error } = await supabase
        .from("posts")
        .insert([newPostPayload])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        await fetchPosts();
        return { ...data, comments: [] } as Post;
      }
    } catch (err) {
      printError("Failed to add post to Supabase:", err);
    }
    return null;
  };

  // Update existing post in Supabase table
  const updatePost = async (id: string, updatedFields: Partial<Post>) => {
    try {
      const currentPost = posts.find((p) => p.id === id);
      if (!currentPost) return;

      const estimatedReadTime = updatedFields.content 
        ? Math.max(1, Math.round(updatedFields.content.length / 400)) 
        : currentPost.readTime;

      const payload = {
        title: updatedFields.title ?? currentPost.title,
        summary: updatedFields.summary ?? currentPost.summary,
        content: updatedFields.content ?? currentPost.content,
        category: updatedFields.category ?? currentPost.category,
        tags: updatedFields.tags ?? currentPost.tags,
        isPublished: updatedFields.isPublished ?? currentPost.isPublished,
        readTime: estimatedReadTime,
      };

      const { error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", id);

      if (error) {
        throw error;
      }

      await fetchPosts();
    } catch (err) {
      printError("Failed to update post in Supabase:", err);
    }
  };

  // Delete post from Supabase
  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      await fetchPosts();
    } catch (err) {
      printError("Failed to delete post from Supabase:", err);
    }
  };

  // Increment post views directly in Supabase table
  const incrementViews = async (id: string) => {
    const viewedKey = `viewed_${id}`;
    if (!sessionStorage.getItem(viewedKey)) {
      try {
        const currentPost = posts.find((p) => p.id === id);
        if (!currentPost) return;

        const { error } = await supabase
          .from("posts")
          .update({ views: currentPost.views + 1 })
          .eq("id", id);

        if (error) {
          throw error;
        }

        // Increment locally for instant UI update
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p))
        );
        sessionStorage.setItem(viewedKey, "true");
      } catch (err) {
        printError("Failed to increment views in Supabase:", err);
      }
    }
  };

  // Add comment to comments table in Supabase
  const addComment = async (postId: string, author: string, content: string) => {
    try {
      const newCommentPayload = {
        postId,
        author,
        content,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };

      const { data, error } = await supabase
        .from("comments")
        .insert([newCommentPayload])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Append comment to local state array
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...post.comments, data as Comment],
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      printError("Failed to add comment to Supabase:", err);
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
