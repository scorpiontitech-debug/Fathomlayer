import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    
    // Verify the webhook secret token
    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    
    // Support either path-based or tag-based revalidation
    if (body.path) {
      revalidatePath(body.path);
      return NextResponse.json({ revalidated: true, path: body.path, now: Date.now() });
    }
    
    if (body.tag) {
      revalidateTag(body.tag);
      return NextResponse.json({ revalidated: true, tag: body.tag, now: Date.now() });
    }

    // Default: Revalidate the entire site essentially (root layout)
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, path: "/", type: "layout", now: Date.now() });
    
  } catch (err: any) {
    return NextResponse.json({ message: "Error revalidating", error: err.message }, { status: 500 });
  }
}
