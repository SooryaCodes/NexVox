import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexVox",
  description: "NexVox application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased bg-black text-white min-h-screen`}
      >
        <nav className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-black/80 backdrop-blur-sm z-50">
          <h1 className="font-orbitron text-2xl font-bold text-[#0ff] glow">NexVox</h1>
          <button className="font-orbitron px-4 py-2 rounded-md border border-[#0ff]/50 text-[#0ff]">
            Settings
          </button>
        </nav>
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}