"use client";

import { useState } from "react";
import { SwatchBand } from "@/components/SwatchBand";
import { usePalette } from "@/context/PaletteContext";
import { usePanels } from "@/context/PanelContext";
import { useToast } from "@/context/ToastContext";
import { copyText } from "@/lib/exportPalette";
import { hslToHex } from "@/lib/color";
import { ROLE_ORDER } from "@/lib/palette";

export default function Home() {
	const { colors, locked, toggleLock, hydrated } = usePalette();
	const { openEdit } = usePanels();
	const { toast } = useToast();

	const primaryHex = hslToHex(colors.primary);

	const handleCopy = async (hex: string) => {
		const ok = await copyText(hex);
		toast(ok ? `${hex.toUpperCase()} copied to clipboard` : "Couldn't copy", ok ? "success" : "error");
	};

	return (
		<main className="h-dvh w-dvw pt-14 sm:pt-16">
			<div className={`boxes relative flex h-full w-full flex-col transition-opacity duration-200 sm:flex-row ${hydrated ? "opacity-100" : "opacity-0"}`} aria-busy={!hydrated}>
				{ROLE_ORDER.map((role) => (
					<SwatchBand
						key={role}
						role={role}
						hsl={colors[role]}
						locked={locked[role]}
						primaryHex={primaryHex}
						onCopy={() => handleCopy(hslToHex(colors[role]))}
						onToggleLock={() => toggleLock(role)}
						onEdit={() => openEdit(role)}
					/>
				))}
			</div>
		</main>
	);
}
