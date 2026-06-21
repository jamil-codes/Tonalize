"use client";

import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { usePalette } from "../context/PaletteContext";
import { usePanels } from "../context/PanelContext";
import { contrastRatio, contrastRating, hslToHex } from "../lib/color";
import { ContrastBadge } from "./ContrastBadge";
import { ThemeToggle } from "./ThemeToggle";

function Navbar() {
	const { colors } = usePalette();
	const { toggleControls, controlsOpen } = usePanels();

	const bgHex = hslToHex(colors.primary);
	const fgHex = hslToHex(colors.text);
	const ratio = contrastRatio(bgHex, fgHex);
	const rating = contrastRating(ratio);

	return (
		<header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/90 px-3 backdrop-blur sm:h-16 sm:px-6">
			<Link href="/" className="flex items-center gap-2">
				<span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: bgHex }} aria-hidden="true">
					<span className="block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: fgHex }} />
				</span>
				<span className="font-display text-sm font-bold tracking-tight sm:text-base">Tonalize</span>
				<span className="hidden text-xs text-ink-muted sm:inline">WCAG-aware palette generator</span>
			</Link>

			<div className="flex items-center gap-2 sm:gap-3">
				<div className="hidden items-center gap-1.5 sm:flex">
					<span className="text-xs text-ink-muted">Primary / Text</span>
					<ContrastBadge rating={rating} ratio={ratio} />
				</div>
				<Link href="/about" className="hidden text-xs font-medium text-ink-muted hover:text-ink sm:inline">
					About
				</Link>
				<ThemeToggle />
				<button
					type="button"
					onClick={toggleControls}
					aria-pressed={controlsOpen}
					className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${controlsOpen ? "bg-ink text-paper" : "border border-border text-ink hover:bg-surface-2"}`}>
					<SlidersHorizontal size={14} />
					<span className="hidden sm:inline">Controls</span>
				</button>
			</div>
		</header>
	);
}

export default Navbar;
