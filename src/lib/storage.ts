import { HarmonyMode, LockState, PaletteColors } from "./palette";

const KEYS = {
    lastState: "tonalize:lastState:v1",
    savedPalettes: "tonalize:savedPalettes:v1",
    theme: "tonalize:theme:v1",
    controlsOpen: "tonalize:controlsOpen:v1",
} as const;

const isBrowser = (): boolean => typeof window !== "undefined";

const safeGet = (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
};

const safeSet = (key: string, value: string): boolean => {
    if (!isBrowser()) return false;
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch {
        return false;
    }
};

const safeRemove = (key: string): void => {
    if (!isBrowser()) return;
    try {
        window.localStorage.removeItem(key);
    } catch {
        /* ignore */
    }
};

/* ----------------------------- Last working state ----------------------------- */

export interface LastState {
    colors: PaletteColors;
    locked: LockState;
    harmony: HarmonyMode;
}

export const loadLastState = (): LastState | null => {
    const raw = safeGet(KEYS.lastState);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (!parsed?.colors || !parsed?.locked || !parsed?.harmony) return null;
        return parsed as LastState;
    } catch {
        return null;
    }
};

export const saveLastState = (state: LastState): void => {
    safeSet(KEYS.lastState, JSON.stringify(state));
};

/* ----------------------------- Saved palette library ----------------------------- */

export interface SavedPalette {
    id: string;
    name: string;
    createdAt: number;
    colors: PaletteColors;
    harmony: HarmonyMode;
}

export const loadSavedPalettes = (): SavedPalette[] => {
    const raw = safeGet(KEYS.savedPalettes);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const writeSavedPalettes = (list: SavedPalette[]): void => {
    safeSet(KEYS.savedPalettes, JSON.stringify(list));
};

export const addSavedPalette = (name: string, colors: PaletteColors, harmony: HarmonyMode): SavedPalette[] => {
    const list = loadSavedPalettes();
    const entry: SavedPalette = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim() || "Untitled palette",
        createdAt: Date.now(),
        colors,
        harmony,
    };
    const next = [entry, ...list].slice(0, 200);
    writeSavedPalettes(next);
    return next;
};

export const removeSavedPalette = (id: string): SavedPalette[] => {
    const next = loadSavedPalettes().filter((p) => p.id !== id);
    writeSavedPalettes(next);
    return next;
};

export const clearSavedPalettes = (): void => {
    safeRemove(KEYS.savedPalettes);
};

/* ----------------------------- App theme (UI light/dark) ----------------------------- */

export type AppTheme = "light" | "dark" | "system";

export const loadAppTheme = (): AppTheme => {
    const raw = safeGet(KEYS.theme);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
    return "system";
};

export const saveAppTheme = (theme: AppTheme): void => {
    safeSet(KEYS.theme, theme);
};

/* ----------------------------- Controls panel open/closed (desktop) ----------------------------- */

export const loadControlsOpen = (): boolean => {
    const raw = safeGet(KEYS.controlsOpen);
    if (raw === null) return true;
    return raw === "1";
};

export const saveControlsOpen = (open: boolean): void => {
    safeSet(KEYS.controlsOpen, open ? "1" : "0");
};
