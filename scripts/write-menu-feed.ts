import { writeFileSync } from "node:fs";
import { districtSeed } from "../src/lib/backup";
import { buildMenuFeed } from "../src/lib/menu-feed";

const feed = buildMenuFeed(districtSeed());
const json = JSON.stringify(feed, null, 2);
writeFileSync(new URL("../public/menu-feed.json", import.meta.url), json);
writeFileSync(new URL("../artifacts/bearcat-bistro-menu-2026-27.json", import.meta.url), json);
console.log(`wrote ${json.length} bytes · ${feed.days.sms.length} days/school`);
