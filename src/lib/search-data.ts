// Extended mock data for the rich Search & Book experience.
// Kept in a dedicated file so mock-data.ts stays focused on core entities.

export interface AirlineBrand {
  code: string;        // IATA-ish prefix used in flight code (e.g. "6E")
  name: string;
  bg: string;          // tailwind bg class
  fg: string;          // tailwind text class
  short: string;       // 2-letter label for badge
}

export const airlineBrands: Record<string, AirlineBrand> = {
  "6E":   { code: "6E",   name: "IndiGo",     bg: "bg-[#0a2472]", fg: "text-white", short: "6E" },
  "UK":   { code: "UK",   name: "Vistara",    bg: "bg-[#4b286d]", fg: "text-white", short: "UK" },
  "AI":   { code: "AI",   name: "Air India",  bg: "bg-[#c8102e]", fg: "text-white", short: "AI" },
  "SG":   { code: "SG",   name: "SpiceJet",   bg: "bg-[#e30613]", fg: "text-white", short: "SG" },
  "QP":   { code: "QP",   name: "Akasa Air",  bg: "bg-[#ff6a13]", fg: "text-white", short: "QP" },
  "EK":   { code: "EK",   name: "Emirates",   bg: "bg-[#d71921]", fg: "text-white", short: "EK" },
  "SQ":   { code: "SQ",   name: "Singapore",  bg: "bg-[#1a4684]", fg: "text-white", short: "SQ" },
};

export const airlineFromCode = (flightCode: string): AirlineBrand =>
  airlineBrands[flightCode.split("-")[0]] ?? { code: "XX", name: "Carrier", bg: "bg-primary", fg: "text-primary-foreground", short: "XX" };

export interface FareOption {
  id: string;
  name: string;            // "Saver" | "Flexi" | "Business"
  baggage: string;         // "15 kg"
  cabin: string;           // "7 kg"
  meal: string;            // "Paid" | "Included"
  refundable: boolean;
  changeable: boolean;
  seatSelect: "Free" | "Paid" | "Restricted";
  priceDelta: number;      // delta over base net
}

export const fareCatalog: FareOption[] = [
  { id: "saver",  name: "Saver",       baggage: "15 kg", cabin: "7 kg", meal: "Paid",     refundable: false, changeable: false, seatSelect: "Paid",       priceDelta: 0 },
  { id: "flexi",  name: "Flexi",       baggage: "20 kg", cabin: "7 kg", meal: "Included", refundable: true,  changeable: true,  seatSelect: "Free",       priceDelta: 950 },
  { id: "biz",    name: "Business",    baggage: "35 kg", cabin: "10 kg",meal: "Included", refundable: true,  changeable: true,  seatSelect: "Free",       priceDelta: 8400 },
];

export interface AirportInfo { code: string; city: string; name: string; }
export const airports: AirportInfo[] = [
  { code: "DEL", city: "Delhi",      name: "Indira Gandhi Intl" },
  { code: "BOM", city: "Mumbai",     name: "Chhatrapati Shivaji" },
  { code: "BLR", city: "Bengaluru",  name: "Kempegowda Intl" },
  { code: "HYD", city: "Hyderabad",  name: "Rajiv Gandhi Intl" },
  { code: "CCU", city: "Kolkata",    name: "Netaji Subhas Chandra Bose" },
  { code: "MAA", city: "Chennai",    name: "Chennai Intl" },
  { code: "GOI", city: "Goa",        name: "Dabolim" },
  { code: "AMD", city: "Ahmedabad",  name: "Sardar Vallabhbhai Patel" },
  { code: "DXB", city: "Dubai",      name: "Dubai Intl" },
  { code: "SIN", city: "Singapore",  name: "Changi" },
];

export const airportByCode = (c: string) => airports.find(a => a.code === c) ?? { code: c, city: c, name: c };

/* -------- Hotels with imagery and rooms -------- */

export interface HotelRoom {
  id: string;
  name: string;
  bed: string;
  occupancy: string;
  inclusions: string[];
  cancellation: string;
  netPrice: number;     // per night
}

