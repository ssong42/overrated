export type Mode = "casual" | "competitive";
export type Status = "lobby" | "rating" | "guessing" | "reveal" | "tie" | "finished";
export type Player = { id: string; name: string; cards: number };
export type Submission = { playerId: string; rating: number };
export type Round = { topic: string; chooserRating?: number; submissions: Submission[]; result?: { winners: Player[] } };
export type Room = { code: string; hostId: string; mode: Mode; players: Player[]; status: Status; chooserIndex: number; round?: Round; winner?: Player; updatedAt: number };

const TOPICS = ["Crocs", "Brunch", "Taylor Swift", "Pineapple on pizza", "Camping", "Reality TV", "Voice notes", "Cold plunges", "Airport beer", "Group chats", "Autotune", "Thrifting"];
const rooms = new Map<string, Room>();
const code = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const clone = (room: Room) => JSON.parse(JSON.stringify(room)) as Room;
const topic = () => TOPICS[Math.floor(Math.random() * TOPICS.length)];

export function createRoom(name: string, playerId: string, firstTopic: string, mode: Mode) {
  if (!name || !firstTopic) throw new Error("Add your name and a first topic.");
  let roomCode = code(); while (rooms.has(roomCode)) roomCode = code();
  const room: Room = { code: roomCode, hostId: playerId, mode, players: [{ id: playerId, name, cards: 0 }], status: "lobby", chooserIndex: 0, round: { topic: firstTopic, submissions: [] }, updatedAt: Date.now() };
  rooms.set(roomCode, room); return clone(room);
}
export function getRoom(roomCode: string) { const room = rooms.get(roomCode); if (!room) throw new Error("That room no longer exists."); return clone(room); }
export function changeRoom(roomCode: string, playerId: string, action: string, payload: { name?: string; rating?: number }) {
  const room = rooms.get(roomCode); if (!room) throw new Error("That room no longer exists.");
  const player = room.players.find((p) => p.id === playerId);
  if (action === "join") { if (player) return clone(room); if (!payload.name) throw new Error("Enter a name."); if (room.status !== "lobby") throw new Error("This game has already started."); if (room.players.length >= 4) throw new Error("This room is full — four opinion-havers max."); room.players.push({ id: playerId, name: payload.name.slice(0, 18), cards: 0 }); room.updatedAt = Date.now(); return clone(room); }
  if (!player) throw new Error("You are not in this room.");
  const chooser = room.players[room.chooserIndex];
  if (action === "start") { if (playerId !== room.hostId) throw new Error("Only the host can start."); if (room.players.length < 2) throw new Error("You need at least two players."); room.status = "rating"; }
  else if (action === "rate") { if (room.status !== "rating" || chooser.id !== playerId) throw new Error("It is not your turn to rate."); room.round!.chooserRating = checkedRating(payload.rating); room.status = "guessing"; }
  else if (action === "guess") { if (room.status !== "guessing" || chooser.id === playerId) throw new Error("You cannot submit a guess now."); if (room.round!.submissions.some((s) => s.playerId === playerId)) throw new Error("Your guess is already locked."); room.round!.submissions.push({ playerId, rating: checkedRating(payload.rating) }); if (room.round!.submissions.length === room.players.length - 1) reveal(room); }
  else if (action === "tiebreak") { if (room.status !== "reveal" || !room.round?.result || room.round.result.winners.length < 2) throw new Error("There is no tie to break."); const pickedCopy = room.round.result.winners[Math.floor(Math.random() * room.round.result.winners.length)]; const pick = room.players.find((p) => p.id === pickedCopy.id)!; pick.cards++; room.round.result.winners = [{ ...pick }]; room.status = room.mode === "competitive" && pick.cards >= 10 ? "finished" : "tie"; if (room.status === "finished") room.winner = { ...pick }; }
  else if (action === "next") { if (room.status !== "reveal" && room.status !== "tie") throw new Error("Reveal this round first."); newRound(room); }
  else if (action === "restart") { if (room.status !== "finished") throw new Error("The game is still going."); room.players.forEach((p) => p.cards = 0); room.chooserIndex = 0; room.winner = undefined; room.status = "rating"; room.round = { topic: topic(), submissions: [] }; }
  else throw new Error("Unknown game action.");
  room.updatedAt = Date.now(); return clone(room);
}
function checkedRating(rating?: number) { if (!Number.isInteger(rating) || rating! < 1 || rating! > 100) throw new Error("Choose a rating from 1 to 100."); return rating!; }
function reveal(room: Room) { const answer = room.round!.chooserRating!; const distances = room.round!.submissions.map((s) => ({ ...s, distance: Math.abs(s.rating - answer) })); const closest = Math.min(...distances.map((s) => s.distance)); const winners = distances.filter((s) => s.distance === closest).map((s) => room.players.find((p) => p.id === s.playerId)!).map((p) => ({ ...p })); room.round!.result = { winners }; room.status = "reveal"; if (winners.length === 1) { const winner = room.players.find((p) => p.id === winners[0].id)!; winner.cards++; room.round!.result!.winners = [{ ...winner }]; if (room.mode === "competitive" && winner.cards >= 10) { room.winner = winner; room.status = "finished"; } } }
function newRound(room: Room) { room.chooserIndex = (room.chooserIndex + 1) % room.players.length; room.round = { topic: topic(), submissions: [] }; room.status = "rating"; }
