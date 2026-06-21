"use client";

import { Check, Copy, Download, Image as ImageIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { usePalette } from "../context/PaletteContext";
import { useToast } from "../context/ToastContext";
import {
	buildSwatchInfo,
	copyText,
	downloadText,
	exportPng,
	exportSvg,
	toCopyAllHex,
	toCopyAllLabeled,
	toCssVariables,
	toJsonExport,
	toScssVariables,
	toTailwindV3Config,
	toTailwindV4Theme,
} from "../lib/exportPalette";

type FormatKey = "css" | "scss" | "tailwind4" | "tailwind3" | "json";

const FORMATS: { key: FormatKey; label: string; filename: string; mime: string }[] = [
	{ key: "css", label: "CSS variables", filename: "tonalize-palette.css", mime: "text/css" },
	{ key: "scss", label: "SCSS variables", filename: "tonalize-palette.scss", mime: "text/x-scss" },
	{ key: "tailwind4", label: "Tailwind v4 @theme", filename: "tonalize-theme.css", mime: "text/css" },
	{ key: "tailwind3", label: "Tailwind v3 config", filename: "tailwind.colors.js", mime: "text/javascript" },
	{ key: "json", label: "JSON tokens", filename: "tonalize-palette.json", mime: "application/json" },
];

export function ExportPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { colors } = usePalette();
	const { toast } = useToast();
	const [active, setActive] = useState<FormatKey>("css");
	const [busy, setBusy] = useState(false);

	const swatches = useMemo(() => buildSwatchInfo(colors), [colors]);

	const content = useMemo(() => {
		switch (active) {
			case "css":
				return toCssVariables(swatches);
			case "scss":
				return toScssVariables(swatches);
			case "tailwind4":
				return toTailwindV4Theme(colors);
			case "tailwind3":
				return toTailwindV3Config(colors);
			case "json":
				return toJsonExport(swatches, "Tonalize palette");
		}
	}, [active, swatches, colors]);

	if (!open) return null;

	const activeFormat = FORMATS.find((f) => f.key === active)!;

	const handleCopy = async () => {
		const ok = await copyText(content);
		toast(ok ? "Copied to clipboard" : "Couldn't copy", ok ? "success" : "error");
	};

	const handleDownloadSnippet = () => {
		downloadText(content, activeFormat.filename, activeFormat.mime);
		toast(`Downloaded ${activeFormat.filename}`, "success");
	};

	const handleCopyAllHex = async () => {
		const ok = await copyText(toCopyAllHex(swatches));
		toast(ok ? "Hex codes copied" : "Couldn't copy", ok ? "success" : "error");
	};

	const handleCopyAllLabeled = async () => {
		const ok = await copyText(toCopyAllLabeled(swatches));
		toast(ok ? "Labeled list copied" : "Couldn't copy", ok ? "success" : "error");
	};

	const handlePng = async () => {
		setBusy(true);
		try {
			await exportPng(swatches);
			toast("PNG downloaded", "success");
		} catch {
			toast("Couldn't generate PNG", "error");
		} finally {
			setBusy(false);
		}
	};

	const handleSvg = () => {
		exportSvg(swatches);
		toast("SVG downloaded", "success");
	};

	return (
		<div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40 sm:items-center sm:p-4 animate-fade-in" onClick={onClose} role="presentation">
			<div
				className="thin-scroll flex max-h-[88vh] w-full flex-col overflow-y-auto rounded-t-2xl border border-border bg-surface text-ink shadow-2xl sm:max-w-lg sm:rounded-2xl"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label="Export palette">
				<div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
					<h2 className="font-display text-base font-semibold">Export palette</h2>
					<button type="button" onClick={onClose} className="rounded-md p-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink" aria-label="Close export panel">
						<X size={18} />
					</button>
				</div>

				<div className="flex flex-col gap-5 p-5">
					{/* Image exports */}
					<div>
						<h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Image</h3>
						<div className="flex gap-2">
							<button type="button" disabled={busy} onClick={handlePng} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2.5 text-xs font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-50">
								<ImageIcon size={14} /> Download PNG
							</button>
							<button type="button" onClick={handleSvg} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold text-ink hover:bg-surface-2">
								<Download size={14} /> Download SVG
							</button>
						</div>
						<p className="mt-2 text-[11px] text-ink-faint">Rendered entirely in your browser via Canvas/SVG — no server involved.</p>
					</div>

					{/* Quick copy */}
					<div>
						<h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Quick copy</h3>
						<div className="flex gap-2">
							<button type="button" onClick={handleCopyAllHex} className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2">
								Hex list
							</button>
							<button type="button" onClick={handleCopyAllLabeled} className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-ink hover:bg-surface-2">
								Labeled list
							</button>
						</div>
					</div>

					{/* Code snippets */}
					<div>
						<h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">Code</h3>
						<div className="mb-2.5 flex flex-wrap gap-1.5">
							{FORMATS.map((f) => (
								<button
									key={f.key}
									type="button"
									onClick={() => setActive(f.key)}
									className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${active === f.key ? "border-ink bg-ink text-paper" : "border-border text-ink-muted hover:text-ink"}`}>
									{f.label}
								</button>
							))}
						</div>
						<div className="relative">
							<pre className="thin-scroll max-h-56 overflow-auto rounded-lg border border-border bg-paper p-3 font-mono text-[11px] leading-relaxed text-ink">
								<code>{content}</code>
							</pre>
						</div>
						<div className="mt-2 flex gap-2">
							<button type="button" onClick={handleCopy} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-paper hover:opacity-90">
								<Copy size={13} /> Copy
							</button>
							<button type="button" onClick={handleDownloadSnippet} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-2">
								<Download size={13} /> Download file
							</button>
						</div>
					</div>

					<div className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-[11px] text-ink-muted">
						<Check size={13} className="shrink-0" />
						Everything here runs locally — nothing is uploaded anywhere.
					</div>
				</div>
			</div>
		</div>
	);
}
