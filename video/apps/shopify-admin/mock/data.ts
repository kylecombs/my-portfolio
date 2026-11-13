// Made-up data for the mock admin. Store names and the activity are public (camp.com);
// every person, email and order here is invented.

export const LOCATIONS = ["5th Avenue", "Washington D.C.", "Boston"] as const;
export type Location = (typeof LOCATIONS)[number];

const PRICES: Record<Location, { child: number[]; bundled: number; points: string }> = {
  "5th Avenue": { child: [45, 49, 52], bundled: 49, points: "20% - 50%" },
  "Washington D.C.": { child: [42, 45, 49], bundled: 42, points: "30% - 60%" },
  Boston: { child: [32, 35, 39], bundled: 32, points: "20% - 50%" },
};

export interface Slot {
  id: number;
  location: Location;
  time: string;
  child: number[];
  bundled: number;
  points: string;
  canceled: boolean;
  booked: number;
}

const TIMES = [
  "11:30AM - 12:30PM",
  "11:45AM - 12:45PM",
  "12:00PM - 1:00PM",
  "12:15PM - 1:15PM",
  "12:30PM - 1:30PM",
];

export const SLOTS: Slot[] = TIMES.flatMap((t, ti) =>
  LOCATIONS.map((location, li) => ({
    id: ti * 3 + li,
    location,
    time: `Tuesday, Nov 3, 2026 ${t} EST`,
    ...PRICES[location],
    canceled: location === "Washington D.C." && ti < 3,
    booked: [38, 22, 31, 40, 17][ti] - li * 4,
  }))
);

export const ADDONS = [
  { title: "Bluey Ears Headband", limit: 4, reschedule: false, disabledAt: [] as Location[] },
  { title: "Bingo Ears Headband", limit: 4, reschedule: false, disabledAt: [] as Location[] },
  { title: "Bluey Plush (12\")", limit: 2, reschedule: false, disabledAt: ["Boston"] as Location[] },
  { title: "Keepy Uppy Balloon Pack", limit: 3, reschedule: true, disabledAt: [] as Location[] },
  { title: "Grannies Dance Party Pass", limit: 6, reschedule: true, disabledAt: ["Washington D.C."] as Location[] },
];

export const BUNDLES = [
  { name: "Family Fun Pack", ticket: "General Admission", badges: ["Best Value"], slots: 2, shared: false },
  { name: "Bluey Ears Bundle", ticket: "General Admission", badges: [], slots: 1, shared: false },
  { name: "Birthday Kid Bundle", ticket: "General Admission", badges: ["New"], slots: 2, shared: true },
];

export type LeadStatus =
  | "Lead Created"
  | "Contacted, No Reply"
  | "Customer Engaged"
  | "Customer Invoiced"
  | "Customer Paid"
  | "Cancelled";

export const LEAD_BADGE: Record<LeadStatus, "info" | "critical" | "warning" | "attention" | "success" | "new"> = {
  "Lead Created": "info",
  "Contacted, No Reply": "critical",
  "Customer Engaged": "warning",
  "Customer Invoiced": "attention",
  "Customer Paid": "success",
  Cancelled: "new",
};

export const LEADS: {
  first: string;
  last: string;
  email: string;
  status: LeadStatus;
  date: string;
  area: string;
}[] = [
  { first: "Jamie", last: "Rivera", email: "jamie.rivera@example.com", status: "Customer Engaged", date: "Dec 12, 2026 10:00AM", area: "Bluey's Backyard" },
  { first: "Priya", last: "Natarajan", email: "priya.n@example.com", status: "Lead Created", date: "", area: "" },
  { first: "Marcus", last: "Bell", email: "mbell@example.com", status: "Customer Paid", date: "Nov 21, 2026 2:00PM", area: "Party Room A" },
  { first: "Elena", last: "Sokolova", email: "elena.s@example.com", status: "Contacted, No Reply", date: "Jan 9, 2027 11:00AM", area: "" },
  { first: "Owen", last: "Park", email: "owen.park@example.com", status: "Customer Invoiced", date: "Dec 5, 2026 1:00PM", area: "Party Room B" },
  { first: "Tasha", last: "Greene", email: "tgreene@example.com", status: "Customer Paid", date: "Nov 28, 2026 3:00PM", area: "Bluey's Backyard" },
  { first: "Diego", last: "Morales", email: "diego.m@example.com", status: "Contacted, No Reply", date: "Dec 19, 2026 12:00PM", area: "" },
  { first: "Hannah", last: "Kim", email: "hannah.kim@example.com", status: "Lead Created", date: "", area: "" },
  { first: "Sam", last: "Okafor", email: "sam.okafor@example.com", status: "Cancelled", date: "", area: "" },
  { first: "Leah", last: "Brooks", email: "leah.brooks@example.com", status: "Customer Engaged", date: "Jan 16, 2027 10:30AM", area: "Party Room A" },
];
