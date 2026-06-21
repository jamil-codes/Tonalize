"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react"
import { HSL, hexToHsl, sanitizeHSL } from "../lib/color"
import { ColorRole, DEFAULT_LOCKS, FALLBACK_PALETTE, HarmonyMode, LockState, PaletteColors, clonePalette, generatePalette } from "../lib/palette"
import { SavedPalette, addSavedPalette, loadLastState, loadSavedPalettes, removeSavedPalette, saveLastState } from "../lib/storage"
import { decodePaletteParam } from "../lib/urlShare"

const HISTORY_LIMIT = 50

interface State {
	colors: PaletteColors
	locked: LockState
	harmony: HarmonyMode
	past: PaletteColors[]
	future: PaletteColors[]
	saved: SavedPalette[]
	hydrated: boolean
}

type Action = { type: "HYDRATE"; colors: PaletteColors; locked: LockState; harmony: HarmonyMode; saved: SavedPalette[] } | { type: "RANDOMIZE" } | { type: "SET_HARMONY"; harmony: HarmonyMode } | { type: "TOGGLE_LOCK"; role: ColorRole } | { type: "SET_ALL_LOCKS"; locked: boolean } | { type: "SET_COLOR"; role: ColorRole; hsl: HSL } | { type: "UNDO" } | { type: "REDO" } | { type: "LOAD_PALETTE"; colors: PaletteColors; harmony: HarmonyMode } | { type: "SAVE_CURRENT"; name: string } | { type: "DELETE_SAVED"; id: string }

const initialState: State = {
	colors: clonePalette(FALLBACK_PALETTE),
	locked: { ...DEFAULT_LOCKS },
	harmony: "auto",
	past: [],
	future: [],
	saved: [],
	hydrated: false,
}

const pushHistory = (state: State, nextColors: PaletteColors): Pick<State, "past" | "future" | "colors"> => ({
	past: [...state.past, state.colors].slice(-HISTORY_LIMIT),
	future: [],
	colors: nextColors,
})

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case "HYDRATE":
			return {
				...state,
				colors: action.colors,
				locked: action.locked,
				harmony: action.harmony,
				saved: action.saved,
				hydrated: true,
			}

		case "RANDOMIZE": {
			const next = generatePalette({ harmony: state.harmony, locked: state.locked, current: state.colors })
			return { ...state, ...pushHistory(state, next) }
		}

		case "SET_HARMONY":
			return { ...state, harmony: action.harmony }

		case "TOGGLE_LOCK":
			return { ...state, locked: { ...state.locked, [action.role]: !state.locked[action.role] } }

		case "SET_ALL_LOCKS": {
			const locked = { ...state.locked }
			;(Object.keys(locked) as ColorRole[]).forEach((r) => (locked[r] = action.locked))
			return { ...state, locked }
		}

		case "SET_COLOR": {
			const nextColors: PaletteColors = { ...state.colors, [action.role]: sanitizeHSL(action.hsl) }
			return {
				...state,
				...pushHistory(state, nextColors),
				locked: { ...state.locked, [action.role]: true },
			}
		}

		case "UNDO": {
			if (state.past.length === 0) return state
			const previous = state.past[state.past.length - 1]
			return {
				...state,
				past: state.past.slice(0, -1),
				future: [state.colors, ...state.future].slice(0, HISTORY_LIMIT),
				colors: previous,
			}
		}

		case "REDO": {
			if (state.future.length === 0) return state
			const [next, ...rest] = state.future
			return {
				...state,
				past: [...state.past, state.colors].slice(-HISTORY_LIMIT),
				future: rest,
				colors: next,
			}
		}

		case "LOAD_PALETTE": {
			return {
				...state,
				...pushHistory(state, action.colors),
				harmony: action.harmony,
				locked: { ...DEFAULT_LOCKS },
			}
		}

		case "SAVE_CURRENT": {
			const saved = addSavedPalette(action.name, state.colors, state.harmony)
			return { ...state, saved }
		}

		case "DELETE_SAVED": {
			const saved = removeSavedPalette(action.id)
			return { ...state, saved }
		}

		default:
			return state
	}
}

