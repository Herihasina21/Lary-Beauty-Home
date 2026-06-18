import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { fetchAdminNotificationStats } from "@/lib/site-data";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stats = await fetchAdminNotificationStats();
  return NextResponse.json(stats);
}
