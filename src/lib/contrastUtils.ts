import { getContrast } from "polished";
import { hslToHex } from "colors-convert";
import { HSL } from "colors-convert/dist/cjs/lib/types/types";

export function getContrastRating(bg: HSL, text: HSL, isLargeText = false): "Poor" | "AA" | "AAA" {
    const contrast = getContrast(hslToHex(bg), hslToHex(text));
    if (contrast >= 7) return "AAA";
    if (contrast >= (isLargeText ? 3 : 4.5)) return "AA";
    return "Poor";
}


export function getContrastColorClass(rating: "Poor" | "AA" | "AAA"): string {
    switch (rating) {
        case "AAA":
            return "bg-green-100 text-green-700";
        case "AA":
            return "bg-yellow-100 text-yellow-700";
        case "Poor":
        default:
            return "bg-red-100 text-red-600";
    }
}
