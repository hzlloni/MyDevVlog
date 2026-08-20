import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/posts - Fetch all posts (optionally filtered by published status)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published") !== "false"; // Default true

    let query = supabase.from("posts").select("*, comments(*)");
    
    if (published) {
      query = query.eq("isPublished", true);
    }
    
    const { data, error } = await query.order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, summary, content, category, tags, isPublished } = body;

    const slugId = title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "") || `post-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const estimatedReadTime = Math.max(1, Math.round(content.length / 400));

    const newPostPayload = {
      id: slugId,
      title,
      summary,
      content,
      category,
      tags: tags || [],
      createdAt: today,
      views: 0,
      likes: 0,
      isPublished: isPublished !== false,
      readTime: estimatedReadTime,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert([newPostPayload])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      post: { ...data, comments: [] },
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
