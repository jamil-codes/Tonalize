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
  description:
    "Generate beautiful, harmonious color palettes instantly with Tonalize. Perfect for designers, developers, and creatives. Explore, customize, and export palettes with ease.",
  keywords: [
    "color palette generator",
    "color scheme tool",
    "UI design colors",
    "Next.js color app",
    "frontend developer tools",
    "color harmony",
    "Tonalize",
  ],
  authors: [{ name: "Jamil Ahmed", url: "https://github.com/jamil-codes" }],
  creator: "Jamil Ahmed",
  publisher: "Jamil Codes",
  metadataBase: new URL("https://jamil-codes.github.io"),
  alternates: {
    canonical: "https://jamil-codes.github.io/Tonalize",
  },
  openGraph: {
    type: "website",
    url: "https://jamil-codes.github.io/Tonalize",
    title: "Tonalize – Smart Color Palette Generator",
    description:
      "Generate and explore professional color palettes for design & development. Free, fast, and built with Next.js.",
    siteName: "Tonalize",
  },
  twitter: {
    card: "summary",
    title: "Tonalize – Smart Color Palette Generator",
    description:
      "Create and customize color palettes instantly. Perfect for designers & developers.",
    creator: "@jamilcodes", // replace with your Twitter if you want
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#4f46e5", // adjust to match your brand accent
  category: "design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative antialiased mx-auto bg-white text-gray-900`}
      >
        <StoreProvider>
          <Navbar />
          {children}
          <Toastify />
        </StoreProvider>
      </body>
    </html>
  );
}
