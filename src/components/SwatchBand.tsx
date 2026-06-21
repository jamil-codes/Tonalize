"use client"

import { Pencil } from "lucide-react"
import { ContrastRating, contrastRatio, hslToHex, nearestColorName, readableTextColor } from "../lib/color"
import { ColorRole, ROLE_LABELS } from "../lib/palette"
import { ContrastBadge } from "./ContrastBadge"
import { RegMark } from "./RegMark"

interface SwatchBandProps {
	role: ColorRole
	hsl: { h: number; s: number; l: number }
	locked: boolean
	primaryHex: string
	onCopy: () => void
	onToggleLock: () => void
	onEdit: () => void
}

export function SwatchBand({ role, hsl, locked, primaryHex, onCopy, onToggleLock, onEdit }: Readonly<SwatchBandProps>) {
	const hex = hslToHex(hsl)
	const fg = readableTextColor(hex)
	const name = nearestColorName(hex)
	const isTextRole = role === "text" || role === "textMuted"
	const ratio = isTextRole ? contrastRatio(primaryHex, hex) : null
	const rating: ContrastRating | null =
		ratio !== null ?
			ratio >= 7 ? "AAA"
			: ratio >= 4.5 ? "AA"
			: "Poor"
		:	null

	return (
		<div className="group relative flex h-1/5 w-full flex-1 flex-col items-center justify-center text-center transition-colors duration-300 ease-out sm:h-full sm:w-1/5" style={{ backgroundColor: hex, color: fg }}>
			<button type="button" onClick={onCopy} className="absolute inset-0 cursor-pointer" aria-label={`Copy ${ROLE_LABELS[role]} hex code ${hex}`} />

			{/* Corner controls */}
			<div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2.5 sm:p-3">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						onToggleLock()
					}}
					className="pointer-events-auto flex items-center justify-center rounded-full p-1.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
					style={{ color: fg }}
					aria-pressed={locked}
					aria-label={locked ? `Unlock ${ROLE_LABELS[role]}` : `Lock ${ROLE_LABELS[role]}`}
					title={locked ? "Locked — won't change when randomizing" : "Click to lock"}>
					<RegMark size={17} filled={locked} />
				</button>

				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						onEdit()
					}}
					className="pointer-events-auto flex items-center justify-center rounded-full p-1.5 opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-70 sm:opacity-0"
					style={{ color: fg }}
					aria-label={`Edit ${ROLE_LABELS[role]}`}
					title="Fine-tune this color">
					<Pencil size={15} />
				</button>
			</div>

			{/* Ticket label */}
			<div className="pointer-events-none relative z-10 flex select-none flex-col items-center gap-1.5 px-3">
				<p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-90">{ROLE_LABELS[role]}</p>
				<p className="font-mono text-sm tabular tracking-tight opacity-80 sm:text-base">{hex.toUpperCase()}</p>
				<p className="text-[11px] opacity-55">{name}</p>
				{rating && (
					<div className="mt-0.5">
						<ContrastBadge rating={rating} ratio={ratio ?? undefined} compact />
					</div>
				)}
			</div>
		</div>
	)
}