interface PaletteContextValue {
	colors: PaletteColors
	locked: LockState
	harmony: HarmonyMode
	saved: SavedPalette[]
	hydrated: boolean
	canUndo: boolean
	canRedo: boolean
	randomize: () => void
	setHarmony: (h: HarmonyMode) => void
	toggleLock: (role: ColorRole) => void
	lockAll: () => void
	unlockAll: () => void
	setColorHsl: (role: ColorRole, hsl: HSL) => void
	setColorHex: (role: ColorRole, hex: string) => void
	undo: () => void
	redo: () => void
	loadPalette: (colors: PaletteColors, harmony: HarmonyMode) => void
	savePalette: (name: string) => void
	deleteSaved: (id: string) => void
}

const PaletteContext = createContext<PaletteContextValue | null>(null)

export function PaletteProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState)

	// Hydrate once on mount: shared URL takes priority, then last-session
	// localStorage state, then the built-in fallback palette.
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const shared = params.get("p")
		const fromUrl = shared ? decodePaletteParam(shared) : null

		const last = loadLastState()
		const saved = loadSavedPalettes()

		if (fromUrl) {
			dispatch({ type: "HYDRATE", colors: fromUrl.colors, locked: { ...DEFAULT_LOCKS }, harmony: fromUrl.harmony, saved })
			// Clean the shareable param out of the visible URL after consuming it.
			const url = new URL(window.location.href)
			url.searchParams.delete("p")
			window.history.replaceState({}, "", url.toString())
		} else if (last) {
			dispatch({ type: "HYDRATE", colors: last.colors, locked: last.locked, harmony: last.harmony, saved })
		} else {
			const fresh = generatePalette({ harmony: "auto", locked: DEFAULT_LOCKS, current: FALLBACK_PALETTE })
			dispatch({ type: "HYDRATE", colors: fresh, locked: { ...DEFAULT_LOCKS }, harmony: "auto", saved })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Persist working state (debounced via microtask) any time it changes post-hydration.
	useEffect(() => {
		if (!state.hydrated) return
		saveLastState({ colors: state.colors, locked: state.locked, harmony: state.harmony })
	}, [state.hydrated, state.colors, state.locked, state.harmony])

	const randomize = useCallback(() => dispatch({ type: "RANDOMIZE" }), [])
	const setHarmony = useCallback((h: HarmonyMode) => dispatch({ type: "SET_HARMONY", harmony: h }), [])
	const toggleLock = useCallback((role: ColorRole) => dispatch({ type: "TOGGLE_LOCK", role }), [])
	const lockAll = useCallback(() => dispatch({ type: "SET_ALL_LOCKS", locked: true }), [])
	const unlockAll = useCallback(() => dispatch({ type: "SET_ALL_LOCKS", locked: false }), [])
	const setColorHsl = useCallback((role: ColorRole, hsl: HSL) => dispatch({ type: "SET_COLOR", role, hsl }), [])
	const setColorHex = useCallback((role: ColorRole, hex: string) => dispatch({ type: "SET_COLOR", role, hsl: hexToHsl(hex) }), [])
	const undo = useCallback(() => dispatch({ type: "UNDO" }), [])
	const redo = useCallback(() => dispatch({ type: "REDO" }), [])
	const loadPalette = useCallback((colors: PaletteColors, harmony: HarmonyMode) => dispatch({ type: "LOAD_PALETTE", colors, harmony }), [])
	const savePalette = useCallback((name: string) => dispatch({ type: "SAVE_CURRENT", name }), [])
	const deleteSaved = useCallback((id: string) => dispatch({ type: "DELETE_SAVED", id }), [])

	const value = useMemo<PaletteContextValue>(
		() => ({
			colors: state.colors,
			locked: state.locked,
			harmony: state.harmony,
			saved: state.saved,
			hydrated: state.hydrated,
			canUndo: state.past.length > 0,
			canRedo: state.future.length > 0,
			randomize,
			setHarmony,
			toggleLock,
			lockAll,
			unlockAll,
			setColorHsl,
			setColorHex,
			undo,
			redo,
			loadPalette,
			savePalette,
			deleteSaved,
		}),
		[state, randomize, setHarmony, toggleLock, lockAll, unlockAll, setColorHsl, setColorHex, undo, redo, loadPalette, savePalette, deleteSaved],
	)

	return <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
}

export function usePalette(): PaletteContextValue {
	const ctx = useContext(PaletteContext)
	if (!ctx) throw new Error("usePalette must be used within a PaletteProvider")
	return ctx
}
