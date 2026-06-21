"use client";

import { Dices } from "lucide-react";
import { useEffect } from "react";
import { ColorEditModal } from "./ColorEditModal";
import { ControlsPanel } from "./ControlsPanel";
import { ExportPanel } from "./ExportPanel";
import { usePalette } from "../context/PaletteContext";
import { usePanels } from "../context/PanelContext";

export function AppShell({ children }: { children: React.ReactNode }) {
	const { randomize, undo, redo } = usePalette();
	const { controlsOpen, closeControls, exportOpen, openExport, closeExport, editingRole, closeEdit } = usePanels();

	// Global keyboard shortcuts: space = randomize, cmd/ctrl+z = undo, shift+cmd/ctrl+z = redo
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement | null;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			if (typing) return;

			if (e.code === "Space") {
				e.preventDefault();
				randomize();
			} else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
				e.preventDefault();
				if (e.shiftKey) redo();
				else undo();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [randomize, undo, redo]);

	return (
		<>
			{children}

			<button
				type="button"
				onClick={randomize}
				className="fixed bottom-5 right-4 z-30 flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-semibold text-paper shadow-lg transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
				title="Randomize (Space)">
				<Dices size={17} />
				Randomize
			</button>

			<ControlsPanel open={controlsOpen} onClose={closeControls} onOpenExport={openExport} />
			<ExportPanel open={exportOpen} onClose={closeExport} />
			<ColorEditModal role={editingRole} onClose={closeEdit} />
		</>
	);
}
