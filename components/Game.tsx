"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Mode, Room } from "@/lib/game";

const identityKey = "over-under-player";
const makeId = () => Math.random().toString(36).slice(2, 10);

async function request(path: string, body?: object) {
  const res = await fetch(path, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export function Game() {
  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<Mode>("casual");
  const [rating, setRating] = useState(6);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(identityKey);
    setPlayerId(saved || makeId());
  }, []);
  useEffect(() => { if (playerId) localStorage.setItem(identityKey, playerId); }, [playerId]);

  const refresh = useCallback(async () => {
    if (!room || !playerId) return;
    try { setRoom(await request(`/api/rooms/${room.code}?playerId=${playerId}`)); }
    catch { setRoom(null); }
  }, [room?.code, playerId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!room || room.status === "finished") return;
    const timer = setInterval(refresh, 1800);
    return () => clearInterval(timer);
  }, [room?.code, room?.status, refresh]);

  const action = async (actionName: string, extra = {}) => {
    if (!room) return;
    setBusy(true); setError("");
    try { setRoom(await request(`/api/rooms/${room.code}`, { action: actionName, playerId, ...extra })); }
    catch (e) { setError(e instanceof Error ? e.message : "Try again."); }
    finally { setBusy(false); }
  };
  const create = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try { setRoom(await request("/api/rooms", { name: name.trim(), playerId, mode })); }
    catch (e) { setError(e instanceof Error ? e.message : "Try again."); }
    finally { setBusy(false); }
  };
  const join = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try { setRoom(await request(`/api/rooms/${code.toUpperCase()}`, { action: "join", name: name.trim(), playerId })); }
    catch (e) { setError(e instanceof Error ? e.message : "Try again."); }
    finally { setBusy(false); }
  };

  if (!playerId) return <div className="loading">Loading the hot takes…</div>;
  if (!room) return <Landing {...{ name, setName, code, setCode, mode, setMode, create, join, busy, error }} />;
  return <RoomView room={room} playerId={playerId} rating={rating} setRating={setRating} action={action} busy={busy} error={error} exit={() => setRoom(null)} />;
}

function Landing(props: any) {
  return <section className="landing"><div className="brand"><p className="eyebrow">THE OPINION GAME</p><h1>OVER<span>/</span>UNDER</h1><p>How well do you know your friends’ terrible takes?</p></div><div className="home-grid">
    <form className="panel" onSubmit={props.create}><h2>Start a room</h2><label>Your name<input maxLength={18} required value={props.name} onChange={(e: any) => props.setName(e.target.value)} placeholder="Enter your name" /></label><div className="modes"><button type="button" className={props.mode === "casual" ? "selected" : ""} onClick={() => props.setMode("casual")}><b>Casual</b><small>Play forever</small></button><button type="button" className={props.mode === "competitive" ? "selected" : ""} onClick={() => props.setMode("competitive")}><b>Competitive</b><small>First to 10 cards</small></button></div><button className="primary" disabled={props.busy}>{props.busy ? "Making room…" : "Create room"}</button></form>
    <form className="panel join" onSubmit={props.join}><h2>Join the party</h2><p>Got a room code? Jump in — up to four players.</p><label>Your name<input maxLength={18} required value={props.name} onChange={(e: any) => props.setName(e.target.value)} placeholder="Your name" /></label><label>Room code<input maxLength={5} required value={props.code} onChange={(e: any) => props.setCode(e.target.value.toUpperCase())} placeholder="ABCDE" /></label><button className="secondary" disabled={props.busy}>Join room</button></form>
  </div>{props.error && <p className="error">{props.error}</p>}<p className="rules">One player secretly rates the topic from <b>underrated (11)</b> on the left to <b>overrated (1)</b> on the right. Everyone else guesses closest. Closest guess earns the card.</p></section>;
}

