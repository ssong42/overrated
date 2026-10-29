export type Mode = "casual" | "competitive";
export type Status = "lobby" | "topic" | "rating" | "guessing" | "reveal" | "tieTopic" | "tieRating" | "tieGuessing" | "tie" | "finished";
export type Player = { id: string; name: string; cards: number; cardTopics: string[] };
export type Submission = { playerId: string; rating: number };
export type TieBreak = { contenders: string[]; topic: string; skipUsed: boolean; chooserRating?: number; submissions: Submission[] };
export type Round = { topic: string; skipUsed: boolean; chooserRating?: number; submissions: Submission[]; result?: { winners: Player[] }; tieBreak?: TieBreak };
export type Room = { code: string; hostId: string; mode: Mode; players: Player[]; status: Status; chooserIndex: number; round?: Round; winner?: Player; updatedAt: number };

const BASE_TOPICS = [
  "Crocs", "Brunch", "Camping", "Reality TV", "Voice notes", "Cold plunges",
  "Airport beer", "Group chats", "Autotune", "Thrifting", "Taylor Swift", "Board games",
  "Public proposals", "Spicy food", "Roller coasters", "Buying books", "Reading books", "Dog costumes",
  "Cat videos", "Long showers", "Short naps", "Early mornings", "Rainy days", "Snow days",
  "Beach vacations", "City breaks", "Road trips", "Cruises", "All-inclusive resorts", "Hostels",
  "Window seats", "Aisle seats", "Turbulence", "Airport security", "Packing cubes", "Souvenir shops",
  "Hotel breakfast", "Room service", "Mini bars", "Travel itineraries", "Coffee", "Decaf coffee",
  "Matcha", "Bubble tea", "Energy drinks", "Sparkling water", "Tap water", "Orange juice",
  "Chocolate milk", "Iced coffee", "Drinking straws", "Avocado toast", "Sushi", "Tacos",
  "Burgers", "Hot dogs", "French fries", "Onion rings", "Chicken nuggets", "Salad",
  "Soup", "Sandwiches", "Charcuterie boards", "Ketchup", "Ranch dressing", "Mayonnaise",
  "Hot sauce", "Pickles", "Olives", "Mushrooms", "Raisins", "Candy corn",
  "Mint chocolate", "Black licorice", "Leftover pizza", "Meal prepping", "Cooking shows", "Grocery shopping",
  "Farmers markets", "Buffets", "Potlucks", "Fancy restaurants", "Fast food", "Dessert first",
  "Birthday cake", "Cupcakes", "Karaoke", "Wedding speeches", "Surprise parties", "Theme parties",
  "Costume parties", "Escape rooms", "Trivia night", "Mini golf", "Bowling", "Laser tag",
  "Arcades", "Movie theaters", "Movie spoilers", "Rewatching shows", "Binge watching", "Subtitles",
  "Dubbed movies", "Movie musicals", "Rom-coms", "Horror movies", "Superhero movies", "Documentaries",
  "Live concerts", "Music festivals", "Vinyl records", "Playlists", "Album covers", "One-hit wonders",
  "Cover songs", "Musical theater", "Stand-up comedy", "Magic shows", "Museums", "Art galleries",
  "Video games", "Mobile games", "Puzzle games", "Crosswords", "Word games", "Jigsaw puzzles",
  "Collecting cards", "LEGO sets", "Action figures", "Stuffed animals", "Candles", "Houseplants",
  "Taking photos", "Printing photos", "Photo booths", "Disposable cameras", "Selfies", "Birthday posts",
  "Dating apps", "Online shopping", "Unboxing videos", "Influencers", "Paper maps", "Handwritten notes",
  "Cursive", "Journaling", "To-do lists", "Vision boards", "Personality quizzes", "Horoscopes",
  "Lucky charms", "Ghost stories", "Conspiracy theories", "Tattoos", "Piercings", "Bangs",
  "Matching outfits", "Formalwear", "Halloween costumes", "Secondhand clothes", "Sneaker collecting", "Wearing hats",
  "Sunglasses indoors", "Fanny packs", "Cleaning", "Doing laundry", "Washing dishes", "Vacuuming",
  "Organizing drawers", "Spring cleaning", "Building furniture", "DIY projects", "Gardening", "Raking leaves",
  "Gym workouts", "Yoga", "Running", "Hiking", "Biking", "Team sports",
  "Pickleball", "Fantasy sports", "Watching sports", "Sports bars", "Tailgating", "Trophy ceremonies",
  "School uniforms", "Homework", "Group projects", "School dances", "Graduation ceremonies", "Office parties",
  "Commutes", "Standing desks", "Lunch breaks", "Casual Fridays", "Retirement parties", "Weather apps",
  "Leap day", "Small talk", "Being early", "Being late", "Haggling", "Cash",
  "Gift cards", "Loyalty points", "Paper receipts", "Birthday cards", "Thank-you notes", "Giving gifts",
  "Regifting", "Secret Santa", "Practical gifts", "Flowers", "Balloons", "Fireworks",
  "Parades", "Fairs", "Zoos", "Aquariums", "Amusement parks", "Water parks",
  "Public pools", "Libraries", "Bookstores", "Malls", "IKEA", "Garage sales",
  "Flea markets", "Antique stores", "Pet birds", "Goldfish", "Reptiles", "Pet names",
  "Dog parks", "Dog beaches", "Pet sitting", "Animal cafés", "Wildlife documentaries", "Sunsets",
  "Sunrises", "Thunderstorms", "Foggy mornings", "Humid weather", "Windy days", "Heat waves",
  "Weather forecasts", "Umbrellas", "Rain boots", "Sunscreen", "Bug spray", "Picnics",
  "Barbecues", "Bonfires", "Sleeping bags", "Hammocks", "Stargazing", "Fishing",
  "Kayaking", "Canoeing", "Paddle boarding", "Rock climbing", "Skiing", "Snowboarding",
  "Ice skating", "Sledding", "Building snowmen", "Snowball fights", "Hot tubs", "Saunas",
  "Spa days", "Massages", "Face masks", "Manicures", "Flip phones", "Landlines",
  "Voicemail", "Texting", "Video calls", "Reply-all emails", "Email signatures", "Password managers",
  "Smart watches", "Smart speakers", "Robot vacuums", "Electric cars", "Streaming subscriptions", "Cable TV",
  "Podcasts", "Audiobooks", "Radio stations", "Morning shows", "Late-night TV", "Game shows",
  "Talent competitions", "Cooking competitions", "Award shows", "Red carpets", "Animated movies", "Stop-motion movies",
  "Silent films", "Foreign films", "Movie remakes", "Sequels", "Prequels", "Movie trailers",
  "Post-credit scenes", "Director's cuts", "Opening credits", "Movie soundtracks", "Comic books", "Manga",
  "Graphic novels", "Fan fiction", "Book clubs", "Poetry", "Memoirs", "Cookbooks",
  "Coffee-table books", "E-readers", "Library cards", "Book adaptations", "Concert merch", "Band T-shirts",
  "Guitar solos", "Drum solos", "Music videos", "Dance challenges", "Classical music", "Jazz",
  "Country music", "Painting", "Drawing", "Pottery", "Knitting", "Crocheting",
  "Sewing", "Embroidery", "Scrapbooking", "Calligraphy", "Origami", "Craft fairs",
  "Baking bread", "Making pasta", "Grilling", "Air fryers", "Slow cookers", "Microwaves",
  "Kitchen gadgets", "Recipe blogs", "Midnight snacks", "Bagels", "Donuts", "Pancakes",
  "Waffles", "Cereal", "Oatmeal", "Peanut butter", "Jam", "Maple syrup",
  "Honey", "Ice cream", "Frozen yogurt", "Milkshakes", "Smoothies", "Mocktails",
  "Cocktails", "Wine tasting", "Craft beer", "Champagne", "Tea parties", "Afternoon tea",
  "Brunch cocktails", "Happy hour", "Drinking games", "Beach reads", "Pool floats", "Sand castles",
  "Seashells", "Lighthouses", "National parks", "Tourist traps", "Guided tours", "Travel postcards",
  "Travel vlogs", "Language apps", "Accents", "Puns", "Dad jokes", "Knock-knock jokes",
  "Pranks", "Inside jokes", "Nicknames", "Icebreakers", "Fun facts", "Would-you-rather questions",
  "Reality competitions", "Dating shows", "Nature shows", "Crime dramas", "Sitcoms", "Soap operas",
  "Cartoons", "Anime", "Cliffhangers", "Window shopping", "Black Friday", "Impulse buying",
  "Coupons", "Store brands", "Luxury brands", "Subscription boxes", "Vending machines", "Claw machines",
  "Lottery tickets", "Scratch cards", "Coin collections", "Public speaking", "Debates", "Job interviews",
  "First impressions", "Networking events", "Name tags", "Office snacks", "Team-building exercises", "Business casual",
  "Side hustles", "Tipping", "Housewarming parties", "Dinner parties", "Meeting neighbors", "Borrowing things",
  "Breakfast buffets", "Hotel lobbies", "Rooftop bars", "Food courts", "Aquarium tunnels", "Observation decks",
  "Ferris wheels", "Carousels", "Haunted houses", "Corn mazes", "Pumpkin patches", "Apple picking",
  "Flower gardens", "Botanical gardens", "Cherry blossoms", "Houseboats", "Tree houses", "Cabins",
  "Tiny houses", "Open-concept homes", "Fireplaces", "Porches", "Window boxes",
];

