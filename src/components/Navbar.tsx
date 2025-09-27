"use client";
import Link from "next/link";
import PaletteContrast from "./PaletteContrast";
import { generateColorPallete } from "@/lib/GenerateColorPllete";
import { useSelector } from "react-redux";
import { selectPalette } from "@/lib/features/pallete/palleteSlice";
import { hslToHex } from "colors-convert";

function Navbar() {
	const palette = useSelector(selectPalette);
	// const handleSubmit = async () => {
	// 	const colors = [hslToHex(palette.primaryColor), hslToHex(palette.secondaryColor), hslToHex(palette.complementaryColor), hslToHex(palette.textColor), hslToHex(palette.textSecondaryColor)];

	// 	try {
	// 		const res = await fetch("/api/savepng", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify({ colors }),
	// 		});

	// 		const data = await res.json();

	// 		if (res.ok && data.url) {
	// 			const link = document.createElement("a");
	// 			link.href = data.url;
	// 			link.download = "color-palette.png"; // Suggested file name
	// 			document.body.appendChild(link);
	// 			link.click();
	// 			document.body.removeChild(link);
	// 		} else {
	// 			console.error("Failed to generate image:", data.error || "Unknown error");
	// 		}
	// 	} catch (err) {
	// 		console.error("Error generating image:", err);
	// 	}
	// };
	return (
		<header className="fixed z-40 top-[-0.01rem] h-32 pb-3 sm:h-16  inset-x-0  mainScheme shadow-md px-4 sm:px-10 md:px-16 box-border pt-3 flex flex-col sm:flex-row  gap-5 items-center justify-between">
			<div>
				{/* <div className="relative Logo w-60 h-14 ">
						<Image
                        className="object-contain"
                        src={"/toonalize.svg"}
                        fill={true}
                        alt={"Tonalize logo: dark-gray painter’s palette with four colored wells"}
						/>
                        </div> */}
				<Link href="/">
					<h1 className="text-sm sm:text-lg font-bold tracking-tight text-nowrap">Toonalize</h1>
					<p className="text-sm text-gray-500">WCAG Compliant Palette Generator</p>
				</Link>
			</div>
			<div className="flex items-center gap-2 ">
				<PaletteContrast />
				{/* <button
					className="ml-4 p-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-nowrap rounded"
					onClick={async () => {
						await handleSubmit();
					}}
					aria-label="Save Palette PNG">
					Save PNG
				</button> */}
			</div>
		</header>
	);
}

export default Navbar;
