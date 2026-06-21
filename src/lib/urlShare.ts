import { HSL, sanitizeHSL } from "./color";
import { HarmonyMode, PaletteColors, ROLE_ORDER } from "./palette";

const HARMONY_CODES: Record<HarmonyMode, string> = {
    auto: "a",
    complementary: "c",
    analogous: "n",
    triadic: "t",
    monochromatic: "m",
};
const CODE_TO_HARMONY: Record<string, HarmonyMode> = Object.fromEntries(
    Object.entries(HARMONY_CODES).map(([k, v]) => [v, k as HarmonyMode])
);

const encodeHsl = (hsl: HSL): string => `${Math.round(hsl.h)}-${Math.round(hsl.s)}-${Math.round(hsl.l)}`;

const decodeHsl = (chunk: string): HSL | null => {
    const parts = chunk.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
    const [h, s, l] = parts;
    return sanitizeHSL({ h, s, l });
};

/** Encodes harmony + 5 colors into a short, URL-safe string for shareable links. */
export const encodePaletteParam = (colors: PaletteColors, harmony: HarmonyMode): string => {
    const code = HARMONY_CODES[harmony] ?? "a";
    const parts = ROLE_ORDER.map((role) => encodeHsl(colors[role]));
    return `${code}.${parts.join(".")}`;
};

export const decodePaletteParam = (value: string): { colors: PaletteColors; harmony: HarmonyMode } | null => {
    try {
        const [code, ...rest] = value.split(".");
        const harmony = CODE_TO_HARMONY[code];
        if (!harmony || rest.length !== ROLE_ORDER.length) return null;
        const decoded = rest.map(decodeHsl);
        if (decoded.some((d) => d === null)) return null;

        const colors = {} as PaletteColors;
        ROLE_ORDER.forEach((role, i) => {
            colors[role] = decoded[i] as HSL;
        });
        return { colors, harmony };
    } catch {
        return null;
    }
};

export const buildShareUrl = (colors: PaletteColors, harmony: HarmonyMode): string => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("p", encodePaletteParam(colors, harmony));
    return url.toString();
};
