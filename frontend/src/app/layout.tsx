import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Trimurti Tours & Travels | Best Cab Service in Amravati",
    description: "Most trusted taxi service in Amravati for local, outstation, and Nagpur airport pick-up & drop.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={inter.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
