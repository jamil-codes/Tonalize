"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { ColorRole } from "../lib/palette";

interface PanelContextValue {
	controlsOpen: boolean;
	openControls: () => void;
	closeControls: () => void;
	toggleControls: () => void;
	exportOpen: boolean;
	openExport: () => void;
	closeExport: () => void;
	editingRole: ColorRole | null;
	openEdit: (role: ColorRole) => void;
	closeEdit: () => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

export function PanelProvider({ children }: { children: React.ReactNode }) {
	const [controlsOpen, setControlsOpen] = useState(false);
	const [exportOpen, setExportOpen] = useState(false);
	const [editingRole, setEditingRole] = useState<ColorRole | null>(null);

	const openControls = useCallback(() => setControlsOpen(true), []);
	const closeControls = useCallback(() => setControlsOpen(false), []);
	const toggleControls = useCallback(() => setControlsOpen((o) => !o), []);
	const openExport = useCallback(() => setExportOpen(true), []);
	const closeExport = useCallback(() => setExportOpen(false), []);
	const openEdit = useCallback((role: ColorRole) => setEditingRole(role), []);
	const closeEdit = useCallback(() => setEditingRole(null), []);

	return (
		<PanelContext.Provider
			value={{
				controlsOpen,
				openControls,
				closeControls,
				toggleControls,
				exportOpen,
				openExport,
				closeExport,
				editingRole,
				openEdit,
				closeEdit,
			}}>
			{children}
		</PanelContext.Provider>
	);
}

export function usePanels(): PanelContextValue {
	const ctx = useContext(PanelContext);
	if (!ctx) throw new Error("usePanels must be used within a PanelProvider");
	return ctx;
}
