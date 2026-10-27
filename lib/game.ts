export type Mode = "casual" | "competitive";
export type Status = "lobby" | "topic" | "rating" | "guessing" | "reveal" | "tie" | "finished";
export type Player = { id: string; name: string; cards: number };
export type Submission = { playerId: string; rating: number };
export type Round = { topic?: string; topicOptions: string[]; chooserRating?: number; submissions: Submission[]; result?: { winners: Player[] } };
export type Room = { code: string; hostId: string; mode: Mode; players: Player[]; status: Status; chooserIndex: number; round?: Round; winner?: Player; updatedAt: number };

const TOPICS = [
  "Crocs", "Brunch", "Pineapple on pizza", "Camping", "Reality TV", "Voice notes", "Cold plunges", "Airport beer", "Group chats", "Autotune", "Thrifting", "Taylor Swift",
  "Breakfast for dinner", "Board games", "Public proposals", "Spicy food", "Socks with sandals", "Singing in the car", "Roller coasters", "True crime podcasts", "Buying books", "Reading books", "Dog costumes", "Cat videos",
  "Long showers", "Short naps", "Early mornings", "Staying up late", "Rainy days", "Snow days", "Beach vacations", "City breaks", "Road trips", "Cruises", "All-inclusive resorts", "Hostels",
  "Window seats", "Aisle seats", "Flying first class", "Turbulence", "Airport security", "Checking a bag", "Packing cubes", "Souvenir shops", "Hotel breakfast", "Room service", "Mini bars", "Travel itineraries",
  "Coffee", "Decaf coffee", "Matcha", "Bubble tea", "Energy drinks", "Sparkling water", "Tap water", "Orange juice", "Chocolate milk", "Iced coffee", "Fancy ice cubes", "Drinking straws",
  "Avocado toast", "Sushi", "Tacos", "Burgers", "Hot dogs", "French fries", "Onion rings", "Chicken nuggets", "Salad", "Soup", "Sandwiches", "Charcuterie boards",
  "Ketchup", "Ranch dressing", "Mayonnaise", "Hot sauce", "Pickles", "Olives", "Mushrooms", "Raisins", "Candy corn", "Mint chocolate", "Black licorice", "Leftover pizza",
  "Meal prepping", "Cooking shows", "Food delivery apps", "Grocery shopping", "Farmers markets", "Buffets", "Potlucks", "Fancy restaurants", "Fast food", "Dessert first", "Birthday cake", "Cupcakes",
  "Karaoke", "Dancing at weddings", "Wedding speeches", "Surprise parties", "Theme parties", "Costume parties", "Escape rooms", "Trivia night", "Mini golf", "Bowling", "Laser tag", "Arcades",
  "Movie theaters", "Popcorn at the movies", "Movie spoilers", "Rewatching shows", "Binge watching", "Subtitles", "Dubbed movies", "Movie musicals", "Rom-coms", "Horror movies", "Superhero movies", "Documentaries",
  "Live concerts", "Music festivals", "Vinyl records", "Playlists", "Album covers", "One-hit wonders", "Cover songs", "Musical theater", "Stand-up comedy", "Magic shows", "Museums", "Art galleries",
  "Video games", "Mobile games", "Puzzle games", "Crosswords", "Word games", "Jigsaw puzzles", "Collecting cards", "LEGO sets", "Action figures", "Stuffed animals", "Candles", "Houseplants",
  "Taking photos", "Printing photos", "Photo booths", "Disposable cameras", "Selfies", "Family group chats", "Birthday posts", "Social media stories", "Dating apps", "Online shopping", "Unboxing videos", "Influencers",
  "Paper maps", "Handwritten notes", "Cursive", "Journaling", "To-do lists", "New Year resolutions", "Vision boards", "Personality quizzes", "Horoscopes", "Lucky charms", "Ghost stories", "Conspiracy theories",
  "Tattoos", "Piercings", "Dyeing your hair", "Bangs", "Matching outfits", "Formalwear", "Halloween costumes", "Secondhand clothes", "Sneaker collecting", "Wearing hats", "Sunglasses indoors", "Fanny packs",
  "Cleaning", "Doing laundry", "Making the bed", "Washing dishes", "Vacuuming", "Organizing drawers", "Spring cleaning", "Building furniture", "DIY projects", "Gardening", "Mowing the lawn", "Raking leaves",
  "Gym workouts", "Yoga", "Running", "Hiking", "Biking", "Team sports", "Pickleball", "Fantasy sports", "Watching sports", "Sports bars", "Tailgating", "Trophy ceremonies",
  "School uniforms", "Homework", "Group projects", "School dances", "Graduation ceremonies", "Office parties", "Working from home", "Commutes", "Standing desks", "Lunch breaks", "Casual Fridays", "Retirement parties",
  "Reading the news", "Weather apps", "Daylight saving time", "Leap day", "Waiting in line", "Small talk", "Being early", "Being late", "HaggGet rling", "Cash", "Gift cards", "Loyalty points",
  "Paper receipts", "Birthday cards", "Thank-you notes", "Giving gifts", "Regifting", "Secret Santa", "Practical gifts", "Flowers", "Balloons", "Fireworks", "Parades", "Fairs",
  "Zoos", "Aquariums", "Amusement parks", "Water parks", "Public pools", "Libraries", "Bookstores", "Malls", "IKEA", "Garage sales", "Flea markets", "Antique stores",
  "Pet birds", "Goldfish", "Reptiles", "Rescuing a pet", "Pet names", "Dog parks", "Dog beaches", "Training a puppy", "Cats on counters", "Pet sitting", "Animal cafés", "Wildlife documentaries",
  "Sunsets", "Sunrises", "Thunderstorms", "Foggy mornings", "Humid weather", "Windy days", "Heat waves", "Weather forecasts", "Umbrellas", "Rain boots", "Sunscreen", "Bug spray",
  "Picnics", "Barbecues", "Bonfires", "Camping in a tent", "Sleeping bags", "Hammocks", "Stargazing", "Fishing", "Kayaking", "Canoeing", "Paddle boarding", "Rock climbing",
  "Skiing", "Snowboarding", "Ice skating", "Sledding", "Building snowmen", "Snowball fights", "Hot tubs", "Saunas", "Spa days", "Massages", "Face masks", "Manicures",
  "Flip phones", "Landlines", "Voicemail", "Texting", "Video calls", "Reply-all emails", "Email signatures", "Password managers", "Smart watches", "Smart speakers", "Robot vacuums", "Electric cars",
  "Streaming subscriptions", "Cable TV", "Podcasts", "Audiobooks", "Radio stations", "Morning shows", "Late-night TV", "Game shows", "Talent competitions", "Cooking competitions", "Award shows", "Red carpets",
  "Animated movies", "Stop-motion movies", "Silent films", "Foreign films", "Movie remakes", "Sequels", "Prequels", "Movie trailers", "Post-credit scenes", "Director's cuts", "Opening credits", "Movie soundtracks",
  "Comic books", "Manga", "Graphic novels", "Fan fiction", "Book clubs", "Poetry", "Memoirs", "Cookbooks", "Coffee-table books", "E-readers", "Library cards", "Book adaptations",
  "Concert merch", "Band T-shirts", "Learning an instrument", "Guitar solos", "Drum solos", "Music videos", "Dance challenges", "Singing in public", "Listening to music while working", "Classical music", "Jazz", "Country music",
  "Painting", "Drawing", "Pottery", "Knitting", "Crocheting", "Sewing", "Embroidery", "Scrapbooking", "Calligraphy", "Origami", "Adult coloring books", "Craft fairs",
  "Baking bread", "Making pasta", "Grilling", "Air fryers", "Slow cookers", "Microwaves", "Kitchen gadgets", "Recipe blogs", "Cooking from scratch", "Cooking with friends", "Breakfast in bed", "Midnight snacks",
  "Bagels", "Donuts", "Pancakes", "Waffles", "Cereal", "Oatmeal", "Peanut butter", "Jam", "Maple syrup", "Honey", "Ice cream", "Frozen yogurt",
  "Milkshakes", "Smoothies", "Mocktails", "Cocktails", "Wine tasting", "Craft beer", "Champagne", "Tea parties", "Afternoon tea", "Brunch cocktails", "Happy hour", "Drinking games",
  "Beach reads", "Pool floats", "Sand castles", "Seashells", "Lighthouses", "National parks", "Tourist traps", "Guided tours", "Hop-on hop-off buses", "Travel postcards", "Travel vlogs", "Language apps",
  "Learning a language", "Accents", "Puns", "Dad jokes", "Knock-knock jokes", "Pranks", "April Fools' Day", "Inside jokes", "Nicknames", "Icebreakers", "Fun facts", "Would-you-rather questions",
  "Reality competitions", "Dating shows", "Home renovation shows", "Nature shows", "Crime dramas", "Sitcoms", "Soap operas", "Cartoons", "Anime", "Saturday morning cartoons", "TV theme songs", "Cliffhangers",
  "Window shopping", "Black Friday", "Impulse buying", "Coupons", "Store brands", "Luxury brands", "Subscription boxes", "Vending machines", "Claw machines", "Lottery tickets", "Scratch cards", "Coin collections",
  "Public speaking", "Debates", "Job interviews", "First impressions", "Networking events", "Name tags", "Office snacks", "Team-building exercises", "Business casual", "Uniforms at work", "Side hustles", "Taking sick days",
  "Being the host", "Being a guest", "Splitting the bill", "Tipping", "Housewarming parties", "Dinner parties", "Meeting neighbors", "Borrowing things", "Returning shopping carts", "Holding doors open", "Elevator small talk", "Talking to strangers",
  "Breakfast buffets", "Hotel lobbies", "Rooftop bars", "Food courts", "Museum gift shops", "Aquarium tunnels", "Observation decks", "Ferris wheels", "Carousels", "Haunted houses", "Corn mazes", "Pumpkin patches",
  "Apple picking", "Flower gardens", "Botanical gardens", "Cherry blossoms", "Houseboats", "Tree houses", "Cabins", "Tiny houses", "Open-concept homes", "Fireplaces", "Porches", "Window boxes"
];
const rooms = new Map<string, Room>();
const code = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const clone = (room: Room) => JSON.parse(JSON.stringify(room)) as Room;
const topicOptions = () => [...TOPICS].sort(() => Math.random() - .5).slice(0, 4);