function RoomView({ room, playerId, rating, setRating, action, busy, error, exit }: any) {
  const [showCardsFor, setShowCardsFor] = useState<string | null>(null);
  const selectedPlayer = room.players.find((p: any) => p.id === showCardsFor);
  const me = room.players.find((p: any) => p.id === playerId);
  const chooser = room.players[room.chooserIndex];
  const isChooser = chooser?.id === playerId;
  const submitted = room.round?.submissions?.some((s: any) => s.playerId === playerId);
  const needed = room.players.length - (isChooser ? 1 : 0);
  const received = room.round?.submissions?.length || 0;
  const tieBreak = room.round?.tieBreak;
  const isContender = tieBreak?.contenders.includes(playerId);
  const tieSubmitted = tieBreak?.submissions.some((s: any) => s.playerId === playerId);
  const title = room.status === "lobby" ? "Gather your crew" : room.status === "topic" ? (isChooser ? "Pick the hot take" : "A hot take is brewing") : room.status === "rating" ? (isChooser ? "Set your secret rating" : "Read the room") : room.status === "guessing" ? (isChooser ? "Keep your poker face" : "Make your guess") : room.status.startsWith("tie") ? "Sudden-death tie-break" : room.status === "finished" ? "We have a legend" : "The verdict";
  const result = room.round?.result;
  useEffect(() => {
    if (room.status !== "reveal" || !result || result.winners.length < 2) return;
    const timer = window.setTimeout(() => action("tiebreak"), 5000);
    return () => window.clearTimeout(timer);
  }, [room.code, room.status, result?.winners?.length]);
  return <section className="game"><header><div className="mini-brand">OVER<span>/</span>UNDER</div><div className="room-code">ROOM <b>{room.code}</b><button onClick={exit}>Leave</button></div></header><div className="game-head"><p className="eyebrow">{room.mode === "competitive" ? "RACE TO 10 CARDS" : "CASUAL MODE · NO FINISH LINE"}</p><h2>{title}</h2></div><div className="scores">{room.players.map((p: any) => <div className={p.id === chooser?.id ? "score chooser" : "score"} key={p.id}><button className="player-name" onClick={() => setShowCardsFor(p.id)}>{p.name}{p.id === playerId ? " (you)" : ""}</button><b>{p.cards}</b><small>cards{p.id === chooser?.id && room.status !== "lobby" ? " · picker" : ""}</small></div>)}</div>
  {room.status === "lobby" && <div className="stage"><p>{room.players.length}/4 players are in. {room.players.length < 2 ? "Invite at least one friend to begin." : "Ready for some wildly personal opinions?"}</p><p className="invite">Share code <b>{room.code}</b></p>{me?.id === room.hostId && <button className="primary" disabled={room.players.length < 2 || busy} onClick={() => action("start")}>Start game</button>}</div>}
  {room.status === "topic" && <div className="stage">{isChooser ? <TopicPicker topic={room.round.topic} skipUsed={room.round.skipUsed} onPick={() => action("topic")} onSkip={() => action("skip")} busy={busy} /> : <Wait text={`${chooser.name} is choosing the next topic…`} />}</div>}
  {room.status === "rating" && <div className="stage"><Topic topic={room.round.topic} />{isChooser ? <Rating rating={rating} setRating={setRating} label="How do YOU feel?" button="Lock in my take" onSubmit={() => action("rate", { rating })} busy={busy} /> : <Wait text={`${chooser.name} is deciding how wrong everyone else is…`} />}</div>}
  {room.status === "guessing" && <div className="stage"><Topic topic={room.round.topic} />{isChooser ? <Wait text={`Waiting for ${needed - received} guess${needed - received === 1 ? "" : "es"}…`} /> : submitted ? <Wait text="Guess locked. No take-backs!" /> : <Rating rating={rating} setRating={setRating} label={`Where will ${chooser.name} land?`} button="Lock my guess" onSubmit={() => action("guess", { rating })} busy={busy} />}</div>}
     {room.status === "reveal" && <div className="stage"><Topic topic={room.round.topic} /><div className="reveal"><p>{chooser.name} rated it</p><strong className={ratingTone(room.round.chooserRating)}>{room.round.chooserRating}</strong><p className="scale-label"><span>UNDERRATED · 11</span><span>OVERRATED · 1</span></p>{result?.winners?.length ? <><h3>{result.winners.length > 1 ? "Dead even!" : `${result.winners[0].name} wins the card!`}</h3><div className="guesses">{result.winners.map((p: any) => <b key={p.id}>{p.name}</b>)}</div><GuessResults players={room.players} submissions={room.round.submissions} dealerId={chooser.id} dealerRating={room.round.chooserRating} />{result.winners.length > 1 ? <p className="auto-tiebreak">Sudden death starts automatically in 5 seconds…</p> : <button className="primary" onClick={() => action("next")} disabled={busy}>Next topic</button>}</> : null}</div></div>}
  {room.status === "tieTopic" && <div className="stage">{isChooser ? <TopicPicker topic={tieBreak.topic} skipUsed={tieBreak.skipUsed} onPick={() => action("tiebreakTopic")} onSkip={() => action("tiebreakSkip")} busy={busy} /> : <Wait text={`${chooser.name} is drawing the tie-break topic…`} />}</div>}
  {room.status === "tieRating" && <div className="stage"><Topic topic={tieBreak.topic} />{isChooser ? <Rating rating={rating} setRating={setRating} label="Set the tie-break rating" button="Lock in my rating" onSubmit={() => action("tiebreakRate", { rating })} busy={busy} /> : <Wait text={`${chooser.name} is setting the tie-break rating…`} />}</div>}
  {room.status === "tieGuessing" && <div className="stage"><Topic topic={tieBreak.topic} />{isChooser ? <Wait text={`Waiting for ${tieBreak.contenders.length - tieBreak.submissions.length} tie-break guess${tieBreak.contenders.length - tieBreak.submissions.length === 1 ? "" : "es"}…`} /> : !isContender ? <Wait text="Only the tied players are guessing this one." /> : tieSubmitted ? <Wait text="Tie-break guess locked." /> : <Rating rating={rating} setRating={setRating} label="Break the tie" button="Lock my tie-break guess" onSubmit={() => action("tiebreakGuess", { rating })} busy={busy} />}</div>}
   {room.status === "tie" && <div className="stage"><div className="tie"><div className="roulette">★</div><h3>Sudden death decided it!</h3><strong>{result?.winners?.[0]?.name}</strong><p>Closest on the tie-break takes the card.</p><button className="primary" onClick={() => action("next")} disabled={busy}>Next topic</button></div></div>}
   {room.status === "finished" && <div className="stage winner"><p>FIRST TO 10</p><h1>{room.winner?.name}</h1><h3>is officially the most in tune.</h3><button className="primary" onClick={() => action("restart")}>Play again</button></div>}
      {(room.status === "finished" || room.status.startsWith("tie")) && <GuessResults label="Round guesses" players={room.players} submissions={room.round.submissions} dealerId={chooser?.id} dealerRating={room.round.chooserRating} />}
      {room.status.startsWith("tie") && tieBreak?.results?.map((result: any, index: number) => <GuessResults key={`${result.topic}-${index}`} label={`Tie-break ${index + 1} · ${result.topic}`} players={room.players} submissions={result.submissions} dealerId={result.chooserId} dealerRating={result.chooserRating} />)}
      {room.status === "finished" && tieBreak?.results?.map((result: any, index: number) => <GuessResults key={`${result.topic}-${index}`} label={`Tie-break ${index + 1} · ${result.topic}`} players={room.players} submissions={result.submissions} dealerId={result.chooserId} dealerRating={result.chooserRating} />)}
    {error && <p className="error">{error}</p>}
    {selectedPlayer && <div className="cards-backdrop" onClick={() => setShowCardsFor(null)}><section className="cards-dialog" role="dialog" aria-modal="true" aria-labelledby="cards-title" onClick={(event) => event.stopPropagation()}><button className="cards-close" onClick={() => setShowCardsFor(null)} aria-label="Close cards">×</button><p className="eyebrow">CARD COLLECTION</p><h2 id="cards-title">{selectedPlayer.name}&apos;s cards</h2><p className="cards-count">{selectedPlayer.cardTopics.length} {selectedPlayer.cardTopics.length === 1 ? "card" : "cards"} won</p>{selectedPlayer.cardTopics.length ? <div className="card-collection">{selectedPlayer.cardTopics.map((topic: string, index: number) => <article className="won-card" key={`${topic}-${index}`}><span>OVER / UNDER · #{index + 1}</span><strong>{topic}</strong><small>OPINION CARD</small></article>)}</div> : <p className="empty-cards">No cards yet — the first one is up for grabs!</p>}</section></div>}
  </section>;
}

function GuessResults({ players, submissions, dealerId, dealerRating, label = "Everyone’s guesses" }: any) {
  const rows = players.flatMap((player: any) => {
    if (player.id === dealerId && Number.isInteger(dealerRating)) return [{ player, rating: dealerRating, dealer: true }];
    const submission = submissions.find((candidate: any) => candidate.playerId === player.id);
    return submission ? [{ player, rating: submission.rating, dealer: false }] : [];
  });
  return <div className="guess-results"><h3>{label}</h3><ul>{rows.map(({ player, rating, dealer }: any) => {
    const direction = rating < 6 ? "Overrated" : rating > 6 ? "Underrated" : "Middle";
    return <li key={player.id}><span>{player.name}{dealer && <small>Dealer’s choice</small>}</span><b className={ratingTone(rating)}>{direction} <strong>{rating}</strong></b></li>;
  })}</ul></div>;
}

function ratingTone(rating: number) { return rating < 6 ? "guess-over" : rating > 6 ? "guess-under" : "guess-neutral"; }

function Topic({ topic }: { topic?: string }) { return <div className="topic"><p>THE TOPIC</p><h3>{topic}</h3></div>; }
function TopicPicker({ topic, skipUsed, onPick, onSkip, busy }: { topic: string; skipUsed: boolean; onPick: () => void; onSkip: () => void; busy: boolean }) { return <div className="topic-picker"><p className="eyebrow">YOUR TURN TO PICK</p><h3>Play this topic?</h3><button className="topic-card" disabled={busy} onClick={onPick}>{topic}<span>→</span></button>{!skipUsed && <button className="skip" disabled={busy} onClick={onSkip}>Skip once</button>}<p>{skipUsed ? "Skip used — this is the one." : "Not feeling it? You get one skip this round."}</p></div>; }
function Wait({ text }: { text: string }) { return <div className="wait"><i></i><i></i><i></i><p>{text}</p></div>; }
function Rating({ rating, setRating, label, button, onSubmit, busy }: any) { return <div className="rating"><p>{label}</p><output className={ratingTone(rating)}>{rating}</output><input type="range" min="1" max="11" value={12 - rating} onChange={(e) => setRating(12 - Number(e.target.value))} /><div className="scale-label"><span>UNDERRATED<br/><b>11</b></span><span>OVERRATED<br/><b>1</b></span></div><button className="primary" onClick={onSubmit} disabled={busy}>{button}</button></div>; }
