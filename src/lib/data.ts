import { addDays, iso, parseIso } from "./utils";

export const CONTACT = "Director Michael Herr  ·  (315) 484-1403";
export const FIRST_CYCLE = "2026-09-07";
export const FIRST_STUDENT = "2026-09-08";
export const LAST_STUDENT = "2027-06-24";

export const ENTREES = [
  "Chicken Poppers w/ Dippin' Sauce",
  "Mac & Cheese",
  "Cheeseburger or Hamburger",
  "Stuffed Crust Pizza",
  "ABC Chicken Nuggets",
  "Toasted Cheese Sandwich",
  "Pasta w/ Meat Sauce",
  "Beef Nachos Grande",
  "WG Pizza Crunchers",
  "Shrimp Poppers",
  "General Tso's Chicken",
  "Chicken Patty Sandwich",
  "Soft Taco",
  "Personal Pan Pizza",
  "Chicken & Waffles",
  "French Toast Sticks",
  "BBQ Rib Sandwich",
  "Cheese Pizza",
  "Spicy Chicken Sandwich",
  "Chicken Tenders",
  "Yogurt Parfait",
  "Veggie Burger",
  "Double Cheeseburger or Hamburger",
  "Chicken Riggies",
  "Homemade Mexican or Cheese Pizza",
  "BBQ Pulled Pork Sandwich",
] as const;

export const CHEF_CHOICE = "Chef's Choice";
export const STOCK_ENTREES = [...ENTREES];
export const ENTREE_OPTIONS = [...ENTREES, CHEF_CHOICE] as const;

export const CYCLE: string[][] = [
  ["Chicken Poppers w/ Dippin' Sauce", "Chicken Poppers w/ Dippin' Sauce", "Mac & Cheese", "Cheeseburger or Hamburger", "Stuffed Crust Pizza"],
  ["ABC Chicken Nuggets", "Toasted Cheese Sandwich", "Pasta w/ Meat Sauce", "Beef Nachos Grande", "WG Pizza Crunchers"],
  ["Shrimp Poppers", "General Tso's Chicken", "Chicken Patty Sandwich", "Soft Taco", "Personal Pan Pizza"],
  ["Chicken & Waffles", "French Toast Sticks", "BBQ Rib Sandwich", CHEF_CHOICE, "Chicken Tenders"],
];

export const DEFAULTS = {
  side: "Garden salad",
  side2: "Steamed vegetables",
  veg: "Carrots",
  fruit: "Assorted fruit cups",
  milk: "1% white milk",
};

export type ItemType = "Entree" | "Side" | "Veg" | "Fruit" | "Milk" | "USDA case";

export interface CatalogItem {
  name: string;
  type: ItemType;
  source: string;
  unit: string;
  per100: number;
  par: number;
  reorder: number;
  opening: number;
  location: string;
}

