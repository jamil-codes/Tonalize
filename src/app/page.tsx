"use client";

import RandomizeButton from "@/components/RandomizeButton";
import { useEffect, useRef, useState } from "react";
import { ColorName, generateColorPallete, GetSecondaryText, HSLToHex } from "../lib/GenerateColorPllete";
import { readableColor } from "polished";
import copy from "copy-to-clipboard";
import { Toast } from "@/components/Toastify";
import { HSL } from "colors-convert/dist/cjs/lib/types/types";
import { useSelector, useDispatch } from "react-redux";
import { selectPalette, setPalette } from "@/lib/features/pallete/palleteSlice";

export default function Home() {
	const dispatch = useDispatch();
	const palette = useSelector(selectPalette);

	useEffect(() => {
		dispatch(setPalette(generateColorPallete()));
	}, [dispatch]);

	const box1Ref = useRef<HTMLDivElement>(null);
	const box2Ref = useRef<HTMLDivElement>(null);
	const box3Ref = useRef<HTMLDivElement>(null);
	const box4Ref = useRef<HTMLDivElement>(null);
	const box5Ref = useRef<HTMLDivElement>(null);

	const CopyColor = (hsl: HSL) => {
		const color = HSLToHex(hsl);
		copy(color);
		Toast(`${color} copied to clipboard`, "dark");
	};

	return (
		<>
			<main className={`w-dvw h-dvh`}>
				<div className="boxes pt-32 sm:pt-16 border-collapse relative h-full w-full  flex flex-col sm:flex-row mainScheme">
					<div
						ref={box1Ref}
						onClick={() => CopyColor(palette.primaryColor)}
						className="box  bg-[#1E6876]"
						style={{ backgroundColor: HSLToHex(palette.primaryColor), color: readableColor(HSLToHex(palette.primaryColor)) }}>
						<div className="text">
							<p className="title">Primary</p>
							<p
								className="name"
								style={{ color: GetSecondaryText(palette.primaryColor) }}>
								{ColorName(palette.primaryColor)}
							</p>
							<p
								className="hex"
								style={{ color: GetSecondaryText(palette.primaryColor) }}>
								{HSLToHex(palette.primaryColor)}
							</p>
						</div>
					</div>

					<div
						ref={box2Ref}
						onClick={() => CopyColor(palette.secondaryColor)}
						className="box  bg-[#207A97]"
						style={{ backgroundColor: HSLToHex(palette.secondaryColor), color: readableColor(HSLToHex(palette.secondaryColor)) }}>
						<div className="text">
							<p className="title">Secondary</p>
							<p
								className="name"
								style={{ color: GetSecondaryText(palette.secondaryColor) }}>
								{ColorName(palette.secondaryColor)}
							</p>
							<p
								className="hex"
								style={{ color: GetSecondaryText(palette.secondaryColor) }}>
								{HSLToHex(palette.secondaryColor)}
							</p>
						</div>
					</div>

					<div
						ref={box3Ref}
						onClick={() => CopyColor(palette.complementaryColor)}
						className="box  bg-[#762D1E] text-black"
						style={{ backgroundColor: HSLToHex(palette.complementaryColor), color: readableColor(HSLToHex(palette.complementaryColor)) }}>
						<div className="text">
							<p className="title">Complementary</p>
							<p
								className="name"
								style={{ color: GetSecondaryText(palette.complementaryColor) }}>
								{ColorName(palette.complementaryColor)}
							</p>
							<p
								className="hex"
								style={{ color: GetSecondaryText(palette.complementaryColor) }}>
								{HSLToHex(palette.complementaryColor)}
							</p>
						</div>
					</div>

					<div
						ref={box4Ref}
						onClick={() => CopyColor(palette.textColor)}
						className="box  bg-[#FFFFFF] "
						style={{ backgroundColor: HSLToHex(palette.textColor), color: readableColor(HSLToHex(palette.textColor)) }}>
						<div className="text">
							<p className="title">Text</p>
							<p
								className="name"
								style={{ color: GetSecondaryText(palette.textColor) }}>
								{ColorName(palette.textColor)}
							</p>
							<p
								className="hex"
								style={{ color: GetSecondaryText(palette.textColor) }}>
								{HSLToHex(palette.textColor)}
							</p>
						</div>
					</div>

					<div
						ref={box5Ref}
						onClick={() => CopyColor(palette.textSecondaryColor)}
						className="box  bg-[#B2BCBD] "
						style={{ backgroundColor: HSLToHex(palette.textSecondaryColor), color: readableColor(HSLToHex(palette.textSecondaryColor)) }}>
						<div className="text">
							<p className="title">Text Secondary</p>
							<p
								className="name"
								style={{ color: GetSecondaryText(palette.textSecondaryColor) }}>
								{ColorName(palette.textSecondaryColor)}
							</p>
							<p
								className="hex"
								style={{ color: GetSecondaryText(palette.textSecondaryColor) }}>
								{HSLToHex(palette.textSecondaryColor)}
							</p>
						</div>
					</div>
				</div>
			</main>

			<RandomizeButton
				OnClick={() => {
					dispatch(setPalette(generateColorPallete()));
				}}
			/>
		</>
	);
}
