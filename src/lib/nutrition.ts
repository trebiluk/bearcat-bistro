/** Classroom nutrition lab. NY Next Generation ELA/Math (Common Core lineage) + NYS Health + USDA. */

export type Band = "k2" | "g35" | "g68" | "g912";
export type Group = "Fruit" | "Vegetable" | "Grain" | "Protein" | "Dairy";

export const BANDS: { id: Band; label: string; grades: string; school: string; voice: string }[] = [
  { id: "k2", label: "K–2", grades: "Kindergarten–2", school: "SES", voice: "Short sentences. Pictures first." },
  { id: "g35", label: "3–5", grades: "Grades 3–5", school: "SES / SMS 5", voice: "Grade-level words. Fractions and labels." },
  { id: "g68", label: "6–8", grades: "Grades 6–8", school: "SMS", voice: "Reasons, percents, Offer vs Serve." },
  { id: "g912", label: "9–12", grades: "Grades 9–12", school: "SHS", voice: "NSLP pattern, FACS, careers." },
];

export const GROUPS: { id: Group; kid: string; job: string; color: string }[] = [
  { id: "Fruit", kid: "Fruit", job: "Vitamins. ½ cup counts.", color: "#E05D32" },
  { id: "Vegetable", kid: "Veggie", job: "Color on the tray. ½ cup counts.", color: "#2A7A52" },
  { id: "Grain", kid: "Grain", job: "Energy. Look for whole grain.", color: "#C56A2B" },
  { id: "Protein", kid: "Protein", job: "Meat, beans, cheese, yogurt.", color: "#A63D4C" },
  { id: "Dairy", kid: "Milk", job: "1% white or chocolate. Bones.", color: "#4F5E72" },
];

export interface Standard {
  id: string;
  set: "HE" | "ELA" | "MATH" | "FACS" | "USDA" | "NHES";
  code: string;
  text: string;
}

export const STANDARDS: Standard[] = [
  { id: "he1", set: "HE", code: "NYS HE 1", text: "Personal Health and Fitness — students understand how food choices support growth." },
  { id: "he2", set: "HE", code: "NYS HE 2", text: "A Safe and Healthy Environment — allergens, clean hands, safe tray choices." },
  { id: "he3", set: "HE", code: "NYS HE 3", text: "Resource Management — school meals, CEP, food waste, Chef’s Choice." },
  { id: "nhes1", set: "NHES", code: "NHES 1", text: "Comprehend concepts related to health promotion." },
  { id: "nhes5", set: "NHES", code: "NHES 5", text: "Use decision-making skills to enhance health." },
  { id: "nhes7", set: "NHES", code: "NHES 7", text: "Practice health-enhancing behaviors." },
  { id: "ri.k2", set: "ELA", code: "NY ELA RI.K–2", text: "Ask and answer questions about informational text (the lunch board)." },
  { id: "ri.35", set: "ELA", code: "NY ELA RI.3–5", text: "Determine main idea and key details in nutrition text." },
  { id: "w.35", set: "ELA", code: "NY ELA W.3–5", text: "Write an opinion with reasons (why I take fruit)." },
  { id: "w.68", set: "ELA", code: "NY ELA W.6–8.1", text: "Write arguments with claims and evidence about school meals." },
  { id: "sl.k2", set: "ELA", code: "NY ELA SL.K–2", text: "Speak in complete sentences about food on the tray." },
  { id: "md.k2", set: "MATH", code: "NY Math K.MD / 1.MD", text: "Compare amounts: more, less, the same." },
  { id: "nf.35", set: "MATH", code: "NY Math 3.NF / 4.NF", text: "Understand ½ and ¾ as parts of a cup (OVS fruit/veg)." },
  { id: "md.35", set: "MATH", code: "NY Math 3.MD", text: "Measure and estimate liquid volumes in cups." },
  { id: "rp.68", set: "MATH", code: "NY Math 6.RP / 7.RP", text: "Ratios and percents — share of the plate, % Daily Value." },
  { id: "facs14", set: "FACS", code: "FACS 14.3", text: "Apply dietary guidelines to plan meals that meet needs." },
  { id: "cdos", set: "FACS", code: "CDOS 3a", text: "Career development — food service, dietetics, school nutrition." },
  { id: "myplate", set: "USDA", code: "MyPlate", text: "Make half your plate fruits and vegetables; vary protein; whole grains; dairy." },
  { id: "nslp", set: "USDA", code: "7 CFR 210.10", text: "NSLP lunch: meat/meat alternate, grain, fruit, vegetable, milk. OVS: 3 components including ½ cup fruit or vegetable." },
  { id: "sbp", set: "USDA", code: "7 CFR 220.8", text: "SBP breakfast: fruit, grain or meat/meat alternate, milk. Students take at least 3 items including ½ cup fruit." },
];

