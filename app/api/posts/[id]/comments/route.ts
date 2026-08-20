import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/posts/[id]/comments - Add a comment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, content } = body;

    const newCommentPayload = {
      postId: id,
      author,
      content,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    const { data, error } = await supabase
      .from("comments")
      .insert([newCommentPayload])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      comment: data,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
