import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';
import { GetColorName } from 'hex-color-to-color-name';
import path from 'path';
import { readableColor } from 'polished';

export const generatePaletteImage = async (
    colors: string[],
    filename: string = 'palette.png'
): Promise<string> => {
    const width = 1920;
    const height = 1080;
    const footerHeight = 130; // increased height
    const colorCount = colors.length;
    const swatchWidth = width / colorCount;
    const swatchHeight = height - footerHeight;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 28px Segoe UI'; // semibold

    colors.forEach((color, i) => {
        const name = GetColorName(color.replace('#', ''));
        const textColor = readableColor(color);
        const x = i * swatchWidth;
        const centerX = x + swatchWidth / 2;

        ctx.fillStyle = color;
        ctx.fillRect(x, 0, swatchWidth, swatchHeight);

        ctx.fillStyle = textColor;
        ctx.fillText(name, centerX, swatchHeight / 2 - 30);
        ctx.fillText(color.toUpperCase(), centerX, swatchHeight / 2 + 30);
    });

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, swatchHeight, width, footerHeight);

    const svgLogo = `
    <svg width="450" height="135" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff6b6b"/>
                <stop offset="25%" stop-color="#feca57"/>
                <stop offset="50%" stop-color="#1dd1a1"/>
                <stop offset="75%" stop-color="#54a0ff"/>
                <stop offset="100%" stop-color="#5f27cd"/>
            </linearGradient>
        </defs>
        <g>
            <rect x="10" y="20" width="10" height="20" rx="2" fill="#ff6b6b"/>
            <rect x="24" y="20" width="10" height="20" rx="2" fill="#feca57"/>
            <rect x="38" y="20" width="10" height="20" rx="2" fill="#1dd1a1"/>
            <rect x="52" y="20" width="10" height="20" rx="2" fill="#54a0ff"/>
            <rect x="66" y="20" width="10" height="20" rx="2" fill="#5f27cd"/>
            <text x="85" y="38" font-family="Segoe UI, Roboto, sans-serif" font-size="24" fill="url(#gradient1)" font-weight="bold" letter-spacing="1">
                Tonalize
            </text>
        </g>
    </svg>

    `;

    const svgBuffer = Buffer.from(svgLogo);
    const svgDataUrl = 'data:image/svg+xml;base64,' + svgBuffer.toString('base64');
    const image = await loadImage(svgDataUrl);

    // Draw logo on bottom-left
    ctx.drawImage(image, 10, swatchHeight + (footerHeight - 120) / 2, 450, 135);

    const outPath = path.join(process.cwd(), 'public', filename);
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(outPath, buffer);

    return `/${filename}`;
};