export interface Lesson {
  id: string;
  band: Band[];
  title: string;
  minutes: number;
  hook: string;
  do: string;
  check: { q: string; a: string[] ; ok: number }[];
  standards: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: "fuel",
    band: ["k2"],
    title: "Food is fuel",
    minutes: 15,
    hook: "Your body is like a bus. Food is the gas.",
    do: "Look at today’s tray. Point to something that gives you energy to run and think.",
    check: [
      { q: "Food helps your body…", a: ["Grow and move", "Only sit still", "Turn invisible"], ok: 0 },
      { q: "A good lunch has…", a: ["Only candy", "Food from more than one group", "Only soda"], ok: 1 },
    ],
    standards: ["he1", "nhes1", "sl.k2"],
  },
  {
    id: "five",
    band: ["k2", "g35"],
    title: "Five friends on the plate",
    minutes: 20,
    hook: "Fruit, veggie, grain, protein, milk. That is MyPlate.",
    do: "Tap each group on today’s lunch. Say the kid name out loud.",
    check: [
      { q: "Carrots belong with…", a: ["Fruit", "Veggies", "Milk"], ok: 1 },
      { q: "1% white milk is…", a: ["Dairy", "Grain", "Oil"], ok: 0 },
    ],
    standards: ["he1", "myplate", "ri.k2"],
  },
  {
    id: "take-fruit",
    band: ["k2", "g35"],
    title: "Take a fruit or a veggie",
    minutes: 15,
    hook: "School lunch only counts if you take fruit or veg. A half cup is enough.",
    do: "Build a tray. Include fruit or veg. Press Check.",
    check: [
      { q: "A half cup looks like…", a: ["A little pile, not a mountain", "The whole tray", "Zero"], ok: 0 },
      { q: "Pizza plus milk, no fruit or veg…", a: ["Counts as a full lunch", "Does not count yet — add fruit or veg", "Is breakfast"], ok: 1 },
    ],
    standards: ["nslp", "he1", "md.k2"],
  },
  {
    id: "colors",
    band: ["k2", "g35"],
    title: "Colors on the tray",
    minutes: 15,
    hook: "Green, orange, red veggies do different jobs.",
    do: "Find a color on today’s sides. Dark green or red/orange is a win.",
    check: [
      { q: "Carrots are…", a: ["Red/orange veggies", "Milk", "Grain"], ok: 0 },
      { q: "Eating many colors…", a: ["Is a game only", "Helps you get different vitamins", "Is not allowed"], ok: 1 },
    ],
    standards: ["he1", "myplate", "nhes7"],
  },
  {
    id: "half-cup",
    band: ["g35"],
    title: "Half a cup is a fraction",
    minutes: 25,
    hook: "½ means 1 of 2 equal parts. USDA says ½ cup fruit or vegetable makes the lunch count.",
    do: "Shade the cup until it is half full. Then three-fourths. Write 1/2 and 3/4.",
    check: [
      { q: "Which is bigger?", a: ["1/4 cup", "1/2 cup", "They are the same"], ok: 1 },
      { q: "Two 1/4 cups equal…", a: ["1 cup", "1/2 cup", "2 cups"], ok: 1 },
    ],
    standards: ["nf.35", "md.35", "nslp"],
  },
  {
    id: "lunch-board",
    band: ["g35"],
    title: "Read the lunch board",
    minutes: 20,
    hook: "The menu is informational text. Titles, lists, and a key (CEP, OVS).",
    do: "Find today’s entree, a side, and one rule (free meals or ½ cup fruit).",
    check: [
      { q: "The menu’s main job is to…", a: ["Tell a fairy tale", "Tell what is served and the rules", "Sell toys"], ok: 1 },
      { q: "CEP on our menu means…", a: ["Lunch costs $3", "Every student eats free", "Only teachers eat"], ok: 1 },
    ],
    standards: ["ri.35", "he3"],
  },
  {
    id: "whole-grain",
    band: ["g35", "g68"],
    title: "Whole grain vs white",
    minutes: 20,
    hook: "Whole grain keeps the whole seed. More fiber. School grains should be whole-grain rich.",
    do: "Circle WG pizza, brown rice, or whole-wheat bun on this week’s menu.",
    check: [
      { q: "WG on the menu means…", a: ["Wild grape", "Whole grain", "White glaze"], ok: 1 },
      { q: "Fiber helps…", a: ["Your stomach do its job", "Hair glow in the dark", "Shoes tie"], ok: 0 },
    ],
    standards: ["he1", "nslp", "ri.35"],
  },
  {
    id: "milk",
    band: ["g35", "g68"],
    title: "Why milk is on the tray",
    minutes: 15,
    hook: "NSLP requires fluid milk. Solvay offers 1% white and 1% chocolate.",
    do: "Name the two milks. Say one mineral milk is known for (calcium).",
    check: [
      { q: "School milk is…", a: ["Fat-free or low-fat (1%)", "Heavy cream", "Optional water only"], ok: 0 },
      { q: "If you cannot drink cow’s milk…", a: ["Tell the cafeteria — substitutions follow a note", "Skip lunch forever", "Take soda"], ok: 0 },
    ],
    standards: ["nslp", "he2"],
  },
  {
    id: "ovs",
    band: ["g68", "g912"],
    title: "Offer versus Serve lab",
    minutes: 25,
    hook: "Five components are offered. You must take at least three, and one must be ½ cup fruit or vegetable.",
    do: "Build two trays: one that counts, one that fails. Explain the rule.",
    check: [
      { q: "Minimum components to count…", a: ["1", "3 including fruit or veg", "5 plus dessert"], ok: 1 },
      { q: "Entree + grain + milk, no fruit/veg…", a: ["Counts", "Does not count", "Is breakfast only"], ok: 1 },
    ],
    standards: ["nslp", "nhes5", "he1"],
  },
  {
    id: "subgroups",
    band: ["g68", "g912"],
    title: "Vegetable subgroups",
    minutes: 20,
    hook: "K–8 lunch must hit dark green, red/orange, beans, starchy, and other over the week.",
    do: "Sort this week’s sides into the five USDA subgroups.",
    check: [
      { q: "Carrots are…", a: ["Starchy", "Red/orange", "Dairy"], ok: 1 },
      { q: "Beans, peas, and lentils…", a: ["Count as a vegetable subgroup", "Are illegal in school", "Replace milk"], ok: 0 },
    ],
    standards: ["nslp", "he1", "ri.35"],
  },
  {
    id: "argue-milk",
    band: ["g68"],
    title: "Argument: chocolate milk",
    minutes: 30,
    hook: "Claim + evidence + counterclaim. Use the menu and the milk rule.",
    do: "Write 6–8 sentences: should 1% chocolate stay? Use one fact from USDA and one from a classmate.",
    check: [
      { q: "A strong argument needs…", a: ["Only feelings", "A claim and evidence", "All caps"], ok: 1 },
      { q: "School chocolate milk here is…", a: ["1% (low-fat)", "Whole milkshake", "Not offered"], ok: 0 },
    ],
    standards: ["w.68", "he3", "nslp"],
  },
  {
    id: "percent-plate",
    band: ["g68", "g912"],
    title: "Percents on the plate",
    minutes: 25,
    hook: "MyPlate: about half fruits and vegetables. That is 50%.",
    do: "If a tray has 4 equal parts and 2 are produce, write the fraction and the percent.",
    check: [
      { q: "2 of 4 parts as a percent is…", a: ["25%", "50%", "200%"], ok: 1 },
      { q: "Added sugars weekly limit (USDA)…", a: ["< 10% of calories", "50% of calories", "No limit"], ok: 0 },
    ],
    standards: ["rp.68", "myplate", "nslp"],
  },
  {
    id: "nslp-week",
    band: ["g912"],
    title: "Plan a reimbursable week",
    minutes: 40,
    hook: "Grades 9–12: more fruit, more veg, 2 oz eq grain and meat most days. Calories 750–850.",
    do: "Map Mon–Fri from the live menu. Flag any missing subgroup.",
    check: [
      { q: "9–12 daily fruit minimum is about…", a: ["1 cup", "1 teaspoon", "1 gallon"], ok: 0 },
      { q: "Sodium for 9–12 (through June 2027)…", a: ["≤ 1,280 mg average", "Zero sodium", "No cap"], ok: 0 },
    ],
    standards: ["nslp", "facs14", "he3"],
  },
  {
    id: "cep-resource",
    band: ["g68", "g912"],
    title: "CEP is a community resource",
    minutes: 20,
    hook: "Community Eligibility Provision: every enrolled student eats at no charge. That is resource management.",
    do: "Explain CEP in one sentence a kindergartner would get.",
    check: [
      { q: "At Solvay, student lunch costs…", a: ["$0 — CEP", "$2.25", "Whatever you have"], ok: 0 },
      { q: "CEP is…", a: ["A punishment", "A USDA way to feed all kids", "A dessert"], ok: 1 },
    ],
    standards: ["he3", "w.68"],
  },
  {
    id: "waste-chef",
    band: ["g35", "g68", "g912"],
    title: "Food waste and Chef’s Choice",
    minutes: 20,
    hook: "Menus print a month ahead. Chef’s Choice uses extra inventory so food is eaten, not dumped.",
    do: "Find a Chef’s Choice day. Name one extra that could be the pick.",
    check: [
      { q: "Chef’s Choice is usually…", a: ["A random junk day", "A planned way to use extra food", "No lunch"], ok: 1 },
      { q: "Taking only what you will eat…", a: ["Helps the kitchen and the planet", "Breaks the rules", "Stops CEP"], ok: 0 },
    ],
    standards: ["he3", "nhes7"],
  },
  {
    id: "allergy",
    band: ["k2", "g35", "g68", "g912"],
    title: "Allergies are serious",
    minutes: 15,
    hook: "Peanut butter is an everyday alternate. Some friends cannot have it. We do not swap food.",
    do: "Role-play: a friend offers to trade. You say no and tell an adult about allergies.",
    check: [
      { q: "If you have a food allergy…", a: ["The nurse and cafeteria need to know", "Keep it a secret", "Only tell a sibling"], ok: 0 },
      { q: "Trading food is…", a: ["Fine always", "Unsafe — allergens hide in food", "Required"], ok: 1 },
    ],
    standards: ["he2", "nhes5"],
  },
  {
    id: "career",
    band: ["g912"],
    title: "Who runs the bistro",
    minutes: 25,
    hook: "Director, cooks, aides, USDA foods, tickets, counts. This is a career path.",
    do: "List three jobs from the kitchen tickets. Match one to a class (FACS, business, health).",
    check: [
      { q: "A food service director…", a: ["Only washes trays", "Plans menus, orders, and legal notices", "Teaches gym only"], ok: 1 },
      { q: "USDA foods are…", a: ["A federal food pipeline schools draw from", "Illegal", "Only candy"], ok: 0 },
    ],
    standards: ["cdos", "facs14", "he3"],
  },
  {
    id: "breakfast",
    band: ["k2", "g35", "g68"],
    title: "Breakfast counts too",
    minutes: 15,
    hook: "7:30–8:00. Fruit, grain, milk. Take 3 items including ½ cup fruit.",
    do: "Name two breakfast items from the flyer. Act out taking fruit.",
    check: [
      { q: "A reimbursable breakfast needs…", a: ["Coffee only", "At least 3 items including fruit", "Pizza only"], ok: 1 },
      { q: "Breakfast here is…", a: ["Free under CEP", "$1.25", "Not served"], ok: 0 },
    ],
    standards: ["sbp", "he1"],
  },
];