export interface RichHotel {
  id: string;
  name: string;
  city: string;
  area: string;
  stars: number;
  rating: number;
  reviews: number;
  amenities: string[];
  highlights: string[];
  images: string[];     // remote URLs
  rooms: HotelRoom[];
  policies: string[];
  about: string;
}

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const richHotels: RichHotel[] = [
  {
    id: "H1",
    name: "The Riviera Beach Resort",
    city: "Goa", area: "Candolim",
    stars: 5, rating: 4.6, reviews: 1284,
    amenities: ["Pool", "Breakfast", "WiFi", "Spa", "Beach Access", "Bar", "Gym", "Airport Shuttle"],
    highlights: ["100m to Candolim Beach", "Infinity pool with sea view", "Award-winning Asian spa"],
    images: [
      u("photo-1566073771259-6a8506099945"),
      u("photo-1582719508461-905c673771fd"),
      u("photo-1571003123894-1f0594d2b5d9"),
      u("photo-1611892440504-42a792e24d32"),
    ],
    rooms: [
      { id: "r1", name: "Deluxe Garden View",  bed: "1 King",  occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi"], cancellation: "Free until 24h before", netPrice: 6800 },
      { id: "r2", name: "Premium Sea View",    bed: "1 King",  occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi", "Airport Pickup"], cancellation: "Free until 24h before", netPrice: 8400 },
      { id: "r3", name: "Family Suite",        bed: "1 King + 2 Twin", occupancy: "2 Adults + 2 Children", inclusions: ["All Meals", "WiFi", "Spa Credit"], cancellation: "Non-refundable", netPrice: 12600 },
    ],
    policies: ["Check-in 14:00", "Check-out 11:00", "Valid government ID required", "No pets allowed"],
    about: "Beachfront resort with sweeping Arabian Sea views, three pools, and an award-winning Asian spa. Walking distance to Candolim's restaurants and shopping.",
  },
  {
    id: "H2",
    name: "Coral Stay Suites",
    city: "Goa", area: "Calangute",
    stars: 4, rating: 4.3, reviews: 842,
    amenities: ["Pool", "WiFi", "Breakfast", "Restaurant", "Parking"],
    highlights: ["5 min walk to Calangute Beach", "Rooftop pool & bar", "Pet friendly"],
    images: [
      u("photo-1542314831-068cd1dbfeeb"),
      u("photo-1551882547-ff40c63fe5fa"),
      u("photo-1540541338287-41700207dee6"),
    ],
    rooms: [
      { id: "r1", name: "Premium Room",     bed: "1 Queen", occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi"], cancellation: "Free until 48h before", netPrice: 4200 },
      { id: "r2", name: "Deluxe Pool View", bed: "1 King",  occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi"], cancellation: "Free until 48h before", netPrice: 5400 },
    ],
    policies: ["Check-in 13:00", "Check-out 11:00", "Pets allowed (extra fee)"],
    about: "Boutique 4-star property a short walk from Calangute Beach. Rooftop pool, bar and contemporary rooms.",
  },
  {
    id: "H3",
    name: "Heritage Palace Inn",
    city: "Goa", area: "Panjim",
    stars: 4, rating: 4.1, reviews: 612,
    amenities: ["WiFi", "Breakfast", "Parking", "Restaurant", "Cultural Tours"],
    highlights: ["Restored Portuguese heritage building", "Walking tours included", "Old Town Panjim"],
    images: [
      u("photo-1564501049412-61c2a3083791"),
      u("photo-1520250497591-112f2f40a3f4"),
      u("photo-1455587734955-081b22074882"),
    ],
    rooms: [
      { id: "r1", name: "Heritage Suite", bed: "1 King",  occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi", "Heritage Tour"], cancellation: "Free until 72h before", netPrice: 3800 },
      { id: "r2", name: "Colonial Twin",  bed: "2 Twin",  occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi"], cancellation: "Free until 72h before", netPrice: 3200 },
    ],
    policies: ["Check-in 14:00", "Check-out 12:00", "Heritage walking tour daily 10:00"],
    about: "Restored 18th-century Portuguese mansion in the heart of Panjim's Latin Quarter. Curated by local historians.",
  },
  {
    id: "H4",
    name: "Sunset Sands Boutique",
    city: "Goa", area: "Anjuna",
    stars: 3, rating: 4.0, reviews: 421,
    amenities: ["WiFi", "Breakfast", "Bar", "Yoga"],
    highlights: ["Sunset views from rooftop", "Daily yoga", "Anjuna flea market"],
    images: [
      u("photo-1445019980597-93fa8acb246c"),
      u("photo-1578683010236-d716f9a3f461"),
    ],
    rooms: [
      { id: "r1", name: "Standard Room", bed: "1 Queen", occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi"], cancellation: "Non-refundable", netPrice: 2600 },
      { id: "r2", name: "Sunset Deluxe", bed: "1 King",  occupancy: "2 Adults", inclusions: ["Breakfast", "WiFi", "Yoga"], cancellation: "Free until 24h before", netPrice: 3400 },
    ],
    policies: ["Check-in 13:00", "Check-out 11:00", "Adults only"],
    about: "Laid-back boutique stay above Anjuna cliffs. Famous for its rooftop sundowners and weekend live music.",
  },
  {
    id: "H5",
    name: "Azure Cliff Retreat",
    city: "Goa", area: "Vagator",
    stars: 5, rating: 4.8, reviews: 1972,
    amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Beach Club", "Gym", "Yoga", "Bar"],
    highlights: ["Cliffside infinity pool", "Private beach club access", "Signature spa rituals"],
    images: [
      u("photo-1571896349842-33c89424de2d"),
      u("photo-1582719478250-c89cae4dc85b"),
      u("photo-1568084680786-a84f91d1153c"),
      u("photo-1559599189-fe84dea4eb79"),
    ],
    rooms: [
      { id: "r1", name: "Cliff View Villa",     bed: "1 King",        occupancy: "2 Adults", inclusions: ["Breakfast", "Spa Credit", "WiFi"], cancellation: "Free until 24h before", netPrice: 9400 },
      { id: "r2", name: "Two-Bedroom Pool Villa", bed: "2 King",      occupancy: "4 Adults", inclusions: ["All Meals", "Spa Credit", "Private Pool"], cancellation: "Free until 48h before", netPrice: 18600 },
    ],
    policies: ["Check-in 15:00", "Check-out 12:00", "Resort fee included", "Children above 12 only in villas"],
    about: "Iconic clifftop retreat overlooking the Arabian Sea. A favourite of celebrities for its private villas and farm-to-table dining.",
  },
];

/* -------- Holiday packages -------- */

export interface Package {
  id: string;
  title: string;
  destination: string;
  nights: number;
  days: number;
  cover: string;
  inclusions: string[];
  highlights: string[];
  itinerary: { day: number; title: string; detail: string }[];
  startsFromNet: number;     // per person twin sharing
  hotelCategory: string;     // "4-star" / "5-star"
  flightIncluded: boolean;
  rating: number;
}

export const packages: Package[] = [
  {
    id: "PKG-GOA-04",
    title: "Goa Beach Bliss",
    destination: "Goa, India",
    nights: 4, days: 5,
    cover: u("photo-1512343879784-a960bf40e7f2", 1200),
    inclusions: ["4N hotel (4-star)", "Daily breakfast", "Round-trip flights", "Airport transfers", "Half-day sightseeing"],
    highlights: ["North Goa beaches", "Spice plantation lunch", "Sunset river cruise"],
    itinerary: [
      { day: 1, title: "Arrival & Check-in",   detail: "Pickup from Dabolim, leisure evening at Candolim beach." },
      { day: 2, title: "North Goa tour",       detail: "Fort Aguada, Anjuna and Vagator beach hopping." },
      { day: 3, title: "Spice plantation",     detail: "Traditional plantation lunch and elephant interaction." },
      { day: 4, title: "Sunset cruise",        detail: "Free morning, evening Mandovi river cruise with cultural show." },
      { day: 5, title: "Departure",            detail: "Drop to Dabolim airport." },
    ],
    startsFromNet: 18900, hotelCategory: "4-star", flightIncluded: true, rating: 4.5,
  },
  {
    id: "PKG-DXB-05",
    title: "Dubai City Showcase",
    destination: "Dubai, UAE",
    nights: 5, days: 6,
    cover: u("photo-1512453979798-5ea266f8880c", 1200),
    inclusions: ["5N hotel (5-star)", "Daily breakfast", "Round-trip flights", "Burj Khalifa tickets", "Desert safari"],
    highlights: ["At The Top Burj Khalifa", "Dhow cruise dinner", "Desert BBQ safari"],
    itinerary: [
      { day: 1, title: "Arrival",             detail: "Airport transfer, hotel check-in, leisure." },
      { day: 2, title: "City tour",           detail: "Burj Al Arab, Palm Jumeirah, Dubai Mall." },
      { day: 3, title: "Desert safari",       detail: "Dune bashing, camel ride, BBQ dinner with shows." },
      { day: 4, title: "Burj Khalifa",        detail: "At The Top observation deck, Dubai Fountain show." },
      { day: 5, title: "Dhow cruise",         detail: "Free day, evening dhow dinner cruise." },
      { day: 6, title: "Departure",           detail: "Airport drop." },
    ],
    startsFromNet: 64500, hotelCategory: "5-star", flightIncluded: true, rating: 4.7,
  },
  {
    id: "PKG-RAJ-06",
    title: "Royal Rajasthan",
    destination: "Jaipur · Udaipur · Jodhpur",
    nights: 6, days: 7,
    cover: u("photo-1599661046289-e31897846e41", 1200),
    inclusions: ["6N heritage hotels", "All breakfasts + 3 dinners", "AC car with driver", "Monument entries", "English-speaking guide"],
    highlights: ["Amber Fort elephant ride", "Lake Pichola boat", "Mehrangarh Fort sunset"],
    itinerary: [
      { day: 1, title: "Jaipur arrival",       detail: "City Palace, Hawa Mahal evening." },
      { day: 2, title: "Amber Fort",           detail: "Jal Mahal photo stop, Jantar Mantar." },
      { day: 3, title: "Jaipur to Udaipur",    detail: "Via Chittorgarh fort." },
      { day: 4, title: "Udaipur city",         detail: "City Palace, Sahelion Ki Bari, Lake Pichola cruise." },
      { day: 5, title: "Udaipur to Jodhpur",   detail: "Ranakpur Jain temple en-route." },
      { day: 6, title: "Jodhpur",              detail: "Mehrangarh Fort, Blue City walk." },
      { day: 7, title: "Departure",            detail: "Drop to Jodhpur airport." },
    ],
    startsFromNet: 42500, hotelCategory: "Heritage 4-star", flightIncluded: false, rating: 4.6,
  },
  {
    id: "PKG-KER-05",
    title: "Kerala Backwaters & Beaches",
    destination: "Munnar · Alleppey · Kovalam",
    nights: 5, days: 6,
    cover: u("photo-1602216056096-3b40cc0c9944", 1200),
    inclusions: ["5N hotels", "Daily breakfast", "Houseboat cruise", "AC car with driver", "Sightseeing"],
    highlights: ["Munnar tea estates", "Overnight houseboat", "Kovalam beach"],
    itinerary: [
      { day: 1, title: "Cochin to Munnar",     detail: "Drive through spice country, evening leisure." },
      { day: 2, title: "Munnar",               detail: "Tea museum, Mattupetty dam, Echo point." },
      { day: 3, title: "Munnar to Alleppey",   detail: "Check into deluxe houseboat, backwater cruise." },
      { day: 4, title: "Alleppey to Kovalam",  detail: "Beach drive, evening at Kovalam." },
      { day: 5, title: "Kovalam",              detail: "Leisure beach day, optional Ayurveda spa." },
      { day: 6, title: "Departure",            detail: "Drop to Trivandrum airport." },
    ],
    startsFromNet: 32800, hotelCategory: "4-star + houseboat", flightIncluded: false, rating: 4.5,
  },
  {
    id: "PKG-SIN-06",
    title: "Singapore Family Escape",
    destination: "Singapore",
    nights: 5, days: 6,
    cover: u("photo-1565967511849-76a60a516170", 1200),
    inclusions: ["5N hotel", "Round-trip flights", "Universal Studios", "Sentosa Island", "City tour"],
    highlights: ["Universal Studios full day", "Gardens by the Bay", "Night Safari"],
    itinerary: [
      { day: 1, title: "Arrival",             detail: "Airport transfer, hotel check-in, Marina Bay walk." },
      { day: 2, title: "City tour",           detail: "Merlion, Chinatown, Little India, Orchard Road." },
      { day: 3, title: "Universal Studios",   detail: "Full day at Universal Studios Singapore." },
      { day: 4, title: "Sentosa Island",      detail: "Cable car, S.E.A. Aquarium, Wings of Time." },
      { day: 5, title: "Gardens & Safari",    detail: "Gardens by the Bay, evening Night Safari." },
      { day: 6, title: "Departure",           detail: "Airport drop." },
    ],
    startsFromNet: 78400, hotelCategory: "4-star", flightIncluded: true, rating: 4.8,
  },
];

/* -------- Seat map -------- */

export type SeatStatus = "available" | "occupied" | "premium" | "exit" | "blocked";

export interface Seat {
  id: string;     // e.g. "12A"
  row: number;
  col: string;
  status: SeatStatus;
  price: number; // additional cost for the seat (0 if free)
}

// Generate a deterministic-but-varied seat map for a flight id.
export function generateSeatMap(flightId: string): Seat[] {
  const seed = flightId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const rng = (i: number) => {
    const x = Math.sin(seed * 9301 + i * 49297) * 233280;
    return x - Math.floor(x);
  };
  const cols = ["A", "B", "C", "D", "E", "F"];
  const rows = 30;
  const seats: Seat[] = [];
  let n = 0;
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      n++;
      let status: SeatStatus = "available";
      let price = 0;
      if (r <= 3)            { status = "premium"; price = 850; }
      else if (r === 12 || r === 13) { status = "exit";    price = 450; }
      else if (rng(n) < 0.32){ status = "occupied"; }
      else if (rng(n) < 0.45){ price = 150; }
      seats.push({ id: `${r}${c}`, row: r, col: c, status, price });
    }
  }
  return seats;
}

export const meals = [
  { id: "veg",      label: "Veg meal",              price: 350 },
  { id: "nonveg",   label: "Non-veg meal",          price: 450 },
  { id: "jain",     label: "Jain meal",             price: 350 },
  { id: "child",    label: "Child meal",            price: 300 },
];

export const baggageAddons = [
  { id: "b5",  label: "+5 kg check-in baggage",  price: 750 },
  { id: "b10", label: "+10 kg check-in baggage", price: 1400 },
  { id: "b15", label: "+15 kg check-in baggage", price: 1950 },
];
