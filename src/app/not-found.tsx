import Link from "next/link";

export default function NotFound() {
	return (
		<main className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-4 pt-14 text-center sm:pt-16">
			<h1 className="font-display text-5xl font-black">404</h1>
			<p className="text-lg text-ink-muted">Page not found</p>
			<Link href="/" className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper hover:opacity-90">
				← Back to the generator
			</Link>
		</main>
	);
}
