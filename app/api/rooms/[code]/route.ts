import { NextRequest, NextResponse } from "next/server";
import { publicRoom } from "@/lib/game";
import { changeRoom, getRoom } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(_: NextRequest, { params }: { params: Promise<{ code: string }> }) { try { return NextResponse.json(publicRoom(await getRoom((await params).code))); } catch (e) { console.error("Room lookup failed:", e); return NextResponse.json({ error: e instanceof Error && !("code" in e) ? e.message : "Game storage is unavailable. Please try again." }, { status: 404 }); } }
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) { try { const { action, playerId, ...payload } = await req.json(); return NextResponse.json(publicRoom(await changeRoom((await params).code, playerId, action, payload))); } catch (e) { console.error("Room update failed:", e); return NextResponse.json({ error: e instanceof Error && !("code" in e) ? e.message : "Game storage is unavailable. Please try again." }, { status: 400 }); } }
