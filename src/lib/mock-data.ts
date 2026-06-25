export const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export interface Agent {
  id: string;
  name: string;
  type: "Master" | "Agent" | "Sub-Agent";
  status: "Active" | "Pending KYC" | "Suspended";
  creditLimit: number;
  walletBalance: number;
  joined: string;
  gst: string;
  pan: string;
  email: string;
  phone: string;
  city: string;
  parent?: string;
}

export const agents: Agent[] = [
  { id: "AGT001", name: "Demo Co. Travels", type: "Agent", status: "Active", creditLimit: 500000, walletBalance: 234500, joined: "2024-03-12", gst: "27AABCD1234E1Z5", pan: "AABCD1234E", email: "ops@democotravels.in", phone: "+91 98765 43210", city: "Mumbai" },
  { id: "AGT002", name: "Skyline Holidays Pvt Ltd", type: "Master", status: "Active", creditLimit: 2500000, walletBalance: 1820400, joined: "2023-11-04", gst: "07AAACS9988L1ZQ", pan: "AAACS9988L", email: "accounts@skylineholidays.com", phone: "+91 99100 22334", city: "Delhi" },
  { id: "AGT003", name: "BlueWave Tours", type: "Agent", status: "Pending KYC", creditLimit: 0, walletBalance: 0, joined: "2026-06-18", gst: "29AAGCB5566F1Z2", pan: "AAGCB5566F", email: "owner@bluewavetours.in", phone: "+91 98800 11223", city: "Bengaluru" },
  { id: "AGT004", name: "Heritage Trails LLP", type: "Agent", status: "Active", creditLimit: 300000, walletBalance: 87320, joined: "2025-01-22", gst: "36AABFH7788G1Z9", pan: "AABFH7788G", email: "hello@heritagetrails.in", phone: "+91 96660 88991", city: "Hyderabad" },
  { id: "AGT005", name: "Coastal Carriers", type: "Sub-Agent", status: "Active", creditLimit: 100000, walletBalance: 42100, joined: "2025-09-05", gst: "19AACCC4321P1Z8", pan: "AACCC4321P", email: "desk@coastalcarriers.in", phone: "+91 91100 56789", city: "Kolkata", parent: "AGT002" },
  { id: "AGT006", name: "Nimbus Voyages", type: "Agent", status: "Suspended", creditLimit: 200000, walletBalance: 12000, joined: "2024-08-19", gst: "33AAFCN3344R1ZE", pan: "AAFCN3344R", email: "team@nimbusvoyages.in", phone: "+91 94440 11122", city: "Chennai" },
  { id: "AGT007", name: "Mountainpeak Trips", type: "Sub-Agent", status: "Active", creditLimit: 75000, walletBalance: 28900, joined: "2026-02-14", gst: "06AAJCM2233K1Z1", pan: "AAJCM2233K", email: "info@mountainpeak.in", phone: "+91 93330 44556", city: "Gurugram", parent: "AGT002" },
  { id: "AGT008", name: "Desert Rose Travels", type: "Agent", status: "Pending KYC", creditLimit: 0, walletBalance: 0, joined: "2026-06-20", gst: "08AAECD8899X1Z3", pan: "AAECD8899X", email: "rose@desertrose.in", phone: "+91 92220 77889", city: "Jaipur" },
  { id: "AGT009", name: "Greenleaf Getaways", type: "Sub-Agent", status: "Active", creditLimit: 150000, walletBalance: 67500, joined: "2025-05-30", gst: "32AAGCG6677M1ZB", pan: "AAGCG6677M", email: "go@greenleaf.in", phone: "+91 90090 33445", city: "Kochi", parent: "AGT001" },
  { id: "AGT010", name: "Pinnacle B2B Travel", type: "Agent", status: "Active", creditLimit: 800000, walletBalance: 412800, joined: "2024-12-11", gst: "24AAACP4455N1ZH", pan: "AAACP4455N", email: "support@pinnacleb2b.in", phone: "+91 99880 22113", city: "Ahmedabad" },
  { id: "AGT011", name: "Saffron Skies", type: "Sub-Agent", status: "Active", creditLimit: 50000, walletBalance: 15600, joined: "2026-03-08", gst: "09AAHCS1122Q1ZF", pan: "AAHCS1122Q", email: "saffron@skies.in", phone: "+91 97770 88001", city: "Lucknow", parent: "AGT001" },
];

