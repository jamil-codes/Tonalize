interface RegMarkProps {
	size?: number
	className?: string
	filled?: boolean
}

export function RegMark({ size = 16, className = "", filled = false }: Readonly<RegMarkProps>) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`reg-mark ${className}`} aria-hidden="true">
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" fill={filled ? "currentColor" : "none"} fillOpacity={filled ? 0.18 : 0} />
			<line x1="12" y1="2" x2="12" y2="6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			<line x1="12" y1="17.5" x2="12" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			<line x1="2" y1="12" x2="6.5" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			<line x1="17.5" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			<circle cx="12" cy="12" r="2.25" fill="currentColor" />
		</svg>
	)
}
