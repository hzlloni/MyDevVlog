import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/posts/[id]/view - Increment post views
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // 1. Fetch current views first to increment
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("views")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. Increment and update
    const { error: updateError } = await supabase
      .from("posts")
      .update({ views: (post.views || 0) + 1 })
      .eq("id", id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, message: "조회수가 1 증가했습니다." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