export interface Booking {
  pnr: string;
  agentId: string;
  type: "Flight" | "Hotel";
  customer: string;
  route: string;
  travelDate: string;
  sellPrice: number;
  netPrice: number;
  status: "Confirmed" | "Cancelled" | "Amended";
}

export const bookings: Booking[] = [
  { pnr: "PNR8X4K2A", agentId: "AGT001", type: "Flight", customer: "Rohan Mehta", route: "DEL → BOM", travelDate: "2026-07-02", sellPrice: 8450, netPrice: 7600, status: "Confirmed" },
  { pnr: "PNR9L2M7B", agentId: "AGT001", type: "Flight", customer: "Priya Sharma", route: "BLR → HYD", travelDate: "2026-07-04", sellPrice: 5200, netPrice: 4650, status: "Confirmed" },
  { pnr: "PNR3T1N5C", agentId: "AGT001", type: "Hotel", customer: "Aman Verma", route: "Goa · 3 nights", travelDate: "2026-07-12", sellPrice: 18900, netPrice: 16400, status: "Confirmed" },
  { pnr: "PNR7H8Q9D", agentId: "AGT001", type: "Flight", customer: "Neha Kapoor", route: "CCU → DEL", travelDate: "2026-06-30", sellPrice: 6700, netPrice: 6100, status: "Amended" },
  { pnr: "PNR4P6R3E", agentId: "AGT001", type: "Hotel", customer: "Vikram Singh", route: "Jaipur · 2 nights", travelDate: "2026-06-28", sellPrice: 12400, netPrice: 10800, status: "Confirmed" },
  { pnr: "PNR1A2S8F", agentId: "AGT001", type: "Flight", customer: "Meera Iyer", route: "BOM → DXB", travelDate: "2026-08-15", sellPrice: 24500, netPrice: 22100, status: "Confirmed" },
  { pnr: "PNR5D9F0G", agentId: "AGT001", type: "Flight", customer: "Karthik R.", route: "HYD → BLR", travelDate: "2026-06-25", sellPrice: 4800, netPrice: 4250, status: "Cancelled" },
  { pnr: "PNR2J6K4H", agentId: "AGT002", type: "Flight", customer: "S. Banerjee", route: "DEL → BLR", travelDate: "2026-07-01", sellPrice: 7800, netPrice: 7000, status: "Confirmed" },
  { pnr: "PNR0Z3X1J", agentId: "AGT001", type: "Hotel", customer: "Anita Joshi", route: "Udaipur · 4 nights", travelDate: "2026-08-02", sellPrice: 32100, netPrice: 28400, status: "Confirmed" },
  { pnr: "PNR6V7B2K", agentId: "AGT001", type: "Flight", customer: "Ravi Pillai", route: "DEL → CCU", travelDate: "2026-07-19", sellPrice: 6200, netPrice: 5500, status: "Confirmed" },
  { pnr: "PNR8N4M5L", agentId: "AGT001", type: "Flight", customer: "Sonia Aggarwal", route: "BOM → BLR", travelDate: "2026-07-08", sellPrice: 5400, netPrice: 4900, status: "Confirmed" },
];

export interface Activity {
  id: string;
  type: "registration" | "booking" | "topup" | "kyc";
  text: string;
  time: string;
}