const EXTRA_TOPICS = [
  "Espresso machines", "Stand mixers", "Rice cookers", "Waffle makers", "Toaster ovens", "Bread makers",
  "Ice makers", "Electric kettles", "Milk frothers", "Juicers", "Blenders", "Food processors",
  "Dutch ovens", "Cast iron", "Nonstick pans", "Pizza stones", "Bento boxes", "Travel mugs",
  "Water filters", "Garlic presses", "Mandolines", "Salad spinners", "Egg slicers", "Apple corers",
  "Avocado slicers", "Citrus juicers", "Pepper mills", "Tea infusers", "French presses", "Soda makers",
  "Pasta makers", "Yogurt makers", "Popcorn makers", "Crepe pans", "Fondue pots", "Crepe makers",
  "Chocolate fountains", "Snow cones", "Robot mops", "Stick vacuums", "Carpet cleaners", "Steam mops",
  "Air purifiers", "Humidifiers", "Dehumidifiers", "Space heaters", "Ceiling fans", "Standing fans",
  "Sewing machines", "Toolboxes", "Ladders", "Step stools", "Storage bins", "Shoe racks",
  "Coat hooks", "Laundry hampers", "Drying racks", "Smart bulbs", "Weighted blankets", "Silk sheets",
  "Flannel sheets", "Mattress toppers", "Bunk beds", "Murphy beds", "Daybeds", "Blackout curtains",
  "Roman shades", "Neon signs", "Gallery walls", "Bookshelves", "Floating shelves", "China cabinets",
  "Display cases", "Vanity tables", "Standing mirrors", "Room dividers", "Folding screens", "Shag carpets",
  "Beanbag chairs", "Papasan chairs", "Recliners", "Sectional sofas", "Loveseats", "Accent chairs",
  "Ottomans", "Poufs", "Floor cushions", "Canopy beds", "Loft beds", "Trundle beds",
  "Sofa beds", "Air mattresses", "Water beds", "Reading lamps", "Bedside tables", "Jewelry boxes",
  "Makeup mirrors", "Closet organizers", "Shoe organizers", "Velvet hangers", "Laundry chutes", "Vanity lights",
  "Rocking chairs", "Bar stools", "Kitchen carts", "Entry benches", "Hammock chairs", "Hanging chairs",
  "Room rugs", "Door mats", "Floor lamps", "Desk chairs", "Gaming chairs", "Massage chairs",
  "Folding tables", "Dining benches", "Bar carts", "Patio chairs", "Wireless earbuds", "Bluetooth speakers",
  "Gaming consoles", "Mechanical keyboards", "Curved monitors", "Smart displays", "Action cameras", "Dash cameras",
  "Instant cameras", "Ring lights", "Projectors", "Portable chargers", "Solar chargers", "Smart thermostats",
  "Doorbell cameras", "Security cameras", "Digital frames", "Vinyl players", "Phone cases", "Laptop sleeves",
  "Tablet stands", "Pop sockets", "Screen protectors", "Charging docks", "Cable clips", "Key finders",
  "Smart rings", "Fitness bands", "Wallet chains", "Card holders", "Crossbody bags", "Tote bags",
  "Backpacks", "Messenger bags", "Coin purses", "Travel wallets", "Compact mirrors", "Pocket watches",
  "Noise cancelling", "Denim jackets", "Leather jackets", "Puffer coats", "Raincoats", "Trench coats",
  "Overalls", "Jumpsuits", "Cardigans", "Graphic tees", "Hoodies", "Cargo pants",
  "Wide-leg jeans", "Platform shoes", "Running shoes", "Cowboy boots", "Clogs", "Loafers",
  "Bucket hats", "Sheet masks", "Face rollers", "Lip balms", "Lip gloss", "Nail polish",
  "Press-on nails", "Hair clips", "Scrunchies", "Dry shampoo", "Hair masks", "Bath bombs",
  "Body scrubs", "Perfume", "Cologne", "Essential oils", "Electric toothbrushes", "Water flossers",
  "Heated brushes", "Fuzzy slippers", "Silk pajamas", "Trading cards", "Fidget toys", "Dolls",
  "Kites", "Yo-yos", "Rubik cubes", "Marble runs", "Model trains", "Remote cars",
  "RC planes", "Drones", "Play kitchens", "Tree swings", "Slip slides", "Trampolines",
  "Bouncy castles", "Foam swords", "Model kits", "Toy trains", "Wooden toys", "Cat trees",
  "Dog beds", "Pet cameras", "Treat puzzles", "Terrariums", "Bird feeders", "Bird baths",
  "Hamster wheels", "Reptile tanks", "Pet strollers", "Automatic feeders", "Water fountains", "Scratching posts",
  "Chew toys", "Tennis balls", "Pet carriers", "Camping chairs", "Picnic baskets", "Coolers",
  "Lanterns", "Fire pits", "Grills", "Smokers", "Patio heaters", "Garden gnomes",
  "Wind chimes", "Bird houses", "Raised beds", "Greenhouses", "Lawn games", "Cornhole",
  "Bocce balls", "Kayaks", "Paddleboards", "Pickleball paddles", "Tennis rackets", "Golf clubs",
  "Bowling balls", "Skateboards", "Roller skates", "Inline skates", "Snowboards", "Ski goggles",
  "Hockey sticks", "Soccer balls", "Basketball hoops", "Volleyball nets", "Boxing gloves", "Yoga blocks",
  "Resistance bands", "Kettlebells", "Foam rollers", "Punching bags", "Sports jerseys", "Dumplings",
  "Ramen", "Pho", "Gnocchi", "Pierogies", "Empanadas", "Arepas",
  "Tamales", "Shawarma", "Falafel", "Poke bowls", "Bibimbap", "Kimchi",
  "Gochujang", "Chili crisp", "Truffle oil", "Pistachio cream", "Ube desserts", "Cronuts",
  "Mochi", "Cheesecake", "Tiramisu", "Churros", "Cannoli", "Macarons",
  "Eclairs", "Brownies", "Blondies", "Fudge", "Gelato", "Sorbet",
  "Frozen custard", "Banana splits", "Pavlova", "Baklava", "Apple pie", "Bread pudding",
  "Cinnamon rolls", "Sticky buns", "Cold brew", "Nitro coffee", "Chai latte", "Dirty chai",
  "Lemonade", "Root beer", "Ginger beer", "Kombucha", "Kefir", "Coconut water",
  "Horchata", "Slushies", "Milk tea", "Matcha lattes", "Fruit smoothies", "Protein shakes",
  "Spiced cider", "Pour-over coffee", "Candy makers", "Popcorn machines", "Slush machines", "Insulated bottles",
  "Lunch boxes", "Reusable straws", "Pottery classes", "Cooking classes", "Dance lessons", "Language classes",
  "Chess clubs", "Knitting circles", "Game nights", "Trivia nights", "Paint nights", "Scavenger hunts",
  "Geocaching", "Birdwatching", "Thrift shopping", "People watching", "Urban exploring", "Volunteering",
  "Rooftop pools", "Lazy rivers", "Planetariums", "Observatories", "Petting zoos", "Bowling alleys",
  "Roller rinks", "Drive-in theaters", "Record stores", "Used bookstores", "Food halls", "Boardwalks",
  "Night markets", "Silent discos", "Open mics", "Drag shows", "Renaissance fairs", "Desk treadmills",
  "Ergonomic chairs", "Desk lamps", "Laptop stands", "Cable organizers", "Whiteboards", "Bulletin boards",
  "Water coolers", "Snack drawers", "Office plants", "Cubicle walls", "Hot desks", "Nap pods",
  "Walking meetings", "Stroller fans", "Baby monitors", "Diaper bags", "Changing tables", "High chairs",
  "Baby carriers", "Sippy cups", "Teething rings", "Play mats", "Baby gates", "Sound machines",
  "Night lights", "Bottle warmers", "Wipe warmers", "Baby swings", "Bibs", "Soft blocks",
  "Story books", "Backup cameras", "Parking sensors", "Remote starts", "Manual transmissions", "Hybrid cars",
  "Vinyl sleeves", "Concert tees", "Poster frames", "Shoe trees", "Umbrella stands", "Key bowls",
  "Mail sorters", "Lunch totes", "Tea towels", "Oven mitts", "Pot holders", "Cooling racks",
  "Cookie sheets", "Pie dishes", "Cake stands", "Butter dishes", "Serving trays", "Salad bowls",
  "Soup spoons", "Steak knives", "Cheese knives", "Water glasses", "Wine glasses", "Champagne flutes",
  "Mason jars", "Spice racks", "Knife blocks", "Cutting boards", "Rolling pins", "Pasta bowls",
  "Wok pans", "Stock pots", "Griddle pans", "Silicone spatulas", "Wooden spoons", "Dish brushes",
  "Bottle brushes", "Sink caddies", "Compost bins", "Pantry jars", "Bread boxes", "Fruit bowls",
  "Napkin rings", "Table runners", "Place mats", "Cereal bowls", "Mug trees", "Coffee scales",
  "Ice trays", "Lunch thermoses", "Picnic blankets", "Beach umbrellas", "Beach tents", "Pool noodles",
  "Swim goggles", "Snorkel sets", "Water shoes", "Life jackets", "Dry bags", "Hiking poles",
  "Trail shoes", "Fleece jackets", "Rain ponchos", "Beanie hats", "Neck gaiters", "Wool socks",
  "Thermal underwear", "Ski lifts", "Snow tubes", "Sled dogs", "Garden hoses", "Lawn sprinklers",
  "Leaf blowers", "Snow blowers", "Pressure washers", "Power drills", "Tool belts", "Paint rollers",
  "Stud finders", "Step ladders", "Work gloves", "Safety glasses", "Bike helmets", "Bike bells",
  "Bike baskets", "Bike locks", "Scooter helmets", "Skate parks", "Dog leashes", "Cat collars",
  "Pet bowls", "Litter boxes", "Catnip toys", "Dog crates", "Bird cages", "Fish bowls",
  "Aquarium lights", "Terrarium moss", "Plant pots", "Hanging planters", "Garden trowels", "Pruning shears",
  "Hedge trimmers", "Lawn chairs", "Patio swings", "Porch lights", "Door knockers", "Welcome mats",
  "Coat trees", "Shoe benches", "Storage ottomans", "Blanket ladders", "Bookends", "Magazine racks",
  "Record crates", "Jewelry trays", "Watch boxes", "Makeup bags", "Travel cases", "Toiletry kits",
  "Shower caddies", "Bath mats", "Towel warmers", "Heated mirrors", "Bidet seats", "Handheld showers",
  "Rain showers", "Soap dishes", "Lotion pumps", "Cotton rounds", "Bath salts", "Shower steamers",
  "Sleep masks", "Earplugs", "White noise", "Alarm clocks", "Sunrise clocks", "Bed canopies",
  "Reading pillows", "Knee pillows", "Cooling pads", "Mattress protectors", "Electric throws",
];

