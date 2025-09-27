import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Toastify from "@/components/Toastify";
import StoreProvider from "./StoreProvider";

const inter = Inter({
	variable: "--font-inter-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tonalize – Smart Color Palette Generator for Designers & Developers",
	description: "Generate beautiful color palettes instantly with Tonalize. Perfect for designers, developers, and creatives. Explore, customize, and export palettes with ease.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} relative antialiased  mx-auto`}>
				<StoreProvider>
					<Navbar />
					{children}
					<Toastify />
				</StoreProvider>
			</body>
		</html>
	);
}
