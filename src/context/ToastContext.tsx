"use client";

import { Check, X as XIcon, AlertTriangle, Info } from "lucide-react";
import React, { createContext, useCallback, useContext, useState } from "react";

export type ToastKind = "success" | "error" | "info";

interface ToastItem {
	id: number;
	message: string;
	kind: ToastKind;
}

interface ToastContextValue {
	toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
	const [items, setItems] = useState<ToastItem[]>([]);

	const dismiss = useCallback((id: number) => {
		setItems((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const toast = useCallback(
		(message: string, kind: ToastKind = "info") => {
			const id = nextId++;
			setItems((prev) => [...prev, { id, message, kind }].slice(-4));
			window.setTimeout(() => dismiss(id), 2600);
		},
		[dismiss]
	);

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4 sm:bottom-6">
				{items.map((t) => (
					<div
						key={t.id}
						role="status"
						className="animate-toast-in pointer-events-auto flex max-w-sm items-center gap-2 rounded-full border border-border bg-ink px-4 py-2 text-xs font-medium text-paper shadow-lg">
						{t.kind === "success" && <Check size={14} className="shrink-0 text-emerald-400" />}
						{t.kind === "error" && <AlertTriangle size={14} className="shrink-0 text-rose-400" />}
						{t.kind === "info" && <Info size={14} className="shrink-0 text-sky-400" />}
						<span className="truncate">{t.message}</span>
						<button type="button" onClick={() => dismiss(t.id)} className="ml-1 shrink-0 opacity-60 hover:opacity-100" aria-label="Dismiss notification">
							<XIcon size={12} />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast(): ToastContextValue {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within a ToastProvider");
	return ctx;
}
