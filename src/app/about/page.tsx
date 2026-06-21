import Link from "next/link";

export const metadata = {
	title: "About – Tonalize",
};

export default function About() {
	return (
		<main className="mx-auto max-w-2xl px-5 pb-20 pt-24 sm:pt-28">
			<h1 className="font-display text-2xl font-bold tracking-tight">About Tonalize</h1>
			<p className="mt-3 text-sm leading-relaxed text-ink-muted">
				Tonalize generates five-color UI palettes — primary, secondary, accent, text, and muted text — and nudges every combination toward
				WCAG-readable contrast. Everything runs in your browser: there is no server, no account, and no data ever leaves your device.
			</p>

			<section className="mt-8">
				<h2 className="font-display text-base font-semibold">Harmony modes</h2>
				<dl className="mt-3 flex flex-col gap-3 text-sm">
					<div>
						<dt className="font-medium">Complementary</dt>
						<dd className="text-ink-muted">Secondary stays close to the primary hue; the accent sits opposite on the color wheel for contrast.</dd>
					</div>
					<div>
						<dt className="font-medium">Analogous</dt>
						<dd className="text-ink-muted">Secondary and accent sit on either side of the primary hue for a calmer, cohesive feel.</dd>
					</div>
					<div>
						<dt className="font-medium">Triadic</dt>
						<dd className="text-ink-muted">Three hues spaced 120° apart for a vibrant, balanced palette.</dd>
					</div>
					<div>
						<dt className="font-medium">Monochromatic</dt>
						<dd className="text-ink-muted">One hue, varied in saturation and lightness only.</dd>
					</div>
				</dl>
			</section>

			<section className="mt-8">
				<h2 className="font-display text-base font-semibold">Keyboard shortcuts</h2>
				<ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink-muted">
					<li>
						<kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs">Space</kbd> — randomize
					</li>
					<li>
						<kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs">Ctrl/Cmd + Z</kbd> — undo
					</li>
					<li>
						<kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-xs">Ctrl/Cmd + Shift + Z</kbd> — redo
					</li>
				</ul>
			</section>

			<section className="mt-8">
				<h2 className="font-display text-base font-semibold">Storage</h2>
				<p className="mt-3 text-sm text-ink-muted">
					Your current palette, locks, theme preference, and any palettes you save are kept only in this browser&apos;s local storage. Clearing
					site data removes them. Shareable links encode the whole palette in the URL itself, so they work without any backend.
				</p>
			</section>

			<Link href="/" className="mt-10 inline-block rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper hover:opacity-90">
				← Back to the generator
			</Link>
		</main>
	);
}
