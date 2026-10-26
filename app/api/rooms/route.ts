import { NextRequest, NextResponse } from "next/server";
import { createRoom } from "@/lib/game";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) { try { const { name, playerId, mode } = await req.json(); return NextResponse.json(createRoom(name, playerId, mode)); } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid request." }, { status: 400 }); } }