export const activity: Activity[] = [
  { id: "a1", type: "kyc", text: "BlueWave Tours submitted KYC documents", time: "12 min ago" },
  { id: "a2", type: "booking", text: "Demo Co. Travels confirmed PNR8X4K2A · DEL → BOM", time: "28 min ago" },
  { id: "a3", type: "topup", text: "Pinnacle B2B Travel topped up ₹1,50,000", time: "1 hr ago" },
  { id: "a4", type: "registration", text: "Desert Rose Travels registered as Agent", time: "2 hr ago" },
  { id: "a5", type: "booking", text: "Heritage Trails LLP confirmed Hotel · Udaipur", time: "3 hr ago" },
  { id: "a6", type: "kyc", text: "Approved KYC for Greenleaf Getaways", time: "5 hr ago" },
];

export interface MarkupRule {
  id: string;
  name: string;
  appliesTo: "Flight" | "Hotel" | "All";
  type: "Flat" | "Percentage";
  value: number;
  scope: string;
  status: "Active" | "Paused";
}

export const adminMarkupRules: MarkupRule[] = [
  { id: "MR01", name: "Domestic Flight Default", appliesTo: "Flight", type: "Percentage", value: 3.5, scope: "All Agents", status: "Active" },
  { id: "MR02", name: "Intl Flight Premium", appliesTo: "Flight", type: "Percentage", value: 5, scope: "Master Agents", status: "Active" },
  { id: "MR03", name: "Hotel Standard", appliesTo: "Hotel", type: "Percentage", value: 4, scope: "All Agents", status: "Active" },
  { id: "MR04", name: "Skyline Special Override", appliesTo: "All", type: "Flat", value: 250, scope: "Skyline Holidays", status: "Active" },
  { id: "MR05", name: "Festive Hotel Boost", appliesTo: "Hotel", type: "Percentage", value: 6, scope: "All Agents", status: "Paused" },
];

export const agentMarkupRules: MarkupRule[] = [
  { id: "AMR1", name: "My Domestic Flights", appliesTo: "Flight", type: "Percentage", value: 4, scope: "All Customers", status: "Active" },
  { id: "AMR2", name: "Goa Hotels Peak", appliesTo: "Hotel", type: "Flat", value: 800, scope: "Goa Bookings", status: "Active" },
  { id: "AMR3", name: "Intl Flight Margin", appliesTo: "Flight", type: "Percentage", value: 6, scope: "Intl Routes", status: "Active" },
];

export const suppliers = [
  { name: "Amadeus", category: "Flight GDS", connected: true, key: "AMA-PROD-9X2A8K-DUMMY" },
  { name: "TBO Holidays", category: "Flight + Hotel", connected: true, key: "TBO-LIVE-44JK21-DUMMY" },
  { name: "HotelBeds", category: "Hotel Inventory", connected: true, key: "HB-API-77QPL3-DUMMY" },
];

export const commissionRules = [
  { supplier: "Amadeus", platform: 2.0, agent: 1.5, subAgent: 0.5 },
  { supplier: "TBO Holidays", platform: 2.5, agent: 2.0, subAgent: 1.0 },
  { supplier: "HotelBeds", platform: 3.0, agent: 2.5, subAgent: 1.0 },
];

export const flightResults = [
  { id: "F1", airline: "IndiGo", code: "6E-2134", dep: "06:15", arr: "08:35", from: "DEL", to: "BOM", duration: "2h 20m", stops: "Non-stop", net: 4850 },
  { id: "F2", airline: "Vistara", code: "UK-995", dep: "09:40", arr: "12:05", from: "DEL", to: "BOM", duration: "2h 25m", stops: "Non-stop", net: 5320 },
  { id: "F3", airline: "Air India", code: "AI-665", dep: "13:20", arr: "15:50", from: "DEL", to: "BOM", duration: "2h 30m", stops: "Non-stop", net: 5180 },
  { id: "F4", airline: "SpiceJet", code: "SG-8167", dep: "17:50", arr: "20:15", from: "DEL", to: "BOM", duration: "2h 25m", stops: "Non-stop", net: 4620 },
  { id: "F5", airline: "Akasa Air", code: "QP-1421", dep: "21:30", arr: "23:55", from: "DEL", to: "BOM", duration: "2h 25m", stops: "Non-stop", net: 4980 },
];

