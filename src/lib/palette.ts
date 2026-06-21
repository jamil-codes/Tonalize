import {
    HSL,
    clamp,
    randomInt,
    sanitizeHSL,
    hslToHex,
    readableTextColor,
    hexToHsl,
    mixHex,
    contrastRatio,
    contrastRating,
} from "./color";

export type ColorRole = "primary" | "secondary" | "accent" | "text" | "textMuted";

export const ROLE_ORDER: ColorRole[] = ["primary", "secondary", "accent", "text", "textMuted"];

export const ROLE_LABELS: Record<ColorRole, string> = {
    primary: "Primary",
    secondary: "Secondary",
    accent: "Accent",
    text: "Text",
    textMuted: "Text Muted",
};

export type HarmonyMode = "auto" | "complementary" | "analogous" | "triadic" | "monochromatic";

export const HARMONY_LABELS: Record<HarmonyMode, string> = {
    auto: "Auto (surprise me)",
    complementary: "Complementary",
    analogous: "Analogous",
    triadic: "Triadic",
    monochromatic: "Monochromatic",
};

export type PaletteColors = Record<ColorRole, HSL>;
export type LockState = Record<ColorRole, boolean>;

export const DEFAULT_LOCKS: LockState = {
    primary: false,
    secondary: false,
    accent: false,
    text: false,
    textMuted: false,
};

export const FALLBACK_PALETTE: PaletteColors = {
    primary: { h: 211, s: 60, l: 45 },
    secondary: { h: 205, s: 55, l: 55 },
    accent: { h: 21, s: 75, l: 50 },
    text: { h: 0, s: 0, l: 8 },
    textMuted: { h: 211, s: 20, l: 30 },
};

const wrapHue = (h: number): number => ((h % 360) + 360) % 360;

/** Either a fairly dark or fairly light lightness, so a black/white text choice has somewhere good to land. */
const randomPrimaryLightness = (): number => {
    const useLow = Math.random() < 0.5;
    return useLow ? randomInt(8, 30) : randomInt(70, 92);
};

const randomPrimary = (): HSL => ({
    h: randomInt(0, 359),
    s: randomInt(20, 90),
    l: randomPrimaryLightness(),
});

type ConcreteHarmony = Exclude<HarmonyMode, "auto">;
const CONCRETE_MODES: ConcreteHarmony[] = ["complementary", "analogous", "triadic", "monochromatic"];

const resolveHarmony = (mode: HarmonyMode): ConcreteHarmony => {
    if (mode !== "auto") return mode;
    return CONCRETE_MODES[randomInt(0, CONCRETE_MODES.length - 1)];
};

/** Derives secondary + accent hues/sat/light from a primary, per harmony scheme. */
const deriveSecondaryAccent = (primary: HSL, mode: ConcreteHarmony): { secondary: HSL; accent: HSL } => {
    switch (mode) {
        case "analogous":
            return {
                secondary: {
                    h: wrapHue(primary.h + randomInt(20, 40)),
                    s: clamp(primary.s + randomInt(-8, 8), 15, 100),
                    l: clamp(primary.l + randomInt(-6, 6), 5, 95),
                },
                accent: {
                    h: wrapHue(primary.h - randomInt(20, 40)),
                    s: clamp(primary.s + randomInt(-8, 8), 15, 100),
                    l: clamp(primary.l + randomInt(-6, 6), 5, 95),
                },
            };
        case "triadic":
            return {
                secondary: {
                    h: wrapHue(primary.h + 120 + randomInt(-6, 6)),
                    s: clamp(primary.s + randomInt(-10, 10), 15, 100),
                    l: clamp(primary.l + randomInt(-8, 8), 5, 95),
                },
                accent: {
                    h: wrapHue(primary.h + 240 + randomInt(-6, 6)),
                    s: clamp(primary.s + randomInt(-10, 10), 15, 100),
                    l: clamp(primary.l + randomInt(-8, 8), 5, 95),
                },
            };
        case "monochromatic":
            return {
                secondary: {
                    h: primary.h,
                    s: clamp(primary.s + randomInt(-15, 5), 5, 100),
                    l: clamp(primary.l + (primary.l > 50 ? -randomInt(15, 28) : randomInt(15, 28)), 4, 96),
                },
                accent: {
                    h: primary.h,
                    s: clamp(primary.s - randomInt(10, 30), 5, 100),
                    l: clamp(primary.l + (primary.l > 50 ? randomInt(4, 12) : -randomInt(4, 12)), 4, 96),
                },
            };
        case "complementary":
        default:
            return {
                secondary: {
                    h: wrapHue(primary.h + randomInt(-9, 9)),
                    s: clamp(primary.s + randomInt(-10, 10), 10, 100),
                    l: clamp(primary.l + randomInt(3, 14) * (primary.l > 60 ? -1 : 1), 4, 96),
                },
                accent: {
                    h: wrapHue(primary.h + 180 + randomInt(-10, 10)),
                    s: clamp(primary.s + randomInt(-10, 10), 15, 100),
                    l: clamp(primary.l + randomInt(-8, 8), 5, 95),
                },
            };
    }
};

const deriveTextColors = (primary: HSL): { text: HSL; textMuted: HSL } => {
    const primaryHex = hslToHex(primary);
    const readableHex = readableTextColor(primaryHex);
    const text = hexToHsl(readableHex);
    const mutedHex = mixHex(0.8, readableHex, primaryHex);
    const textMuted = hexToHsl(mutedHex);
    return { text, textMuted };
};

export interface GenerateOptions {
    harmony: HarmonyMode;
    locked: LockState;
    current: PaletteColors;
}

/**
 * Generates a fresh, lock-aware, WCAG-nudged 5-color palette.
 * Locked roles keep their current value; unlocked roles are (re)derived
 * from the (possibly locked) primary using the chosen harmony mode.
 */
export const generatePalette = ({ harmony, locked, current }: GenerateOptions): PaletteColors => {
    const MAX_ATTEMPTS = locked.primary ? 1 : 30;
    const STRICT_ATTEMPTS = locked.primary ? 1 : 15;

    let attempts = 0;
    let result: PaletteColors = current;

    do {
        attempts++;
        const primary = locked.primary ? current.primary : randomPrimary();
        const mode = resolveHarmony(harmony);
        const { secondary, accent } = deriveSecondaryAccent(primary, mode);
        const { text, textMuted } = deriveTextColors(primary);

        result = {
            primary: sanitizeHSL(primary),
            secondary: locked.secondary ? current.secondary : sanitizeHSL(secondary),
            accent: locked.accent ? current.accent : sanitizeHSL(accent),
            text: locked.text ? current.text : sanitizeHSL(text),
            textMuted: locked.textMuted ? current.textMuted : sanitizeHSL(textMuted),
        };

        const rating = contrastRating(contrastRatio(hslToHex(result.primary), hslToHex(result.text)));
        if (rating === "AAA") break;
        if (rating === "AA" && attempts >= STRICT_ATTEMPTS) break;
    } while (attempts < MAX_ATTEMPTS);

    return result;
};

export const clonePalette = (p: PaletteColors): PaletteColors => ({
    primary: { ...p.primary },
    secondary: { ...p.secondary },
    accent: { ...p.accent },
    text: { ...p.text },
    textMuted: { ...p.textMuted },
});
