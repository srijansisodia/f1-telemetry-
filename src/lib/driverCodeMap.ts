export const ERGAST_TO_CODE: Record<string, string> = {
  max_verstappen: "VER",
  sergio_perez: "PER",
  lewis_hamilton: "HAM",
  george_russell: "RUS",
  charles_leclerc: "LEC",
  carlos_sainz: "SAI",
  lando_norris: "NOR",
  oscar_piastri: "PIA",
  fernando_alonso: "ALO",
  lance_stroll: "STR",
  pierre_gasly: "GAS",
  esteban_ocon: "OCO",
  alexander_albon: "ALB",
  logan_sargeant: "SAR",
  yuki_tsunoda: "TSU",
  daniel_ricciardo: "RIC",
  kevin_magnussen: "MAG",
  nico_hulkenberg: "HUL",
  valtteri_bottas: "BOT",
  guanyu_zhou: "ZHO",
};

export const CODE_TO_ERGAST: Record<string, string> = Object.fromEntries(
  Object.entries(ERGAST_TO_CODE).map(([k, v]) => [v, k])
);

export function ergastToCode(ergastId: string): string {
  return ERGAST_TO_CODE[ergastId] ?? ergastId.toUpperCase().slice(0, 3);
}

export function codeToErgast(code: string): string {
  return CODE_TO_ERGAST[code] ?? code.toLowerCase();
}
