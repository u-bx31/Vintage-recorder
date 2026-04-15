import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css"; // Global styles
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: "Vintage Vinyl Player",
	description:
		"A modern-classic music player with realistic vinyl animations.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={cn(playfair.variable, "font-sans", geist.variable)}>
			<body
				suppressHydrationWarning
				className="font-sans antialiased text-amber-950 bg-amber-50 selection:bg-amber-900 selection:text-amber-50">
				<Toaster />
        {children}
			</body>
		</html>
	);
}
