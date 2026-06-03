// World Cup 2026 — group-stage data + pick encoding (shared by UI + admin).
// `code` is the ISO / flag code; flags render from https://flagcdn.com/<code>.svg
export type Team = { name: string; code: string };
export type Group = { g: string; teams: Team[] };
export type Match = { id: number; g: string; gi: number; home: Team; away: Team };

const t = (name: string, code: string): Team => ({ name, code });

export const GROUPS: Group[] = [
  { g: "A", teams: [t("Mexico","mx"), t("South Korea","kr"), t("South Africa","za"), t("Czechia","cz")] },
  { g: "B", teams: [t("Canada","ca"), t("Switzerland","ch"), t("Qatar","qa"), t("Bosnia & Herz.","ba")] },
  { g: "C", teams: [t("Brazil","br"), t("Morocco","ma"), t("Haiti","ht"), t("Scotland","gb-sct")] },
  { g: "D", teams: [t("USA","us"), t("Paraguay","py"), t("Australia","au"), t("Türkiye","tr")] },
  { g: "E", teams: [t("Germany","de"), t("Curaçao","cw"), t("Côte d'Ivoire","ci"), t("Ecuador","ec")] },
  { g: "F", teams: [t("Netherlands","nl"), t("Japan","jp"), t("Sweden","se"), t("Tunisia","tn")] },
  { g: "G", teams: [t("Belgium","be"), t("Egypt","eg"), t("Iran","ir"), t("New Zealand","nz")] },
  { g: "H", teams: [t("Spain","es"), t("Cape Verde","cv"), t("Saudi Arabia","sa"), t("Uruguay","uy")] },
  { g: "I", teams: [t("France","fr"), t("Senegal","sn"), t("DR Congo","cd"), t("Norway","no")] },
  { g: "J", teams: [t("Argentina","ar"), t("Algeria","dz"), t("Austria","at"), t("Jordan","jo")] },
  { g: "K", teams: [t("Portugal","pt"), t("Iraq","iq"), t("Uzbekistan","uz"), t("Colombia","co")] },
  { g: "L", teams: [t("England","gb-eng"), t("Croatia","hr"), t("Ghana","gh"), t("Panama","pa")] },
];

// Round-robin order within a group of 4
const ORDER: [number, number][] = [[0,1],[2,3],[0,2],[1,3],[0,3],[1,2]];

export const MATCHES: Match[] = [];
GROUPS.forEach((grp, gi) => {
  ORDER.forEach(([h, a]) => {
    MATCHES.push({ id: MATCHES.length, g: grp.g, gi, home: grp.teams[h], away: grp.teams[a] });
  });
});

export const TOTAL = MATCHES.length; // 72

// All 48 teams (for the admin knockout-fixture selectors)
export const TEAMS: Team[] = (() => {
  const a: Team[] = [];
  GROUPS.forEach(g => g.teams.forEach(tm => a.push(tm)));
  return a.sort((x, y) => x.name.localeCompare(y.name));
})();
export const NAME_OF: Record<string, string> =
  Object.fromEntries(TEAMS.map(tm => [tm.code, tm.name]));

export type Pick = "1" | "X" | "2"; // 1 = home win, X = draw, 2 = away win

/**
 * Encode a partial pick map into the uint8[matchCount] the contract expects.
 * Unpicked matches become 0 (skipped, scored 0). Contract codes: 1 home, 2 draw, 3 away.
 */
export function encodePicks(picks: Record<number, Pick>, count = TOTAL): number[] {
  const out = new Array(count).fill(0);
  for (const [id, o] of Object.entries(picks)) {
    out[Number(id)] = o === "1" ? 1 : o === "X" ? 2 : 3;
  }
  return out;
}
