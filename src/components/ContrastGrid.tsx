import { contrastRatio, contrastRating, hslToHex } from "../lib/color"
import { PaletteColors, ROLE_LABELS } from "../lib/palette"
import { ContrastBadge } from "./ContrastBadge"

const BACKGROUNDS: (keyof PaletteColors)[] = ["primary", "secondary", "accent"]
const FOREGROUNDS: (keyof PaletteColors)[] = ["text", "textMuted"]

export function ContrastGrid({ colors }: Readonly<{ colors: PaletteColors }>) {
	return (
		<div className="flex flex-col gap-1.5">
			{BACKGROUNDS.map((bg) => {
				const bgHex = hslToHex(colors[bg])
				return (
					<div key={bg} className="rounded-lg border border-border p-2.5">
						<div className="mb-1.5 flex items-center gap-2">
							<span className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: bgHex }} />
							<span className="text-xs font-medium text-ink">{ROLE_LABELS[bg]} background</span>
						</div>
						<div className="flex flex-col gap-1">
							{FOREGROUNDS.map((fg) => {
								const fgHex = hslToHex(colors[fg])
								const ratio = contrastRatio(bgHex, fgHex)
								const rating = contrastRating(ratio)
								return (
									<div key={fg} className="flex items-center justify-between text-[11px] text-ink-muted">
										<span>vs. {ROLE_LABELS[fg]}</span>
										<ContrastBadge rating={rating} ratio={ratio} />
									</div>
								)
							})}
						</div>
					</div>
				)
			})}
		</div>
	)
}
