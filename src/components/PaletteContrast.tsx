"use client";

import { selectPalette } from "@/lib/features/pallete/palleteSlice";
import React from "react";
import { useSelector } from "react-redux";
import { getContrastRating, getContrastColorClass } from "@/lib/contrastUtils";

function PaletteContrast() {
	const palette = useSelector(selectPalette);
	const contrastRating = getContrastRating(palette.primaryColor, palette.textColor);
	const badgeClass = getContrastColorClass(contrastRating);

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm font-medium mainScheme">Contrast:</span>
			<span className={`w-14 px-2 py-1 text-xs font-semibold rounded text-center ${badgeClass}`}>{contrastRating}</span>
		</div>
	);
}

export default PaletteContrast;
