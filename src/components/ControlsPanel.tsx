"use client"

import { Check, ChevronDown, Lock, Redo2, Save, Share2, Trash2, Undo2, Unlock, X } from "lucide-react"
import { useState } from "react"
import { hslToHex } from "../lib/color"
import { ColorRole, HARMONY_LABELS, HarmonyMode, ROLE_LABELS, ROLE_ORDER } from "../lib/palette"
import { buildShareUrl } from "../lib/urlShare"
import { copyText } from "../lib/exportPalette"
import { usePalette } from "../context/PaletteContext"
import { useToast } from "../context/ToastContext"
import { ContrastGrid } from "./ContrastGrid"
import { ShadeRamps } from "./ShadeRamps"
import { RegMark } from "./RegMark"

const HARMONY_MODES: HarmonyMode[] = ["auto", "complementary", "analogous", "triadic", "monochromatic"]

function SectionHeader({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
			<span className="text-ink-faint">⊹</span>
			{children}
		</h3>
	)
}

function Collapsible({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
	const [open, setOpen] = useState(defaultOpen)
	return (
		<div className="border-b border-border">
			<button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-3 text-left">
				<SectionHeader>{title}</SectionHeader>
				<ChevronDown size={15} className={`text-ink-muted transition-transform ${open ? "rotate-180" : ""}`} />
			</button>
			{open && <div className="pb-4">{children}</div>}
		</div>
	)
}

export function ControlsPanel({ open, onClose, onOpenExport }: { open: boolean; onClose: () => void; onOpenExport: () => void }) {
	const { colors, locked, harmony, saved, canUndo, canRedo, randomize, setHarmony, toggleLock, lockAll, unlockAll, undo, redo, loadPalette, savePalette, deleteSaved } = usePalette()
	const { toast } = useToast()
	const [showRamps, setShowRamps] = useState(false)
	const [saveName, setSaveName] = useState("")

	const allLocked = ROLE_ORDER.every((r) => locked[r])

	const handleShare = async () => {
		const url = buildShareUrl(colors, harmony)
		const ok = await copyText(url)
		toast(ok ? "Share link copied to clipboard" : "Couldn't copy link", ok ? "success" : "error")
	}

	const handleSave = () => {
		savePalette(saveName)
		toast(`Saved "${saveName.trim() || "Untitled palette"}"`, "success")
		setSaveName("")
	}

	return (
		<>
			{open && <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={onClose} aria-hidden="true" />}

			<aside className={`thin-scroll fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-y-auto rounded-t-2xl border-t border-border bg-surface text-ink shadow-2xl transition-transform duration-300 ease-out sm:inset-x-auto sm:right-0 sm:top-16 sm:bottom-0 sm:max-h-none sm:w-[360px] sm:translate-y-0 sm:rounded-none sm:border-l sm:border-t-0 ${open ? "translate-y-0 animate-sheet-up sm:animate-panel-in" : "translate-y-full sm:translate-x-full"}`} aria-hidden={!open}>
				<div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
					<h2 className="font-display text-sm font-semibold">Controls</h2>
					<button type="button" onClick={onClose} className="rounded-md p-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink" aria-label="Close controls">
						<X size={17} />
					</button>
				</div>

				<div className="px-4">
					{/* Actions */}
					<div className="flex items-center gap-2 border-b border-border py-3">
						<button type="button" onClick={randomize} className="flex-1 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-paper transition-opacity hover:opacity-90">
							Randomize
						</button>
						<button type="button" onClick={undo} disabled={!canUndo} className="rounded-full border border-border p-2 text-ink-muted transition-colors hover:text-ink disabled:opacity-30" aria-label="Undo" title="Undo">
							<Undo2 size={15} />
						</button>
						<button type="button" onClick={redo} disabled={!canRedo} className="rounded-full border border-border p-2 text-ink-muted transition-colors hover:text-ink disabled:opacity-30" aria-label="Redo" title="Redo">
							<Redo2 size={15} />
						</button>
					</div>

					{/* Harmony */}
					<div className="border-b border-border py-3.5">
						<SectionHeader>Harmony</SectionHeader>
						<div className="flex flex-wrap gap-1.5">
							{HARMONY_MODES.map((mode) => (
								<button key={mode} type="button" onClick={() => setHarmony(mode)} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${harmony === mode ? "border-ink bg-ink text-paper" : "border-border text-ink-muted hover:text-ink"}`}>
									{HARMONY_LABELS[mode]}
								</button>
							))}
						</div>
					</div>

					{/* Locks */}
					<div className="border-b border-border py-3.5">
						<div className="mb-2 flex items-center justify-between">
							<SectionHeader>Locks</SectionHeader>
							<button type="button" onClick={allLocked ? unlockAll : lockAll} className="text-[11px] font-medium text-ink-muted underline-offset-2 hover:text-ink hover:underline">
								{allLocked ? "Unlock all" : "Lock all"}
							</button>
						</div>
						<div className="flex flex-col gap-1">
							{ROLE_ORDER.map((role) => (
								<button key={role} type="button" onClick={() => toggleLock(role)} className="flex items-center justify-between rounded-md px-1.5 py-1.5 text-xs hover:bg-surface-2">
									<span className="flex items-center gap-2">
										<span className="h-3.5 w-3.5 rounded-full border border-border" style={{ backgroundColor: hslToHex(colors[role]) }} />
										{ROLE_LABELS[role]}
									</span>
									{locked[role] ?
										<Lock size={13} className="text-ink" />
									:	<Unlock size={13} className="text-ink-faint" />}
								</button>
							))}
						</div>
					</div>

					{/* Shade ramps */}
					<div className="border-b border-border py-3.5">
						<button type="button" onClick={() => setShowRamps((s) => !s)} className="flex w-full items-center justify-between text-left">
							<SectionHeader>Shade ramps</SectionHeader>
							<span className={`text-[11px] font-medium ${showRamps ? "text-ink" : "text-ink-muted"}`}>{showRamps ? "On" : "Off"}</span>
						</button>
						{!showRamps && <p className="text-[11px] text-ink-faint">Shows a 50–950 tint/shade scale for every role</p>}
						{showRamps && <ShadeRamps colors={colors} />}
					</div>

					{/* Accessibility */}
					<Collapsible title="Accessibility check">
						<ContrastGrid colors={colors} />
					</Collapsible>

					{/* Save & library */}
					<Collapsible title="Save & library" defaultOpen>
						<div className="mb-3 flex items-center gap-2">
							<input type="text" value={saveName} onChange={(e) => setSaveName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSave()} placeholder="Name this palette" className="flex-1 rounded-lg border border-border bg-paper px-3 py-2 text-xs outline-none focus-visible:outline-2" />
							<button type="button" onClick={handleSave} className="flex items-center gap-1 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-paper hover:opacity-90">
								<Save size={13} /> Save
							</button>
						</div>

						{saved.length === 0 ?
							<p className="text-[11px] text-ink-faint">Your saved palettes will appear here, stored only on this device.</p>
						:	<ul className="flex flex-col gap-1.5">
								{saved.map((p) => (
									<li key={p.id} className="flex items-center gap-2 rounded-lg border border-border p-2">
										<div className="flex h-7 w-14 shrink-0 overflow-hidden rounded-md border border-border">
											{ROLE_ORDER.map((role) => (
												<span key={role} className="flex-1" style={{ backgroundColor: hslToHex(p.colors[role]) }} />
											))}
										</div>
										<button type="button" onClick={() => loadPalette(p.colors, p.harmony)} className="flex-1 truncate text-left text-xs font-medium hover:underline" title="Load this palette">
											{p.name}
										</button>
										<button type="button" onClick={() => deleteSaved(p.id)} className="rounded-md p-1 text-ink-faint hover:text-rose-500" aria-label={`Delete ${p.name}`}>
											<Trash2 size={13} />
										</button>
									</li>
								))}
							</ul>
						}
					</Collapsible>

					{/* Export & share */}
					<div className="py-4">
						<SectionHeader>Export & share</SectionHeader>
						<div className="flex gap-2">
							<button type="button" onClick={onOpenExport} className="flex-1 rounded-full border border-ink px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-2">
								Export palette…
							</button>
							<button type="button" onClick={handleShare} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink" title="Copy shareable link">
								<Share2 size={13} />
							</button>
						</div>
					</div>
				</div>

				<div className="h-4 sm:hidden" />
			</aside>
		</>
	)
}