const FRUIT_WORDS = /fruit|apple|orange|pear|peach|berry|melon|juice|cup/i;
const VEG_WORDS = /salad|carrot|broccoli|corn|green|bean|pea|veg|tomato|salsa|potato|coleslaw|celery/i;
const GRAIN_WORDS = /pizza|bun|bread|pasta|rice|waffle|toast|tortilla|cruncher|mac|grain|wg |noodle|french toast/i;
const PROTEIN_WORDS = /chicken|burger|beef|pork|taco|nugget|popper|shrimp|rib|yogurt|egg|cheese sandwich|patty|tender|nacho|general tso|ham|turkey|tuna/i;
const DAIRY_WORDS = /milk|yogurt|cheese/i;

export function groupOf(name: string, hint?: string): Group {
  const s = `${hint ?? ""} ${name}`;
  if (/milk/i.test(name) && !/shake|cereal/i.test(name)) return "Dairy";
  if (VEG_WORDS.test(s) && !FRUIT_WORDS.test(name)) return "Vegetable";
  if (FRUIT_WORDS.test(s)) return "Fruit";
  if (PROTEIN_WORDS.test(s)) return "Protein";
  if (GRAIN_WORDS.test(s)) return "Grain";
  if (DAIRY_WORDS.test(s)) return "Dairy";
  return "Protein";
}

