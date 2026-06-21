import { ContrastRating, contrastBadgeClass } from "../lib/color"

export function ContrastBadge({ rating, ratio, compact = false }: Readonly<{ rating: ContrastRating; ratio?: number; compact?: boolean }>) {
	return (
		<span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide ${contrastBadgeClass(rating)}`} title={ratio ? `Contrast ratio ${ratio.toFixed(2)}:1` : undefined}>
			{rating}
			{!compact && typeof ratio === "number" && <span className="opacity-70">· {ratio.toFixed(1)}:1</span>}
		</span>
	)
}
