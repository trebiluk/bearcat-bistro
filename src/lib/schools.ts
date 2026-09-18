import { CHEF_CHOICE } from "./data";

export type SchoolId = "ses" | "sms" | "shs";

export const MENU_PAGE = "https://www.solvayschools.org/districtpage.cfm?pageid=1934";

export const SCHOOLS: {
  id: SchoolId;
  short: string;
  name: string;
  grades: string;
  pdf: string;
  alts: string;
  cycle: string[][];
}[] = [
  {
    id: "ses",
    short: "SES",
    name: "Solvay Elementary",
    grades: "K–4",
    pdf: "https://www.solvayschools.org/tfiles/folder1934/September%202026%20Elementary.pdf",
    alts:
      "Available daily: Monday tuna · Tuesday turkey & cheese · Wednesday ham & cheese · Thursday & Friday Chef's Choice · every day PB&J or cheese sandwich.",
    cycle: [
      ["Chicken Poppers w/ Dippin' Sauce", "Chicken Poppers w/ Dippin' Sauce", "Mac & Cheese", "Cheeseburger or Hamburger", "Stuffed Crust Pizza"],
      ["ABC Chicken Nuggets", "Toasted Cheese Sandwich", "Pasta w/ Meat Sauce", "Beef Nachos Grande", "WG Pizza Crunchers"],
      ["Shrimp Poppers", "General Tso's Chicken", "Chicken Patty Sandwich", "Soft Taco", "Personal Pan Pizza"],
      ["Chicken & Waffles", "French Toast Sticks", "BBQ Rib Sandwich", CHEF_CHOICE, "Chicken Tenders"],
    ],
  },
  {
    id: "sms",
    short: "SMS",
    name: "Solvay Middle School",
    grades: "5–8",
    pdf: "https://www.solvayschools.org/tfiles/folder1934/September%202026%20Middle.pdf",
    alts:
      "Available daily: Made-to-Order Deli Bar · Chicken Patty or Spicy Chicken Sandwich · Peanut Butter & Jelly or Cheese Sandwich · Chef's Choice (uses extra inventory)",
    cycle: [
      ["Chicken Poppers w/ Dippin' Sauce", "Chicken Poppers w/ Dippin' Sauce", "Mac & Cheese", "Cheeseburger or Hamburger", "Stuffed Crust Pizza"],
      ["ABC Chicken Nuggets", "Toasted Cheese Sandwich", "Pasta w/ Meat Sauce", "Beef Nachos Grande", "WG Pizza Crunchers"],
      ["Shrimp Poppers", "General Tso's Chicken", "Chicken Patty Sandwich", "Soft Taco", "Personal Pan Pizza"],
      ["Chicken & Waffles", "French Toast Sticks", "BBQ Rib Sandwich", CHEF_CHOICE, "Chicken Tenders"],
    ],
  },
  {
    id: "shs",
    short: "SHS",
    name: "Solvay High School",
    grades: "9–12",
    pdf: "https://www.solvayschools.org/tfiles/folder1934/September%202026%20HS.pdf",
    alts:
      "Available daily: Made-to-Order Deli Bar · pizza variety · Chicken Patty or Spicy Chicken Sandwich · yogurt parfait · entrée salads · Peanut Butter & Jelly.",
    cycle: [
      ["Chicken Poppers w/ Dippin' Sauce", "Chicken Poppers w/ Dippin' Sauce", "Mac & Cheese", "Double Cheeseburger or Hamburger", "Stuffed Crust Pizza"],
      ["Chicken & Waffles", "Toasted Cheese Sandwich", "Pasta w/ Meat Sauce", "Beef Nachos Grande", "WG Pizza Crunchers"],
      ["Shrimp Poppers", "General Tso's Chicken", "Chicken Riggies", "Soft Taco", "Homemade Mexican or Cheese Pizza"],
      ["Chicken Tenders", "French Toast Sticks", "BBQ Pulled Pork Sandwich", CHEF_CHOICE, "Chicken Tenders"],
    ],
  },
];

export function schoolOf(id: string) {
  return SCHOOLS.find((s) => s.id === id) ?? SCHOOLS[1];
}

export function cloneCycle(id: SchoolId) {
  return schoolOf(id).cycle.map((r) => [...r]);
}
