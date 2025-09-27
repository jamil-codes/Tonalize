import { colorToHex, hexToHsl, hslToHex, rgbToHsl } from 'colors-convert';
import type { Color, HEX, HSL } from 'colors-convert/dist/cjs/lib/types/types';
import random from 'random';
import clamp from "just-clamp";
import { readableColor, getContrast, mix } from 'polished';
import { GetColorName } from 'hex-color-to-color-name';
const compColors = require('complementary-colors');

export interface colorPalleteInterface {
    primaryColor: HSL,
    secondaryColor: HSL,
    complementaryColor: HSL,
    textColor: HSL,
    textSecondaryColor: HSL,
}

export const generateRandomNumber = (min: number, max: number) => {
    return random.int(min, max);
};

export const ColorName = (color: Color): string => {

    if (color as HSL) {
        const hex = HSLToHex(color as HSL)
        return GetColorName(hex.replace("#", ""))
    }
    const hex = colorToHex(color)
    return GetColorName(hex.replace("#", ""))
}

export const GetSecondaryText = (primaryColor: HSL, blend = 0.8): HEX => {
    const secondaryText = mix(blend, readableColor(HSLToHex(primaryColor)), HSLToHex(primaryColor))

    return secondaryText
}

const sanitizeHSL = (hsl: HSL): HSL => ({
    h: clamp(hsl.h, 0, 359),
    s: clamp(hsl.s, 0, 100),
    l: clamp(hsl.l, 0, 100),
});


export const HSLToHex = (hsl: HSL): HEX => {
    return hslToHex(sanitizeHSL(hsl))
}


function getRandomInEitherRange() {
    const useLowRange = Math.random() < 0.5;
    const [min, max] = useLowRange ? [5, 25] : [80, 90];
    return random.int(min, max);
}



function getContrastRating(bg: HSL, text: HSL): "Poor" | "AA" | "AAA" {
    const bgHex = hslToHex(bg);
    const textHex = hslToHex(text);
    const contrast = getContrast(bgHex, textHex);
    if (contrast >= 7) return "AAA";
    if (contrast >= 4.5) return "AA";
    return "Poor";
}

export const generateColorPallete = (attempts: number = 0): colorPalleteInterface => {
    const MaxAttempts = 30;
    const StrictPassAttempts = 15;

    let palette: colorPalleteInterface = {
        primaryColor: { h: 0, s: 0, l: 100 },
        secondaryColor: { h: 0, s: 0, l: 100 },
        complementaryColor: { h: 180, s: 0, l: 100 },
        textColor: { h: 0, s: 0, l: 100 },
        textSecondaryColor: { h: 0, s: 0, l: 100 },
    }

    const generate = (): colorPalleteInterface => {
        // Primary Color
        const primaryHSL = { h: generateRandomNumber(0, 359), s: generateRandomNumber(10, 90), l: getRandomInEitherRange() };

        // Secondary Color
        const secondaryHSL = {
            h: clamp(primaryHSL.h + generateRandomNumber(-7, 7), 0, 359),
            s: clamp((primaryHSL.s + generateRandomNumber(-10, 10)), 1, 100),
            l: clamp(primaryHSL.l + generateRandomNumber(3, 9), 0, 100)
        };

        // Complementary Color
        const myColor = new compColors(HSLToHex(primaryHSL));
        const complementaryHSL = rgbToHsl(myColor.complementary()[1]);

        // Primary Text Color
        const primaryTextColor = hexToHsl(readableColor(HSLToHex(primaryHSL)));

        // Secondary Text Color
        const secondaryTextColor = hexToHsl(GetSecondaryText(primaryHSL));

        return {
            primaryColor: sanitizeHSL(primaryHSL),
            secondaryColor: sanitizeHSL(secondaryHSL),
            complementaryColor: sanitizeHSL(complementaryHSL),
            textColor: sanitizeHSL(primaryTextColor),
            textSecondaryColor: sanitizeHSL(secondaryTextColor)
        };
    };

    while (attempts < MaxAttempts) {
        attempts++;
        palette = generate();

        const rating = getContrastRating(palette.primaryColor, palette.textColor);

        if (rating === "AAA") break;
        if (rating === "AA" && attempts >= StrictPassAttempts) break;
    }





    console.clear();
    console.log(
        `%c ${ColorName(palette.primaryColor)} : ${HSLToHex(palette.primaryColor)} ` +
        `%c ${ColorName(palette.secondaryColor)} : ${HSLToHex(palette.secondaryColor)} ` +
        `%c ${ColorName(palette.complementaryColor)} : ${HSLToHex(palette.complementaryColor)} ` +
        `%c ${ColorName(palette.textColor)} : ${HSLToHex(palette.textColor)} ` +
        `%c ${ColorName(palette.textSecondaryColor)} : ${HSLToHex(palette.textSecondaryColor)} `,


        `background: ${HSLToHex(palette.primaryColor)}; color: ${readableColor(HSLToHex(palette.primaryColor))}; padding: 10px 10px; `,
        `background: ${HSLToHex(palette.secondaryColor)}; color: ${readableColor(HSLToHex(palette.secondaryColor))}; padding: 10px 10px; `,
        `background: ${HSLToHex(palette.complementaryColor)}; color: ${readableColor(HSLToHex(palette.complementaryColor))}; padding: 10px 10px; `,
        `background: ${HSLToHex(palette.textColor)}; color: ${readableColor(HSLToHex(palette.textColor))}; padding: 10px 10px; `,
        `background: ${HSLToHex(palette.textSecondaryColor)}; color: ${readableColor(HSLToHex(palette.textSecondaryColor))}; padding: 10px 10px; `


    );

    return palette!;
};