export function createRoom(name: string, playerId: string, mode: Mode) {
  if (!name) throw new Error("Add your name.");
  let roomCode = code(); while (rooms.has(roomCode)) roomCode = code();
  const room: Room = { code: roomCode, hostId: playerId, mode, players: [{ id: playerId, name, cards: 0 }], status: "lobby", chooserIndex: 0, round: { topicOptions: topicOptions(), submissions: [] }, updatedAt: Date.now() };
  rooms.set(roomCode, room); return clone(room);
}
export function getRoom(roomCode: string) { const room = rooms.get(roomCode); if (!room) throw new Error("That room no longer exists."); return clone(room); }
export function changeRoom(roomCode: string, playerId: string, action: string, payload: { name?: string; rating?: number; topic?: string }) {
  const room = rooms.get(roomCode); if (!room) throw new Error("That room no longer exists.");
  const player = room.players.find((p) => p.id === playerId);
  if (action === "join") { if (player) return clone(room); if (!payload.name) throw new Error("Enter a name."); if (room.status !== "lobby") throw new Error("This game has already started."); if (room.players.length >= 4) throw new Error("This room is full — four opinion-havers max."); room.players.push({ id: playerId, name: payload.name.slice(0, 18), cards: 0 }); room.updatedAt = Date.now(); return clone(room); }
  if (!player) throw new Error("You are not in this room.");
  const chooser = room.players[room.chooserIndex];
  if (action === "start") { if (playerId !== room.hostId) throw new Error("Only the host can start."); if (room.players.length < 2) throw new Error("You need at least two players."); room.status = "topic"; }
  else if (action === "topic") { if (room.status !== "topic" || chooser.id !== playerId) throw new Error("It is not your turn to choose a topic."); if (!payload.topic || !room.round!.topicOptions.includes(payload.topic)) throw new Error("Choose one of the available topics."); room.round!.topic = payload.topic; room.status = "rating"; }
  else if (action === "rate") { if (room.status !== "rating" || chooser.id !== playerId) throw new Error("It is not your turn to rate."); room.round!.chooserRating = checkedRating(payload.rating); room.status = "guessing"; }
  else if (action === "guess") { if (room.status !== "guessing" || chooser.id === playerId) throw new Error("You cannot submit a guess now."); if (room.round!.submissions.some((s) => s.playerId === playerId)) throw new Error("Your guess is already locked."); room.round!.submissions.push({ playerId, rating: checkedRating(payload.rating) }); if (room.round!.submissions.length === room.players.length - 1) reveal(room); }
  else if (action === "tiebreak") { if (room.status !== "reveal" || !room.round?.result || room.round.result.winners.length < 2) throw new Error("There is no tie to break."); const pickedCopy = room.round.result.winners[Math.floor(Math.random() * room.round.result.winners.length)]; const pick = room.players.find((p) => p.id === pickedCopy.id)!; pick.cards++; room.round.result.winners = [{ ...pick }]; room.status = room.mode === "competitive" && pick.cards >= 10 ? "finished" : "tie"; if (room.status === "finished") room.winner = { ...pick }; }
  else if (action === "next") { if (room.status !== "reveal" && room.status !== "tie") throw new Error("Reveal this round first."); newRound(room); }
  else if (action === "restart") { if (room.status !== "finished") throw new Error("The game is still going."); room.players.forEach((p) => p.cards = 0); room.chooserIndex = 0; room.winner = undefined; room.status = "topic"; room.round = { topicOptions: topicOptions(), submissions: [] }; }
  else throw new Error("Unknown game action.");
  room.updatedAt = Date.now(); return clone(room);
}
function checkedRating(rating?: number) { if (!Number.isInteger(rating) || rating! < -5 || rating! > 5) throw new Error("Choose a whole-number rating from −5 to +5."); return rating!; }
function reveal(room: Room) { const answer = room.round!.chooserRating!; const distances = room.round!.submissions.map((s) => ({ ...s, distance: Math.abs(s.rating - answer) })); const closest = Math.min(...distances.map((s) => s.distance)); const winners = distances.filter((s) => s.distance === closest).map((s) => room.players.find((p) => p.id === s.playerId)!).map((p) => ({ ...p })); room.round!.result = { winners }; room.status = "reveal"; if (winners.length === 1) { const winner = room.players.find((p) => p.id === winners[0].id)!; winner.cards++; room.round!.result!.winners = [{ ...winner }]; if (room.mode === "competitive" && winner.cards >= 10) { room.winner = winner; room.status = "finished"; } } }
function newRound(room: Room) { room.chooserIndex = (room.chooserIndex + 1) % room.players.length; room.round = { topicOptions: topicOptions(), submissions: [] }; room.status = "topic"; }
