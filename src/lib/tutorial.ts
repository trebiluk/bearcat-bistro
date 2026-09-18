export const TUTORIAL_KEY = "bearcat-bistro-tutorial";
export const TUTORIAL_SEEN = "bearcat-bistro-tutorial-seen";

export interface TourStep {
  id: string;
  view: "print" | "desk" | "stock" | "line" | "trips" | "help";
  title: string;
  body: string;
}

export const TOUR: TourStep[] = [
  {
    id: "hello",
    view: "help",
    title: "This is Bearcat Bistro",
    body: "Solvay lunch lives here. Two buttons at the top: Menu (what families see) and Kitchen (what cooks do). You cannot break the calendar. Try anything. Use Undo by Restore backup if needed.",
  },
  {
    id: "menu",
    view: "print",
    title: "Menu is the flyer",
    body: "This page is the lunch menu. Pick SES, SMS, or SHS first. Click any day to change that lunch. Gold fields on the right are the only places you type. Gray cells are locked.",
  },
  {
    id: "day",
    view: "print",
    title: "Change one day",
    body: "Click Tuesday. Choose the entree from the list, or type your own. Leave “Match the school calendar” alone unless that day is different. Chef’s Choice needs a leftover from stock.",
  },
  {
    id: "print",
    view: "print",
    title: "Print one page",
    body: "When the month looks right, click Print flyer. Edge: Landscape, one page. Legal notices already sit at the bottom. The big Canva graphic does not print.",
  },
  {
    id: "kitchen",
    view: "desk",
    title: "Kitchen is today",
    body: "Four jobs: Print tickets, Receive stock, Bag lunches, Print flyer. The week cards are this building’s lunches. Click a card to jump to that day on the flyer.",
  },
  {
    id: "stock",
    view: "stock",
    title: "Stock",
    body: "Receive a truck here (In). Serving a case (Out). Red = order. Chef’s Choice should pick something over par so extras get used.",
  },
  {
    id: "tickets",
    view: "line",
    title: "Cook and aide tickets",
    body: "Print both sheets for today. Same tasks every day unless the menu or a trip changes. Check boxes as you go.",
  },
  {
    id: "bags",
    view: "trips",
    title: "Field trip bags",
    body: "Bags are packed the school day before. Teachers sign up with names. A name paper goes on every bag. Default sandwich is cheese.",
  },
  {
    id: "save",
    view: "help",
    title: "Save on the network",
    body: "⋯ menu → Choose folder. Pick the shared drive (S: or \\\\server\\share). After that, Save to folder writes a dated file there. Import latest brings it back. Do this on the office Edge profile, not InPrivate.",
  },
];

export const HELP_PAGES: { title: string; body: string[] }[] = [
  {
    title: "How he opens it",
    body: [
      "Same Windows login. Same Edge. Install as an app (Edge address bar → App available) and pin it to the taskbar.",
      "Never InPrivate. Never a substitute’s login. That looks like a blank year.",
      "Turn the monitor to 125% or 150% if type is small.",
    ],
  },
  {
    title: "Menu — families",
    body: [
      "Pick the school: SES (K–4), SMS (5–8), SHS (9–12). Each building keeps its own flyer.",
      "Click a day. Gold panel = type here. The grid itself is locked so nobody drags the calendar.",
      "Print flyer = one landscape page. Entrees in the cells. Sides print once at the bottom. USDA legal stays on the sheet.",
      "Week of column switch: On shows 8/30, 9/6 on the left. Off is Sunday–Saturday only.",
      "Oct 30 is breakfast only at Elementary (half day PreK–4). Middle and High still serve lunch that Friday.",
    ],
  },
  {
    title: "Kitchen — staff",
    body: [
      "Today: this week plus four big buttons.",
      "Stock: receive USDA/commercial trucks, watch red SHORT/OUT.",
      "Tickets: cook sheet and aide sheet for the line.",
      "Bags: field trips. Pack the day before. Names on papers.",
      "Headcount is how many plates, not including trip bags.",
    ],
  },
  {
    title: "Nutrition Lab",
    body: [
      "Learn tab: classroom supplement, not a replacement for certified health class.",
      "NY Next Generation ELA/Math (Common Core lineage), NYS Health 1–3, USDA MyPlate and NSLP Offer vs Serve.",
      "Pick K–2, 3–5, 6–8, or 9–12. Today’s tray pulls the live menu. Build a tray checks the 3-of-5 rule. Print Sheet is the exit ticket.",
    ],
  },
  {
    title: "Chef’s Choice",
    body: [
      "Printed menus go out early. Chef’s Choice burns extra inventory.",
      "The flyer still says Chef’s Choice. In the gold panel, pick the leftover product so stock counts down.",
      "If Chef’s Choice has no pick, that day flags red until you choose one.",
    ],
  },
  {
    title: "Saving work",
    body: [
      "The year is embedded. Edits save in this Edge profile automatically.",
      "Choose a network folder so IT cache-clearing cannot wipe a month.",
      "Once a week: Save to folder. If the flyer looks empty: Import latest.",
      "Download backup still works if no folder is chosen.",
      "Menus go home once a month — one paper per child. A gold banner appears one week before the first lunch of that month: print the copies, send the PDF, then Mark PDF sent.",
    ],
  },
  {
    title: "Family menu page",
    body: [
      "Menu → Family HTML downloads one file: bearcat-bistro-menu.html. Put it on the district site or the shared drive.",
      "Kids and parents see today, this week, the month, search (next pizza), copy today, add to calendar, and print. Kitchen stock stays hidden.",
      "Past months stay up. Future months stay hidden until you turn on “Post this month.”",
      "Preview family page opens it in a new tab before you post.",
    ],
  },
  {
    title: "Brand kit",
    body: [
      "The look is locked: kit 2026.09.06-soft. ⋯ → Brand kit.",
      "Navy #13243C, Harvest #E05D32, Peach Gold #FFF1E6, Cream #FBF7F2. Bebas for the wordmark, Barlow for everything else.",
      "Download HTML and paste those hexes into Canva. Do not go back to neon orange.",
    ],
  },
  {
    title: "Morning counts",
    body: [
      "Elementary may call choice counts before the line opens.",
      "Kitchen → Counts. Type the numbers they say. Tickets then cook to those, not the plate count.",
      "Until they call, cook to SES / SMS / SHS plates. The gold banner waits on SES.",
    ],
  },
  {
    title: "What not to do",
    body: [
      "Do not clear browsing data on this Edge profile.",
      "Do not open it on a home PC and the office PC without restoring a backup.",
      "Past days stay editable. That is the official record: snow days and unplanned Chef’s Choice (what leftover actually went out). Open Log from More to see the dated history.",
      "Do not email a new link every week. One pinned app.",
    ],
  },
];

export function loadTutorial() {
  try {
    const raw = localStorage.getItem(TUTORIAL_KEY);
    if (!raw) return { on: localStorage.getItem(TUTORIAL_SEEN) !== "1", step: 0 };
    const o = JSON.parse(raw) as { on?: boolean; step?: number };
    return { on: !!o.on, step: Number(o.step) || 0 };
  } catch {
    return { on: true, step: 0 };
  }
}

export function saveTutorial(on: boolean, step: number) {
  try {
    localStorage.setItem(TUTORIAL_KEY, JSON.stringify({ on, step }));
    if (!on) localStorage.setItem(TUTORIAL_SEEN, "1");
  } catch {
    /* */
  }
}
