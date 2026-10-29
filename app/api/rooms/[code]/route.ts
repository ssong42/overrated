import { NextRequest, NextResponse } from "next/server";
import { changeRoom, getRoom, publicRoom } from "@/lib/game";
export const dynamic = "force-dynamic";
export async function GET(_: NextRequest, { params }: { params: Promise<{ code: string }> }) { try { return NextResponse.json(publicRoom(getRoom((await params).code))); } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Not found." }, { status: 404 }); } }
export async function POST(req: NextRequest, { params }: { params: Promise<{ code: string }> }) { try { const { action, playerId, ...payload } = await req.json(); return NextResponse.json(publicRoom(changeRoom((await params).code, playerId, action, payload))); } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid request." }, { status: 400 }); } }
