import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { PaletteProvider } from "@/context/PaletteContext";
import { PanelProvider } from "@/context/PanelContext";
import { AppShell } from "@/components/AppShell";

// Deliberately not using next/font/google here: this app is a static export
// meant to build anywhere (including offline/sandboxed CI runners), so we
// lean on a carefully ordered native system-font stack instead of a network
// fetch at build time. See the `--font-sans` / `--font-display` tokens in
// globals.css.

export const metadata: Metadata = {
	title: "Tonalize – Smart Color Palette Generator for Designers & Developers",
	description: "Generate beautiful, WCAG-aware color palettes instantly with Tonalize. Lock colors, fine-tune HSL, check contrast, and export to CSS, SCSS, Tailwind, JSON, PNG or SVG — all in your browser.",
	keywords: ["color palette generator", "color scheme tool", "UI design colors", "Next.js color app", "frontend developer tools", "color harmony", "Tonalize"],
	authors: [{ name: "Jamil Ahmed", url: "https://github.com/jamil-codes" }],
	creator: "Jamil Ahmed",
	publisher: "Jamil Codes",
	icons: {
		icon: "Toanlize/favicon.svg",
	},
	category: "design",
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fafaf9" },
		{ media: "(prefers-color-scheme: dark)", color: "#121214" },
	],
};

// Runs before React hydrates so the page never flashes the wrong theme.
const themeBootScript = `
(function () {
	try {
		var raw = window.localStorage.getItem("tonalize:theme:v1");
		var theme = raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
		var resolved = theme === "system" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme;
		document.documentElement.setAttribute("data-theme", resolved);
		document.documentElement.style.colorScheme = resolved;
	} catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
			</head>
			<body className="relative font-sans antialiased">
				<ThemeProvider>
					<ToastProvider>
						<PaletteProvider>
							<PanelProvider>
								<Navbar />
								<AppShell>{children}</AppShell>
							</PanelProvider>
						</PaletteProvider>
					</ToastProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
