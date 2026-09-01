import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Associative Memory & Linear Recurrence in Fast-Weight Architectures | Pathway 2026",
  description:
    "An interactive, research-grounded scientific platform exploring associative memory, key cross-talk interference, and the Dragon Hatchling (BDH) synaptic plasticity solution.",
  keywords: [
    "Pathway",
    "Associative Memory",
    "Fast Weights",
    "Linear Attention",
    "Dragon Hatchling",
    "BDH",
    "BDH-CQ",
    "Recurrent Neural Networks",
    "Transformers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#08090C] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
