import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/posts/[id] - Fetch single post
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("posts")
      .select("*, comments(*)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, summary, content, category, tags, isPublished } = body;

    // Fetch original post to compute estimated readTime if content changes
    const { data: originalPost } = await supabase
      .from("posts")
      .select("readTime")
      .eq("id", id)
      .single();

    const estimatedReadTime = content 
      ? Math.max(1, Math.round(content.length / 400)) 
      : (originalPost?.readTime || 1);

    const payload = {
      title,
      summary,
      content,
      category,
      tags,
      isPublished,
      readTime: estimatedReadTime,
    };

    const { error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "포스트가 수정되었습니다." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "포스트가 성공적으로 삭제되었습니다." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
