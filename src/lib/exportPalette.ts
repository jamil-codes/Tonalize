import { generateShadeRamp, hslToHex, nearestColorName, readableTextColor } from "./color";
import { ColorRole, PaletteColors, ROLE_LABELS, ROLE_ORDER } from "./palette";

export const slugify = (label: string): string =>
    label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export interface SwatchInfo {
    role: ColorRole;
    label: string;
    hex: string;
    name: string;
}

export const buildSwatchInfo = (colors: PaletteColors): SwatchInfo[] =>
    ROLE_ORDER.map((role) => {
        const hex = hslToHex(colors[role]);
        return { role, label: ROLE_LABELS[role], hex, name: nearestColorName(hex) };
    });

/* ----------------------------------- Clipboard ----------------------------------- */

export const copyText = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        /* fall through to legacy path */
    }
    try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        return ok;
    } catch {
        return false;
    }
};

/* ----------------------------------- File download ----------------------------------- */

export const downloadBlob = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const downloadText = (content: string, filename: string, mime = "text/plain"): void => {
    downloadBlob(new Blob([content], { type: `${mime};charset=utf-8` }), filename);
};

/* ----------------------------------- Code snippet exporters ----------------------------------- */

export const toCssVariables = (swatches: SwatchInfo[]): string => {
    const lines = swatches.map((s) => `  --color-${slugify(s.label)}: ${s.hex};`);
    return [`:root {`, ...lines, `}`].join("\n");
};

export const toScssVariables = (swatches: SwatchInfo[]): string =>
    swatches.map((s) => `$color-${slugify(s.label)}: ${s.hex};`).join("\n");

export const toJsonExport = (swatches: SwatchInfo[], name: string): string =>
    JSON.stringify(
        {
            name,
            generator: "Tonalize",
            exportedAt: new Date().toISOString(),
            colors: swatches.map((s) => ({ role: s.role, label: s.label, hex: s.hex, name: s.name })),
        },
        null,
        2
    );

/** Tailwind v4 `@theme` block, with a full 50–950 shade ramp per role. */
export const toTailwindV4Theme = (colors: PaletteColors): string => {
    const blocks = ROLE_ORDER.map((role) => {
        const ramp = generateShadeRamp(colors[role]);
        const slug = slugify(ROLE_LABELS[role]);
        const lines = Object.entries(ramp).map(([step, hex]) => `  --color-${slug}-${step}: ${hex};`);
        return lines.join("\n");
    });
    return [`@theme {`, blocks.join("\n"), `}`].join("\n");
};

/** Classic tailwind.config.js `theme.extend.colors` snippet (Tailwind v3 style). */
export const toTailwindV3Config = (colors: PaletteColors): string => {
    const entries = ROLE_ORDER.map((role) => {
        const ramp = generateShadeRamp(colors[role]);
        const slug = slugify(ROLE_LABELS[role]);
        const rampLines = Object.entries(ramp)
            .map(([step, hex]) => `          ${step}: "${hex}",`)
            .join("\n");
        return `        ${slug}: {\n${rampLines}\n        },`;
    });
    return [
        `/** tailwind.config.js */`,
        `module.exports = {`,
        `  theme: {`,
        `    extend: {`,
        `      colors: {`,
        entries.join("\n"),
        `      },`,
        `    },`,
        `  },`,
        `};`,
    ].join("\n");
};

export const toCopyAllHex = (swatches: SwatchInfo[]): string => swatches.map((s) => s.hex).join(", ");

export const toCopyAllLabeled = (swatches: SwatchInfo[]): string =>
    swatches.map((s) => `${s.label}: ${s.hex} (${s.name})`).join("\n");

/* ----------------------------------- Image export (PNG / SVG) ----------------------------------- */

const FOOTER_HEIGHT = 64;
const SWATCH_HEIGHT = 420;
const SWATCH_WIDTH = 260;

export const renderPaletteSvg = (swatches: SwatchInfo[]): string => {
    const width = SWATCH_WIDTH * swatches.length;
    const height = SWATCH_HEIGHT + FOOTER_HEIGHT;

    const bands = swatches
        .map((s, i) => {
            const x = i * SWATCH_WIDTH;
            const textColor = readableTextColor(s.hex);
            const cx = x + SWATCH_WIDTH / 2;
            return `
				<rect x="${x}" y="0" width="${SWATCH_WIDTH}" height="${SWATCH_HEIGHT}" fill="${s.hex}" />
				<text x="${cx}" y="${SWATCH_HEIGHT / 2 - 14}" text-anchor="middle" font-family="Inter, Segoe UI, sans-serif" font-size="18" font-weight="600" fill="${textColor}">${s.label}</text>
				<text x="${cx}" y="${SWATCH_HEIGHT / 2 + 14}" text-anchor="middle" font-family="Inter, Segoe UI, sans-serif" font-size="14" fill="${textColor}" opacity="0.85">${s.hex.toUpperCase()}</text>
				<text x="${cx}" y="${SWATCH_HEIGHT / 2 + 38}" text-anchor="middle" font-family="Inter, Segoe UI, sans-serif" font-size="12" fill="${textColor}" opacity="0.7">${s.name}</text>
			`;
        })
        .join("\n");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
		<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff" />
		${bands}
		<text x="24" y="${SWATCH_HEIGHT + FOOTER_HEIGHT / 2 + 5}" font-family="Inter, Segoe UI, sans-serif" font-size="20" font-weight="700" fill="#111111">Tonalize</text>
	</svg>`;
};

export const exportSvg = (swatches: SwatchInfo[], filename = "tonalize-palette.svg"): void => {
    downloadText(renderPaletteSvg(swatches), filename, "image/svg+xml");
};

/** Renders the palette to a PNG entirely in-browser via the Canvas 2D API — no server involved. */
export const exportPng = (swatches: SwatchInfo[], filename = "tonalize-palette.png"): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const width = SWATCH_WIDTH * swatches.length;
            const height = SWATCH_HEIGHT + FOOTER_HEIGHT;
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas not supported"));
                return;
            }

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.textAlign = "center";

            swatches.forEach((s, i) => {
                const x = i * SWATCH_WIDTH;
                const cx = x + SWATCH_WIDTH / 2;
                const textColor = readableTextColor(s.hex);

                ctx.fillStyle = s.hex;
                ctx.fillRect(x, 0, SWATCH_WIDTH, SWATCH_HEIGHT);

                ctx.fillStyle = textColor;
                ctx.font = "600 18px Inter, Segoe UI, sans-serif";
                ctx.fillText(s.label, cx, SWATCH_HEIGHT / 2 - 10);

                ctx.font = "14px Inter, Segoe UI, sans-serif";
                ctx.globalAlpha = 0.85;
                ctx.fillText(s.hex.toUpperCase(), cx, SWATCH_HEIGHT / 2 + 16);

                ctx.globalAlpha = 0.7;
                ctx.font = "12px Inter, Segoe UI, sans-serif";
                ctx.fillText(s.name, cx, SWATCH_HEIGHT / 2 + 38);
                ctx.globalAlpha = 1;
            });

            ctx.fillStyle = "#111111";
            ctx.textAlign = "left";
            ctx.font = "700 20px Inter, Segoe UI, sans-serif";
            ctx.fillText("Tonalize", 24, SWATCH_HEIGHT + FOOTER_HEIGHT / 2 + 7);

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Failed to encode PNG"));
                    return;
                }
                downloadBlob(blob, filename);
                resolve();
            }, "image/png");
        } catch (err) {
            reject(err as Error);
        }
    });
};
