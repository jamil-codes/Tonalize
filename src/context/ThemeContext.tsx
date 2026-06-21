"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AppTheme, loadAppTheme, saveAppTheme } from "../lib/storage";

interface ThemeContextValue {
	theme: AppTheme;
	resolvedTheme: "light" | "dark";
	setTheme: (t: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyTheme = (theme: AppTheme): "light" | "dark" => {
	const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;
	document.documentElement.setAttribute("data-theme", resolved);
	document.documentElement.style.colorScheme = resolved;
	return resolved;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<AppTheme>("system");
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		const stored = loadAppTheme();
		setThemeState(stored);
		setResolvedTheme(applyTheme(stored));

		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			setThemeState((current) => {
				if (current === "system") setResolvedTheme(applyTheme("system"));
				return current;
			});
		};
		mql.addEventListener("change", onChange);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	const setTheme = useCallback((t: AppTheme) => {
		setThemeState(t);
		saveAppTheme(t);
		setResolvedTheme(applyTheme(t));
	}, []);

	return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useAppTheme must be used within a ThemeProvider");
	return ctx;
}
