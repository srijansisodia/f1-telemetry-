export const NAV_LINKS = [
  { href: "/standings", label: "Standings" },
  { href: "/drivers", label: "Driver DNA" },
  { href: "/battle", label: "Battle" },
  { href: "/sectors", label: "Sectors" },
] as const;

export const CURRENT_SEASON = 2024;

export const TEAMMATE_PAIRS: [string, string][] = [
  ["VER", "PER"],
  ["HAM", "RUS"],
  ["LEC", "SAI"],
  ["NOR", "PIA"],
  ["ALO", "STR"],
  ["GAS", "OCO"],
  ["ALB", "SAR"],
  ["TSU", "RIC"],
  ["MAG", "HUL"],
  ["BOT", "ZHO"],
];

export const DEFAULT_BATTLE_PAIR: [string, string] = ["VER", "PER"];
export const DEFAULT_RACE_SLUG = "bahrain";
