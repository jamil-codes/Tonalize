"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useAppTheme } from "../context/ThemeContext";
import { AppTheme } from "../lib/storage";

const OPTIONS: { value: AppTheme; label: string; icon: typeof Sun }[] = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
	const { theme, setTheme } = useAppTheme();

	return (
		<div className="flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5" role="radiogroup" aria-label="App theme">
			{OPTIONS.map(({ value, label, icon: Icon }) => (
				<button
					key={value}
					type="button"
					role="radio"
					aria-checked={theme === value}
					onClick={() => setTheme(value)}
					title={`${label} theme`}
					className={`flex items-center justify-center rounded-full p-1.5 transition-colors ${theme === value ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"}`}>
					<Icon size={14} />
					<span className="sr-only">{label}</span>
				</button>
			))}
		</div>
	);
}