const TOPICS = [...BASE_TOPICS, ...EXTRA_TOPICS];
const rooms = new Map<string, Room>();
const code = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const clone = (room: Room) => JSON.parse(JSON.stringify(room)) as Room;
const randomTopic = (except?: string) => {
  const choices = except ? TOPICS.filter((topic) => topic !== except) : TOPICS;
  return choices[Math.floor(Math.random() * choices.length)];
};
const newTopicRound = (): Round => ({ topic: randomTopic(), skipUsed: false, submissions: [] });

export function createRoom(name: string, playerId: string, mode: Mode) {
  if (!name) throw new Error("Add your name.");
  let roomCode = code(); while (rooms.has(roomCode)) roomCode = code();
  const room: Room = { code: roomCode, hostId: playerId, mode, players: [{ id: playerId, name, cards: 0, cardTopics: [] }], status: "lobby", chooserIndex: 0, round: newTopicRound(), updatedAt: Date.now() };
  rooms.set(roomCode, room); return clone(room);
}
export function getRoom(roomCode: string) { const room = rooms.get(roomCode); if (!room) throw new Error("That room no longer exists."); return clone(room); }
export function publicRoom(room: Room) {
  const view = clone(room);
  if (view.status === "guessing" && view.round) {
    delete view.round.chooserRating;
    view.round.submissions.forEach((submission) => { delete (submission as Partial<Submission>).rating; });
  }
  if (view.status === "tieGuessing" && view.round?.tieBreak) {
    delete view.round.tieBreak.chooserRating;
    view.round.tieBreak.submissions.forEach((submission) => { delete (submission as Partial<Submission>).rating; });
  }
  return view;
}
export function changeRoom(roomCode: string, playerId: string, action: string, payload: { name?: string; rating?: number; topic?: string }) {
  const room = rooms.get(roomCode); if (!room) throw new Error("That room no longer exists.");
  const player = room.players.find((p) => p.id === playerId);
  if (action === "join") { if (player) return clone(room); if (!payload.name) throw new Error("Enter a name."); if (room.status !== "lobby") throw new Error("This game has already started."); if (room.players.length >= 4) throw new Error("This room is full — four opinion-havers max."); room.players.push({ id: playerId, name: payload.name.slice(0, 18), cards: 0, cardTopics: [] }); room.updatedAt = Date.now(); return clone(room); }
  if (!player) throw new Error("You are not in this room.");
  const chooser = room.players[room.chooserIndex];
  if (action === "start") { if (playerId !== room.hostId) throw new Error("Only the host can start."); if (room.players.length < 2) throw new Error("You need at least two players."); room.status = "topic"; }
  else if (action === "topic") { if (room.status !== "topic" || chooser.id !== playerId) throw new Error("It is not your turn to choose a topic."); room.status = "rating"; }
  else if (action === "skip") { if (room.status !== "topic" || chooser.id !== playerId) throw new Error("It is not your turn to skip."); if (room.round!.skipUsed) throw new Error("You have already used your skip this round."); room.round!.topic = randomTopic(room.round!.topic); room.round!.skipUsed = true; }
  else if (action === "rate") { if (room.status !== "rating" || chooser.id !== playerId) throw new Error("It is not your turn to rate."); room.round!.chooserRating = checkedRating(payload.rating); room.status = "guessing"; }
  else if (action === "guess") { if (room.status !== "guessing" || chooser.id === playerId) throw new Error("You cannot submit a guess now."); if (room.round!.submissions.some((s) => s.playerId === playerId)) throw new Error("Your guess is already locked."); room.round!.submissions.push({ playerId, rating: checkedRating(payload.rating) }); if (room.round!.submissions.length === room.players.length - 1) reveal(room); }
  else if (action === "tiebreak") { if (room.status === "tieTopic" && room.round?.tieBreak) return clone(room); if (room.status !== "reveal" || !room.round?.result || room.round.result.winners.length < 2) throw new Error("There is no tie to break."); room.round.tieBreak = { contenders: room.round.result.winners.map((winner) => winner.id), topic: randomTopic(), skipUsed: false, submissions: [] }; room.status = "tieTopic"; }
  else if (action === "tiebreakTopic") { if (room.status !== "tieTopic" || chooser.id !== playerId) throw new Error("It is not your turn to choose a tie-break topic."); room.status = "tieRating"; }
  else if (action === "tiebreakSkip") { if (room.status !== "tieTopic" || chooser.id !== playerId) throw new Error("It is not your turn to skip."); if (room.round!.tieBreak!.skipUsed) throw new Error("You have already used your skip in this tie-break."); room.round!.tieBreak!.topic = randomTopic(room.round!.tieBreak!.topic); room.round!.tieBreak!.skipUsed = true; }
  else if (action === "tiebreakRate") { if (room.status !== "tieRating" || chooser.id !== playerId) throw new Error("It is not your turn to rate."); room.round!.tieBreak!.chooserRating = checkedRating(payload.rating); room.status = "tieGuessing"; }
  else if (action === "tiebreakGuess") { const tieBreak = room.round!.tieBreak; if (room.status !== "tieGuessing" || chooser.id === playerId || !tieBreak!.contenders.includes(playerId)) throw new Error("You are not in this tie-break."); if (tieBreak!.submissions.some((submission) => submission.playerId === playerId)) throw new Error("Your guess is already locked."); tieBreak!.submissions.push({ playerId, rating: checkedRating(payload.rating) }); if (tieBreak!.submissions.length === tieBreak!.contenders.length) revealTieBreak(room); }
  else if (action === "next") { if (room.status !== "reveal" && room.status !== "tie") throw new Error("Reveal this round first."); newRound(room); }
  else if (action === "restart") { if (room.status !== "finished") throw new Error("The game is still going."); room.players.forEach((p) => { p.cards = 0; p.cardTopics = []; }); room.chooserIndex = 0; room.winner = undefined; room.status = "topic"; room.round = newTopicRound(); }
  else throw new Error("Unknown game action.");
  room.updatedAt = Date.now(); return clone(room);
}
function checkedRating(rating?: number) { if (!Number.isInteger(rating) || rating! < -5 || rating! > 5) throw new Error("Choose a whole-number rating from −5 to +5."); return rating!; }
function reveal(room: Room) { const answer = room.round!.chooserRating!; const distances = room.round!.submissions.map((s) => ({ ...s, distance: Math.abs(s.rating - answer) })); const closest = Math.min(...distances.map((s) => s.distance)); const winners = distances.filter((s) => s.distance === closest).map((s) => room.players.find((p) => p.id === s.playerId)!).map((p) => ({ ...p })); room.round!.result = { winners }; room.status = "reveal"; if (winners.length === 1) { const winner = room.players.find((p) => p.id === winners[0].id)!; winner.cards++; winner.cardTopics.push(room.round!.topic); room.round!.result!.winners = [{ ...winner }]; if (room.mode === "competitive" && winner.cards >= 10) { room.winner = winner; room.status = "finished"; } } }
function revealTieBreak(room: Room) { const tieBreak = room.round!.tieBreak!; const distances = tieBreak.submissions.map((submission) => ({ ...submission, distance: Math.abs(submission.rating - tieBreak.chooserRating!) })); const closest = Math.min(...distances.map((submission) => submission.distance)); const winners = distances.filter((submission) => submission.distance === closest).map((submission) => room.players.find((player) => player.id === submission.playerId)!); if (winners.length > 1) { room.round!.tieBreak = { contenders: winners.map((winner) => winner.id), topic: randomTopic(), skipUsed: false, submissions: [] }; room.status = "tieTopic"; return; } const winner = winners[0]; winner.cards++; winner.cardTopics.push(tieBreak.topic); room.round!.result!.winners = [{ ...winner }]; room.status = room.mode === "competitive" && winner.cards >= 10 ? "finished" : "tie"; if (room.status === "finished") room.winner = { ...winner }; }
function newRound(room: Room) { room.chooserIndex = (room.chooserIndex + 1) % room.players.length; room.round = newTopicRound(); room.status = "topic"; }