export const invoices = [
  { no: "INV/2026/0421", pnr: "PNR8X4K2A", date: "2026-06-22", amount: 7200, gst: 396, total: 7596 },
  { no: "INV/2026/0420", pnr: "PNR9L2M7B", date: "2026-06-21", amount: 4408, gst: 242, total: 4650 },
  { no: "INV/2026/0419", pnr: "PNR3T1N5C", date: "2026-06-20", amount: 15500, gst: 900, total: 16400 },
  { no: "INV/2026/0418", pnr: "PNR7H8Q9D", date: "2026-06-19", amount: 5780, gst: 320, total: 6100 },
  { no: "INV/2026/0417", pnr: "PNR4P6R3E", date: "2026-06-17", amount: 10210, gst: 590, total: 10800 },
  { no: "INV/2026/0416", pnr: "PNR0Z3X1J", date: "2026-06-15", amount: 26800, gst: 1600, total: 28400 },
  { no: "INV/2026/0415", pnr: "PNR6V7B2K", date: "2026-06-14", amount: 5200, gst: 300, total: 5500 },
];

export const walletTxns = [
  { date: "2026-06-22", type: "Debit", amount: 7600, desc: "Booking PNR8X4K2A · DEL → BOM", balance: 234500 },
  { date: "2026-06-21", type: "Debit", amount: 4650, desc: "Booking PNR9L2M7B · BLR → HYD", balance: 242100 },
  { date: "2026-06-20", type: "Credit", amount: 100000, desc: "Wallet top-up · UPI", balance: 246750 },
  { date: "2026-06-19", type: "Debit", amount: 16400, desc: "Booking PNR3T1N5C · Goa Hotel", balance: 146750 },
  { date: "2026-06-18", type: "Credit", amount: 8400, desc: "Commission settlement · May 2026", balance: 163150 },
  { date: "2026-06-17", type: "Debit", amount: 6100, desc: "Booking PNR7H8Q9D · CCU → DEL", balance: 154750 },
  { date: "2026-06-16", type: "Debit", amount: 10800, desc: "Booking PNR4P6R3E · Jaipur Hotel", balance: 160850 },
];

export const bookingVolume = [
  { week: "W22", bookings: 142 },
  { week: "W23", bookings: 168 },
  { week: "W24", bookings: 155 },
  { week: "W25", bookings: 198 },
  { week: "W26", bookings: 221 },
];

export const revenueBySupplier = [
  { name: "Amadeus", value: 1240000 },
  { name: "TBO Holidays", value: 890000 },
  { name: "HotelBeds", value: 670000 },
];

export const agentMonthlyRevenue = [
  { month: "Jan", revenue: 84000 },
  { month: "Feb", revenue: 96500 },
  { month: "Mar", revenue: 112000 },
  { month: "Apr", revenue: 128400 },
  { month: "May", revenue: 144200 },
  { month: "Jun", revenue: 167800 },
];

export const agentProfitBreakdown = [
  { month: "Feb", markup: 14200, commission: 3100 },
  { month: "Mar", markup: 18900, commission: 4200 },
  { month: "Apr", markup: 21500, commission: 4800 },
  { month: "May", markup: 24800, commission: 5400 },
  { month: "Jun", markup: 29100, commission: 6200 },
];

export const topRoutes = [
  { route: "DEL → BOM", count: 38, revenue: 312000 },
  { route: "BLR → DEL", count: 26, revenue: 198000 },
  { route: "BOM → BLR", count: 22, revenue: 142000 },
  { route: "DEL → CCU", count: 18, revenue: 124000 },
  { route: "HYD → BLR", count: 14, revenue: 78000 },
];
