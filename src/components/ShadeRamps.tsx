"use client"

import { generateShadeRamp, readableTextColor } from "../lib/color"
import { PaletteColors, ROLE_LABELS, ROLE_ORDER } from "../lib/palette"
import { useToast } from "../context/ToastContext"
import { copyText } from "../lib/exportPalette"

export function ShadeRamps({ colors }: { colors: PaletteColors }) {
	const { toast } = useToast()

	return (
		<div className="thin-scroll w-full my-2 min-h-fit overflow-x-auto border-t border-border bg-surface px-3 py-3">
			<div className="flex min-w-max flex-col gap-2">
				{ROLE_ORDER.map((role) => {
					const ramp = generateShadeRamp(colors[role])
					return (
						<div key={role} className="flex items-center gap-2">
							<span className="w-20 shrink-0 text-[11px] font-medium uppercase tracking-wide text-ink-muted">{ROLE_LABELS[role]}</span>
							<div className="flex overflow-hidden rounded-md border border-border">
								{Object.entries(ramp).map(([step, hex]) => (
									<button
										key={step}
										type="button"
										onClick={async () => {
											const ok = await copyText(hex)
											toast(ok ? `${hex.toUpperCase()} copied` : "Couldn't copy", ok ? "success" : "error")
										}}
										className="flex h-9 w-10 flex-col items-center justify-center text-[9px] font-mono tabular transition-transform hover:z-10 hover:scale-110"
										style={{ backgroundColor: hex, color: readableTextColor(hex) }}
										title={`${step}: ${hex}`}>
										{step}
									</button>
								))}
							</div>
						</div>
					)
				})}
			</div>
			<p className="mt-2 text-[11px] text-ink-faint">Tip: each chip copies its hex code. Base color is the 500 step.</p>
		</div>
	)
}
