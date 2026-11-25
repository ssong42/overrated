import { NextRequest, NextResponse } from "next/server";
import { publicRoom } from "@/lib/game";
import { createRoom } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) { try { const { name, playerId, mode } = await req.json(); return NextResponse.json(publicRoom(await createRoom(name, playerId, mode))); } catch (e) { console.error("Room creation failed:", e); return NextResponse.json({ error: e instanceof Error && !("code" in e) ? e.message : "Game storage is unavailable. Please try again." }, { status: 400 }); } }
