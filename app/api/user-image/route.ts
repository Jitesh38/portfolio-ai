import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ msg: "Missing userId" }, { status: 400 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return NextResponse.json({
      imageUrl: user.hasImage ? user.imageUrl : null,
    });
  } catch {
    return NextResponse.json({ msg: "User not found" }, { status: 404 });
  }
}
