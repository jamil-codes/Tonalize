/**
 * Tonalize color engine.
 *
 * Everything here is plain, dependency-free TypeScript so it works
 * identically at build time (static export) and in the browser, with
 * no native bindings and no network calls.
 */

export interface HSL {
	h: number; // 0–359
	s: number; // 0–100
	l: number; // 0–100
}

export interface RGB {
	r: number; // 0–255
	g: number; // 0–255
	b: number; // 0–255
}

export type ContrastRating = "Poor" | "AA" | "AAA";

export const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

/** Keeps an HSL triple within valid, rounded bounds. */
export const sanitizeHSL = (hsl: HSL): HSL => ({
	h: Math.round(((hsl.h % 360) + 360) % 360),
	s: Math.round(clamp(hsl.s, 0, 100)),
	l: Math.round(clamp(hsl.l, 0, 100)),
});

export const hslToRgb = ({ h, s, l }: HSL): RGB => {
	const sNorm = s / 100;
	const lNorm = l / 100;
	const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = lNorm - c / 2;

	let r = 0;
	let g = 0;
	let b = 0;

	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
};

export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;
	const max = Math.max(rNorm, gNorm, bNorm);
	const min = Math.min(rNorm, gNorm, bNorm);
	const l = (max + min) / 2;
	const d = max - min;

	if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };

	const s = d / (1 - Math.abs(2 * l - 1));
	let h: number;
	switch (max) {
		case rNorm:
			h = ((gNorm - bNorm) / d) % 6;
			break;
		case gNorm:
			h = (bNorm - rNorm) / d + 2;
			break;
		default:
			h = (rNorm - gNorm) / d + 4;
	}
	h *= 60;
	if (h < 0) h += 360;

	return sanitizeHSL({ h, s: s * 100, l: l * 100 });
};

const toHexChannel = (n: number): string => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");

export const rgbToHex = ({ r, g, b }: RGB): string => `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`.toLowerCase();

export const hexToRgb = (hex: string): RGB => {
	let clean = hex.trim().replace(/^#/, "");
	if (clean.length === 3) {
		clean = clean
			.split("")
			.map((c) => c + c)
			.join("");
	}
	if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
		return { r: 0, g: 0, b: 0 };
	}
	return {
		r: parseInt(clean.slice(0, 2), 16),
		g: parseInt(clean.slice(2, 4), 16),
		b: parseInt(clean.slice(4, 6), 16),
	};
};

export const hslToHex = (hsl: HSL): string => rgbToHex(hslToRgb(sanitizeHSL(hsl)));
export const hexToHsl = (hex: string): HSL => rgbToHsl(hexToRgb(hex));

export const isValidHex = (hex: string): boolean => /^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(hex.trim());

