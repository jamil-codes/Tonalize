"use client"

import { Lock, Unlock, X } from "lucide-react"
import { useEffect, useState } from "react"
import { hslToHex, isValidHex } from "../lib/color"
import { ColorRole, ROLE_LABELS } from "../lib/palette"
import { usePalette } from "../context/PaletteContext"

function SliderRow({ label, value, max, onChange, suffix = "" }: Readonly<{ label: string; value: number; max: number; onChange: (v: number) => void; suffix?: string }>) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="flex items-baseline justify-between text-xs">
				<span className="font-medium text-ink-muted">{label}</span>
				<span className="font-mono tabular text-ink">
					{Math.round(value)}
					{suffix}
				</span>
			</span>
			<input type="range" className="dial" min={0} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
		</label>
	)
}

export function ColorEditModal({ role, onClose }: Readonly<{ role: ColorRole | null; onClose: () => void }>) {
	const { colors, locked, setColorHsl, setColorHex, toggleLock } = usePalette()
	const [hexInput, setHexInput] = useState("")
	const [hexError, setHexError] = useState(false)

	const hsl = role ? colors[role] : null

	useEffect(() => {
		if (hsl) {
			setHexInput(hslToHex(hsl))
			setHexError(false)
		}
	}, [hsl, role])

	useEffect(() => {
		if (!role) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [role, onClose])

	if (!role || !hsl) return null

	const commitHex = (value: string) => {
		if (isValidHex(value)) {
			const normalized = value.startsWith("#") ? value : `#${value}`
			setColorHex(role, normalized)
			setHexError(false)
		} else {
			setHexError(true)
		}
	}

	return (
		<div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 animate-fade-in" onClick={onClose} role="presentation">
			<div className="w-full max-w-sm rounded-xl border border-border bg-surface p-5 text-ink shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Edit ${ROLE_LABELS[role]} color`}>
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-display text-base font-semibold">Edit {ROLE_LABELS[role]}</h2>
					<button type="button" onClick={onClose} className="rounded-md p-1 text-ink-muted hover:bg-surface-2 hover:text-ink" aria-label="Close">
						<X size={18} />
					</button>
				</div>

				<div className="mb-4 flex items-center gap-3">
					<input
						type="color"
						value={
							isValidHex(hexInput) ?
								hexInput.startsWith("#") ?
									hexInput
								:	`#${hexInput}`
							:	hslToHex(hsl)
						}
						onChange={(e) => {
							setHexInput(e.target.value)
							commitHex(e.target.value)
						}}
						className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0"
						aria-label="Pick a color"
					/>
					<div className="flex-1">
						<input
							type="text"
							value={hexInput}
							onChange={(e) => setHexInput(e.target.value)}
							onBlur={(e) => commitHex(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") commitHex((e.target as HTMLInputElement).value)
							}}
							spellCheck={false}
							className={`w-full rounded-lg border bg-paper px-3 py-2 font-mono text-sm tabular outline-none focus-visible:outline-2 ${hexError ? "border-rose-500" : "border-border"}`}
							placeholder="#aabbcc"
						/>
						{hexError && <p className="mt-1 text-[11px] text-rose-500">Enter a valid hex code, like #336699.</p>}
					</div>
				</div>

				<div className="flex flex-col gap-3.5 border-t border-border pt-4">
					<SliderRow label="Hue" value={hsl.h} max={359} suffix="°" onChange={(v) => setColorHsl(role, { ...hsl, h: v })} />
					<SliderRow label="Saturation" value={hsl.s} max={100} suffix="%" onChange={(v) => setColorHsl(role, { ...hsl, s: v })} />
					<SliderRow label="Lightness" value={hsl.l} max={100} suffix="%" onChange={(v) => setColorHsl(role, { ...hsl, l: v })} />
				</div>

				<div className="mt-4 flex items-center justify-between border-t border-border pt-4">
					<button type="button" onClick={() => toggleLock(role)} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink">
						{locked[role] ?
							<Lock size={13} />
						:	<Unlock size={13} />}
						{locked[role] ? "Locked" : "Lock this color"}
					</button>
					<button type="button" onClick={onClose} className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-paper transition-opacity hover:opacity-90">
						Done
					</button>
				</div>
			</div>
		</div>
	)
}