export function plateItems(line: {
  entree: string;
  second?: string;
  side: string;
  side2: string;
  veg: string;
  fruit: string;
  milk: string;
  chefPick?: string;
}) {
  const rows: { name: string; group: Group }[] = [];
  const push = (name: string, hint?: string) => {
    if (!name) return;
    rows.push({ name, group: groupOf(name, hint) });
  };
  push(line.chefPick ? `Chef's Choice · ${line.chefPick}` : line.entree, "protein grain");
  push(line.second ?? "", "protein");
  push(line.side, "veg");
  push(line.side2, "veg");
  push(line.veg, "veg");
  push(line.fruit, "fruit");
  push(line.milk, "milk");
  return rows;
}

export function ovsCheck(picked: { group: Group }[]) {
  const groups = new Set(picked.map((p) => p.group));
  const produce = groups.has("Fruit") || groups.has("Vegetable");
  const count = groups.size;
  const ok = count >= 3 && produce;
  const hint = !produce
    ? "Add ½ cup fruit or vegetable so the meal can be claimed."
    : count < 3
      ? `You have ${count} group${count === 1 ? "" : "s"}. Take at least 3.`
      : "This tray can count as a reimbursable lunch.";
  return { ok, count, produce, hint };
}

export function lessonsFor(band: Band) {
  return LESSONS.filter((l) => l.band.includes(band));
}

export function standardById(id: string) {
  return STANDARDS.find((s) => s.id === id);
}

export function bandForSchool(id: string): Band {
  if (id === "ses") return "g35";
  if (id === "shs") return "g912";
  return "g68";
}
