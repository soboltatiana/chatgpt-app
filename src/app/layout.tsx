import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatgpt app",
  description: "My amazing personal chatgpt app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <header
            className="text-white font-bold bg-blue-600 text-2xl p-2 mb-3 shadow-gray-700 flex">
            <div className="flex flex-grow">
                <Link href="/">GPT Chat</Link>
                <Link href="/about" className="ml-5 font-light">
                    About
                </Link>
            </div>
        </header>
        <div className="flex flex-col md:flex-row">
            <div className="flex-grow">
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}