export const CATALOG: CatalogItem[] = [
  { name: "Chicken Poppers w/ Dippin' Sauce", type: "Entree", source: "USDA Processed", unit: "cs", per100: 8, par: 8, reorder: 3, opening: 10, location: "Freezer" },
  { name: "Mac & Cheese", type: "Entree", source: "USDA Processed", unit: "cs", per100: 4, par: 6, reorder: 2, opening: 8, location: "Cooler" },
  { name: "Cheeseburger or Hamburger", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 6, reorder: 2, opening: 7, location: "Freezer" },
  { name: "Stuffed Crust Pizza", type: "Entree", source: "USDA Processed", unit: "cs", per100: 4, par: 6, reorder: 2, opening: 8, location: "Freezer" },
  { name: "ABC Chicken Nuggets", type: "Entree", source: "USDA Processed", unit: "cs", per100: 8, par: 8, reorder: 3, opening: 10, location: "Freezer" },
  { name: "Toasted Cheese Sandwich", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 6, location: "Cooler" },
  { name: "Pasta w/ Meat Sauce", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Dry" },
  { name: "Beef Nachos Grande", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Dry" },
  { name: "WG Pizza Crunchers", type: "Entree", source: "USDA Processed", unit: "cs", per100: 4, par: 5, reorder: 2, opening: 6, location: "Freezer" },
  { name: "Shrimp Poppers", type: "Entree", source: "Commercial", unit: "cs", per100: 3, par: 3, reorder: 1, opening: 4, location: "Freezer" },
  { name: "General Tso's Chicken", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Freezer" },
  { name: "Chicken Patty Sandwich", type: "Entree", source: "USDA Processed", unit: "cs", per100: 2, par: 6, reorder: 2, opening: 8, location: "Freezer" },
  { name: "Soft Taco", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Cooler" },
  { name: "Personal Pan Pizza", type: "Entree", source: "USDA Processed", unit: "cs", per100: 4, par: 6, reorder: 2, opening: 8, location: "Freezer" },
  { name: "Chicken & Waffles", type: "Entree", source: "USDA Processed", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Freezer" },
  { name: "French Toast Sticks", type: "Entree", source: "Commercial", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Freezer" },
  { name: "BBQ Rib Sandwich", type: "Entree", source: "USDA Processed", unit: "cs", per100: 2, par: 4, reorder: 2, opening: 5, location: "Freezer" },
  { name: "Cheese Pizza", type: "Entree", source: "USDA Processed", unit: "cs", per100: 4, par: 4, reorder: 2, opening: 6, location: "Freezer" },
  { name: "Spicy Chicken Sandwich", type: "Entree", source: "USDA Processed", unit: "cs", per100: 2, par: 4, reorder: 2, opening: 5, location: "Freezer" },
  { name: "Chicken Tenders", type: "Entree", source: "USDA Processed", unit: "cs", per100: 3, par: 6, reorder: 2, opening: 8, location: "Freezer" },
  { name: "Yogurt Parfait", type: "Entree", source: "Commercial", unit: "cs", per100: 2, par: 4, reorder: 2, opening: 5, location: "Cooler" },
  { name: "Veggie Burger", type: "Entree", source: "Commercial", unit: "cs", per100: 2, par: 3, reorder: 1, opening: 4, location: "Freezer" },
  { name: "Double Cheeseburger or Hamburger", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 6, reorder: 2, opening: 7, location: "Freezer" },
  { name: "Chicken Riggies", type: "Entree", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Cooler" },
  { name: "Homemade Mexican or Cheese Pizza", type: "Entree", source: "USDA Processed", unit: "cs", per100: 4, par: 6, reorder: 2, opening: 8, location: "Freezer" },
  { name: "BBQ Pulled Pork Sandwich", type: "Entree", source: "Commercial", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 5, location: "Cooler" },
  { name: "Garden salad", type: "Side", source: "DoD Fresh", unit: "cs", per100: 4, par: 6, reorder: 2, opening: 8, location: "Cooler" },
  { name: "Steamed vegetables", type: "Veg", source: "DoD Fresh", unit: "cs", per100: 3, par: 8, reorder: 3, opening: 10, location: "Freezer" },
  { name: "Carrots", type: "Veg", source: "DoD Fresh", unit: "cs", per100: 3, par: 6, reorder: 2, opening: 8, location: "Cooler" },
  { name: "Green beans", type: "Veg", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 6, location: "Freezer" },
  { name: "Broccoli", type: "Veg", source: "DoD Fresh", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 6, location: "Freezer" },
  { name: "Corn", type: "Veg", source: "USDA Direct", unit: "cs", per100: 3, par: 4, reorder: 2, opening: 6, location: "Freezer" },
  { name: "French fries", type: "Side", source: "Commercial", unit: "cs", per100: 3, par: 8, reorder: 3, opening: 10, location: "Freezer" },
  { name: "WG dinner rolls", type: "Side", source: "Commercial", unit: "cs", per100: 2, par: 8, reorder: 3, opening: 12, location: "Dry" },
  { name: "WG hamburger buns", type: "Side", source: "Commercial", unit: "cs", per100: 2, par: 8, reorder: 3, opening: 10, location: "Dry" },
  { name: "Assorted fruit cups", type: "Fruit", source: "USDA Direct", unit: "cs", per100: 4, par: 12, reorder: 5, opening: 16, location: "Cooler" },
  { name: "Fresh fruit", type: "Fruit", source: "DoD Fresh", unit: "cs", per100: 4, par: 10, reorder: 4, opening: 12, location: "Cooler" },
  { name: "1% white milk", type: "Milk", source: "Commercial", unit: "crate", per100: 20, par: 20, reorder: 8, opening: 24, location: "Cooler" },
  { name: "1% chocolate milk", type: "Milk", source: "Commercial", unit: "crate", per100: 20, par: 20, reorder: 8, opening: 24, location: "Cooler" },
  { name: "USDA chicken (nugget/diced)", type: "USDA case", source: "USDA Direct", unit: "cs", per100: 0, par: 10, reorder: 4, opening: 12, location: "USDA cage" },
  { name: "USDA mozzarella", type: "USDA case", source: "USDA Direct", unit: "cs", per100: 0, par: 8, reorder: 3, opening: 10, location: "USDA cage" },
];

export const CLOSED: Record<string, { status: string; note: string }> = {
  "2026-09-01": { status: "No School", note: "Before first student day" },
  "2026-09-02": { status: "PD", note: "Staff Development" },
  "2026-09-03": { status: "No School", note: "Before first student day" },
  "2026-09-04": { status: "No School", note: "Before first student day" },
  "2026-09-07": { status: "Holiday", note: "Labor Day" },
  "2026-10-12": { status: "Holiday", note: "Indigenous Peoples' Day" },
  "2026-11-03": { status: "PD", note: "Staff Development" },
  "2026-11-11": { status: "Holiday", note: "Veterans Day Observed" },
  "2026-11-25": { status: "Recess", note: "Thanksgiving Recess" },
  "2026-11-26": { status: "Holiday", note: "Thanksgiving" },
  "2026-11-27": { status: "Recess", note: "Thanksgiving Recess" },
  "2026-12-24": { status: "Recess", note: "Holiday Recess" },
  "2026-12-25": { status: "Holiday", note: "Christmas Day" },
  "2026-12-28": { status: "Recess", note: "Holiday Recess" },
  "2026-12-29": { status: "Recess", note: "Holiday Recess" },
  "2026-12-30": { status: "Recess", note: "Holiday Recess" },
  "2026-12-31": { status: "Recess", note: "Holiday Recess" },
  "2027-01-01": { status: "Holiday", note: "New Year's Day" },
  "2027-01-18": { status: "Holiday", note: "Martin Luther King Jr. Day" },
  "2027-02-15": { status: "Recess", note: "Winter Recess" },
  "2027-02-16": { status: "Recess", note: "Winter Recess" },
  "2027-02-17": { status: "Recess", note: "Winter Recess" },
  "2027-02-18": { status: "Recess", note: "Winter Recess" },
  "2027-02-19": { status: "Recess", note: "Winter Recess" },
  "2027-03-09": { status: "PD", note: "Staff Development" },
  "2027-03-26": { status: "Holiday", note: "Good Friday" },
  "2027-04-12": { status: "Recess", note: "Spring Recess" },
  "2027-04-13": { status: "Recess", note: "Spring Recess" },
  "2027-04-14": { status: "Recess", note: "Spring Recess" },
  "2027-04-15": { status: "Recess", note: "Spring Recess" },
  "2027-04-16": { status: "Recess", note: "Spring Recess" },
  "2027-05-14": { status: "PD", note: "Staff Development" },
  "2027-05-31": { status: "Holiday", note: "Memorial Day" },
  "2027-06-25": { status: "PD", note: "Last student day was June 24" },
  "2027-06-28": { status: "No School", note: "After last student day" },
  "2027-06-29": { status: "No School", note: "After last student day" },
  "2027-06-30": { status: "No School", note: "After last student day" },
};

export const MONTHS = [
  { y: 2026, m: 9, title: "Harvest & Welcome", honor: "Hispanic Heritage Month · Labor Day" },
  { y: 2026, m: 10, title: "Autumn & First Peoples", honor: "Indigenous Peoples' Day · Filipino American History Month" },
  { y: 2026, m: 11, title: "Gratitude & Light", honor: "Native American Heritage Month · Diwali · Thanksgiving" },
  { y: 2026, m: 12, title: "Season of Lights", honor: "Christmas · Hanukkah · Kwanzaa · Bodhi Day" },
  { y: 2027, m: 1, title: "New Year & Justice", honor: "Many new-year traditions · Martin Luther King Jr. Day" },
  { y: 2027, m: 2, title: "Heritage & New Year", honor: "Black History Month · Lunar New Year" },
  { y: 2027, m: 3, title: "Spring & Women's History", honor: "Women's History Month · Ramadan · Holi" },
  { y: 2027, m: 4, title: "Earth & Renewal", honor: "Earth Month · Passover · Easter · Eid al-Fitr" },
  { y: 2027, m: 5, title: "Heritage & Remembrance", honor: "AAPI Heritage · Jewish American Heritage · Memorial Day" },
  { y: 2027, m: 6, title: "Freedom, Pride & Summer", honor: "Juneteenth · Pride Month · last student day June 24" },
];

export const ICONS = [
  { icon: "🍂", name: "Maple" }, { icon: "🍁", name: "Leaf" }, { icon: "🍎", name: "Apple" },
  { icon: "🌽", name: "Corn" }, { icon: "🌾", name: "Wheat" }, { icon: "🌻", name: "Sunflower" },
  { icon: "🦃", name: "Turkey" }, { icon: "✨", name: "Lights" }, { icon: "❄️", name: "Snow" },
  { icon: "⭐", name: "Star" }, { icon: "🕯️", name: "Candle" }, { icon: "🕎", name: "Menorah" },
  { icon: "🎄", name: "Evergreen" }, { icon: "🪔", name: "Diya" }, { icon: "🌙", name: "Crescent" },
  { icon: "🌸", name: "Blossom" }, { icon: "🧧", name: "Envelope" }, { icon: "🌷", name: "Tulip" },
  { icon: "☘️", name: "Shamrock" }, { icon: "🌱", name: "Seedling" }, { icon: "🌍", name: "Earth" },
  { icon: "🤝", name: "Handshake" }, { icon: "✊", name: "Fist" }, { icon: "🌈", name: "Rainbow" },
  { icon: "📚", name: "Books" }, { icon: "🚌", name: "Bus" }, { icon: "🎓", name: "Graduate" },
  { icon: "🥗", name: "Salad" }, { icon: "🥛", name: "Milk" }, { icon: "☀️", name: "Sun" },
];

export const MONTH_BANNERS: Record<string, string> = {
  "2026-09": "/flyers/september-banner.png",
  "2026-10": "/flyers/october-banner.png",
};

export const MONTH_ICONS: Record<string, [string, string, string]> = {
  "2026-09": ["🍂", "🍎", "📚"],
  "2026-10": ["🍁", "🌾", "🍎"],
  "2026-11": ["🦃", "✨", "🧡"],
  "2026-12": ["❄️", "🕎", "✨"],
  "2027-01": ["🤝", "⭐", "❄️"],
  "2027-02": ["🧧", "🌸", "💜"],
  "2027-03": ["🌷", "🌙", "☘️"],
  "2027-04": ["🌱", "🌍", "🐣"],
  "2027-05": ["🌸", "☀️", "💙"],
  "2027-06": ["🌈", "✊", "🎓"],
};

export const ALTS =
  "Available daily: Made-to-Order Deli Bar · Chicken Patty or Spicy Chicken Sandwich · Peanut Butter & Jelly or Cheese Sandwich · Chef's Choice (uses extra inventory)";
export const BREAKFAST =
  "Breakfast is available daily from 7:30–8:00 (Mon–Fri): cereals, muffins, breakfast sandwiches, chef's choice, fruit, and milk. A reimbursable breakfast includes fruit, grain, and milk. Students must take at least 3 items including ½ cup fruit.";
export const OVS =
  "A reimbursable lunch includes 5 components: meat/meat alternate, grain, fruit, vegetable, and milk. Students must take at least 3 components, including ½ cup of fruit or vegetable. Students may take up to 2 fruits. Fruit choices: canned and fresh. Milk: 1% white and 1% chocolate.";
export const CEP =
  "Solvay UFSD participates in the Community Eligibility Provision (CEP). All enrolled students receive breakfast and lunch at no charge.";
export const ALLERGY =
  "Peanut butter is offered daily as an alternate. Menu items may contain or be prepared near milk, wheat, soy, egg, and other allergens. Notify the cafeteria of food allergies.";
export const CHANGE = "Menus are subject to change based on product availability.";
export { LEGAL_SHORT, LEGAL_FULL } from "./legal";

export const BAG = {
  sandwich: "Toasted Cheese Sandwich",
  fruit: "Assorted fruit cups",
  veg: "Carrots",
  milk: "1% white milk",
  note: "Reimbursable bag lunch: sandwich (meat/grain), fruit, vegetable, and milk. Ice pack. Mark peanut/allergy. Count bags on the ticket.",
} as const;

export type LineRole = "Cook" | "Aide";
export type LineWhen = "Open" | "Service" | "Close";

export interface LineTask {
  id: string;
  role: LineRole;
  when: LineWhen;
  text: string;
}

/** Standing daily work. Same every serve day unless the director edits the template. */
export const LINE_TEMPLATE: LineTask[] = [
  { id: "c1", role: "Cook", when: "Open", text: "Pull today's cases from freezer/cooler. Check date dots." },
  { id: "c2", role: "Cook", when: "Open", text: "Oven / kettle on. Record start temps." },
  { id: "c3", role: "Cook", when: "Open", text: "Prep vegetable and fruit. Pan the sides." },
  { id: "c4", role: "Cook", when: "Open", text: "Set deli bar and daily alts (patty, PB&J, cheese)." },
  { id: "c5", role: "Cook", when: "Service", text: "Cook to temp. Log HACCP. Hold at 135°F+." },
  { id: "c6", role: "Cook", when: "Service", text: "Batch the line. Don't over-pan." },
  { id: "c7", role: "Cook", when: "Close", text: "Count leftover. Cool in 2 hours. Label and date." },
  { id: "c8", role: "Cook", when: "Close", text: "Write served count on the ticket. Wash pans." },
  { id: "a1", role: "Aide", when: "Open", text: "Milk cooler stocked (1% and chocolate). Wipe glass." },
  { id: "a2", role: "Aide", when: "Open", text: "Trays, sporks, napkins, trash liners." },
  { id: "a3", role: "Aide", when: "Open", text: "POS on. Allergy board posted. Gloves out." },
  { id: "a4", role: "Aide", when: "Service", text: "Offer vs serve: 3 of 5, must include ½ cup fruit or veg." },
  { id: "a5", role: "Aide", when: "Service", text: "Call the line. Watch peanut butter station." },
  { id: "a6", role: "Aide", when: "Close", text: "Wipe line, tables, milk cooler. Sweep." },
  { id: "a7", role: "Aide", when: "Close", text: "Restock for breakfast. Take trash." },
];

export function weekdays(): string[] {
  const out: string[] = [];
  let d = parseIso("2026-09-01");
  const end = parseIso("2027-06-30");
  while (d <= end) {
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(iso(d));
    d = addDays(d, 1);
  }
  return out;
}

export function officialStatus(date: string, school = "sms") {
  const d = parseIso(date);
  if (d.getDay() === 0 || d.getDay() === 6) return "Weekend";
  if (CLOSED[date]) return CLOSED[date].status;
  if (date === "2026-10-30" && school === "ses") return "Breakfast only";
  if (date < FIRST_STUDENT || date > LAST_STUDENT) return "No School";
  return "Serve";
}

export function cycleEntree(date: string) {
  const d = parseIso(date);
  const start = parseIso(FIRST_CYCLE);
  const days = Math.floor((d.getTime() - start.getTime()) / 86400000);
  const week = Math.floor(days / 7);
  const dow = (d.getDay() + 6) % 7; // Mon=0
  if (dow > 4) return "";
  const w = ((week % 4) + 4) % 4;
  return CYCLE[w][dow] ?? "";
}

export function monthKey(date: string) {
  return date.slice(0, 7);
}

export const SIDES = CATALOG.filter((c) => c.type === "Side").map((c) => c.name);
export const VEGS = CATALOG.filter((c) => c.type === "Veg").map((c) => c.name);
export const FRUITS = CATALOG.filter((c) => c.type === "Fruit").map((c) => c.name);
export const MILKS = CATALOG.filter((c) => c.type === "Milk").map((c) => c.name);

/** Baked 2026–27 year. Clearing the browser cannot delete these days. */
export const YEAR_DAYS = weekdays().map((date) => ({
  date,
  official: officialStatus(date),
  note: CLOSED[date]?.note ?? "",
  cycle: cycleEntree(date),
}));