/** WCAG 2.x relative luminance. */
export const relativeLuminance = ({ r, g, b }: RGB): number => {
	const channel = (v: number) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export const contrastRatio = (hexA: string, hexB: string): number => {
	const lumA = relativeLuminance(hexToRgb(hexA));
	const lumB = relativeLuminance(hexToRgb(hexB));
	const lighter = Math.max(lumA, lumB);
	const darker = Math.min(lumA, lumB);
	return (lighter + 0.05) / (darker + 0.05);
};

export const contrastRating = (ratio: number, isLargeText = false): ContrastRating => {
	if (ratio >= 7) return "AAA";
	if (ratio >= (isLargeText ? 3 : 4.5)) return "AA";
	return "Poor";
};

export const contrastBadgeClass = (rating: ContrastRating): string => {
	switch (rating) {
		case "AAA":
			return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30";
		case "AA":
			return "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30";
		default:
			return "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/30";
	}
};

/** Picks whichever of black/white reads best against a background hex. */
export const readableTextColor = (bgHex: string): "#000000" | "#ffffff" => {
	const ratioBlack = contrastRatio(bgHex, "#000000");
	const ratioWhite = contrastRatio(bgHex, "#ffffff");
	return ratioBlack >= ratioWhite ? "#000000" : "#ffffff";
};

/** Linear-RGB interpolation between two hex colors. weight=1 -> hexA, weight=0 -> hexB. */
export const mixHex = (weight: number, hexA: string, hexB: string): string => {
	const a = hexToRgb(hexA);
	const b = hexToRgb(hexB);
	const w = clamp(weight, 0, 1);
	return rgbToHex({
		r: a.r * w + b.r * (1 - w),
		g: a.g * w + b.g * (1 - w),
		b: a.b * w + b.b * (1 - w),
	});
};

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Generates a Tailwind-style tint/shade ramp from a base HSL color.
 * The 500 step equals the base color; lower steps move toward white,
 * higher steps move toward near-black. This is an HSL-lightness
 * approximation (not perceptually-uniform OKLCH), which is more than
 * good enough for UI swatches & exported design tokens.
 */
export const generateShadeRamp = (base: HSL): Record<number, string> => {
	const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
	const lightStepT: Record<number, number> = { 50: 1, 100: 0.86, 200: 0.62, 300: 0.4, 400: 0.18 };
	const darkStepT: Record<number, number> = { 600: 0.18, 700: 0.42, 800: 0.66, 900: 0.86, 950: 1 };

	const ramp: Record<number, string> = {};
	for (const step of steps) {
		let l: number;
		if (step === 500) l = base.l;
		else if (step < 500) l = lerp(base.l, 97, lightStepT[step]);
		else l = lerp(base.l, 9, darkStepT[step]);
		ramp[step] = hslToHex({ h: base.h, s: base.s, l: clamp(l, 0, 100) });
	}
	return ramp;
};

/* ---------------------------------------------------------------------- */
/* Nearest human-readable color name (standard CSS extended color names) */
/* ---------------------------------------------------------------------- */

const NAMED_COLORS: [string, string][] = [
	["Black", "#000000"], ["White", "#ffffff"], ["Gray", "#808080"], ["Silver", "#c0c0c0"],
	["Dim Gray", "#696969"], ["Dark Gray", "#a9a9a9"], ["Light Gray", "#d3d3d3"], ["Gainsboro", "#dcdcdc"],
	["Whitesmoke", "#f5f5f5"], ["Slate Gray", "#708090"], ["Light Slate Gray", "#778899"], ["Dark Slate Gray", "#2f4f4f"],
	["Red", "#ff0000"], ["Crimson", "#dc143c"], ["Firebrick", "#b22222"], ["Dark Red", "#8b0000"],
	["Indian Red", "#cd5c5c"], ["Light Coral", "#f08080"], ["Salmon", "#fa8072"], ["Dark Salmon", "#e9967a"],
	["Light Salmon", "#ffa07a"], ["Tomato", "#ff6347"], ["Orange Red", "#ff4500"], ["Coral", "#ff7f50"],
	["Orange", "#ffa500"], ["Dark Orange", "#ff8c00"], ["Gold", "#ffd700"], ["Goldenrod", "#daa520"],
	["Dark Goldenrod", "#b8860b"], ["Yellow", "#ffff00"], ["Khaki", "#f0e68c"], ["Dark Khaki", "#bdb76b"],
	["Olive", "#808000"], ["Yellow Green", "#9acd32"], ["Lime", "#00ff00"], ["Lime Green", "#32cd32"],
	["Lawn Green", "#7cfc00"], ["Chartreuse", "#7fff00"], ["Green Yellow", "#adff2f"], ["Forest Green", "#228b22"],
	["Green", "#008000"], ["Dark Green", "#006400"], ["Sea Green", "#2e8b57"], ["Medium Sea Green", "#3cb371"],
	["Spring Green", "#00ff7f"], ["Medium Spring Green", "#00fa9a"], ["Pale Green", "#98fb98"], ["Light Green", "#90ee90"],
	["Dark Sea Green", "#8fbc8f"], ["Olive Drab", "#6b8e23"], ["Dark Olive Green", "#556b2f"], ["Teal", "#008080"],
	["Dark Cyan", "#008b8b"], ["Light Sea Green", "#20b2aa"], ["Cadet Blue", "#5f9ea0"], ["Cyan", "#00ffff"],
	["Aqua", "#00ffff"], ["Turquoise", "#40e0d0"], ["Medium Turquoise", "#48d1cc"], ["Dark Turquoise", "#00ced1"],
	["Pale Turquoise", "#afeeee"], ["Aquamarine", "#7fffd4"], ["Medium Aquamarine", "#66cdaa"], ["Powder Blue", "#b0e0e6"],
	["Sky Blue", "#87ceeb"], ["Light Sky Blue", "#87cefa"], ["Deep Sky Blue", "#00bfff"], ["Dodger Blue", "#1e90ff"],
	["Cornflower Blue", "#6495ed"], ["Steel Blue", "#4682b4"], ["Light Steel Blue", "#b0c4de"], ["Light Blue", "#add8e6"],
	["Blue", "#0000ff"], ["Medium Blue", "#0000cd"], ["Dark Blue", "#00008b"], ["Navy", "#000080"],
	["Midnight Blue", "#191970"], ["Royal Blue", "#4169e1"], ["Slate Blue", "#6a5acd"], ["Medium Slate Blue", "#7b68ee"],
	["Dark Slate Blue", "#483d8b"], ["Indigo", "#4b0082"], ["Blue Violet", "#8a2be2"], ["Purple", "#800080"],
	["Dark Violet", "#9400d3"], ["Dark Orchid", "#9932cc"], ["Medium Orchid", "#ba55d3"], ["Medium Purple", "#9370db"],
	["Rebecca Purple", "#663399"], ["Orchid", "#da70d6"], ["Violet", "#ee82ee"], ["Plum", "#dda0dd"],
	["Thistle", "#d8bfd8"], ["Lavender", "#e6e6fa"], ["Magenta", "#ff00ff"], ["Fuchsia", "#ff00ff"],
	["Deep Pink", "#ff1493"], ["Hot Pink", "#ff69b4"], ["Pink", "#ffc0cb"], ["Light Pink", "#ffb6c1"],
	["Pale Violet Red", "#db7093"], ["Medium Violet Red", "#c71585"], ["Maroon", "#800000"], ["Brown", "#a52a2a"],
	["Saddle Brown", "#8b4513"], ["Sienna", "#a0522d"], ["Chocolate", "#d2691e"], ["Peru", "#cd853f"],
	["Sandy Brown", "#f4a460"], ["Rosy Brown", "#bc8f8f"], ["Burlywood", "#deb887"], ["Tan", "#d2b48c"],
	["Wheat", "#f5deb3"], ["Navajo White", "#ffdead"], ["Bisque", "#ffe4c4"], ["Moccasin", "#ffe4b5"],
	["Peach Puff", "#ffdab9"], ["Blanched Almond", "#ffebcd"], ["Papaya Whip", "#ffefd5"], ["Antique White", "#faebd7"],
	["Linen", "#faf0e6"], ["Old Lace", "#fdf5e6"], ["Cornsilk", "#fff8dc"], ["Lemon Chiffon", "#fffacd"],
	["Ivory", "#fffff0"], ["Beige", "#f5f5dc"], ["Honeydew", "#f0fff0"], ["Mint Cream", "#f5fffa"],
	["Azure", "#f0ffff"], ["Alice Blue", "#f0f8ff"], ["Ghost White", "#f8f8ff"], ["Lavender Blush", "#fff0f5"],
	["Seashell", "#fff5ee"], ["Misty Rose", "#ffe4e1"], ["Snow", "#fffafa"], ["Floral White", "#fffaf0"],
];

const namedColorRgb: { name: string; rgb: RGB }[] = NAMED_COLORS.map(([name, hex]) => ({ name, rgb: hexToRgb(hex) }));

export const nearestColorName = (hex: string): string => {
	const target = hexToRgb(hex);
	let best = namedColorRgb[0];
	let bestDist = Infinity;
	for (const entry of namedColorRgb) {
		const dist = (entry.rgb.r - target.r) ** 2 + (entry.rgb.g - target.g) ** 2 + (entry.rgb.b - target.b) ** 2;
		if (dist < bestDist) {
			bestDist = dist;
			best = entry;
		}
	}
	return best.name;
};
