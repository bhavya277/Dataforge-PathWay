import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Associative Memory & Linear Recurrence in Fast-Weight Architectures | Pathway 2026",
  description:
    "An interactive, research-grounded scientific platform exploring associative memory, key cross-talk interference, and conceptual connections to Dragon Hatchling (BDH) sparse synaptic plasticity.",
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
    <html lang="en">
      <body className="min-h-screen bg-[#F7F7F4] text-[#111318] antialiased selection:bg-[#0284C7]/20">
        {children}
      </body>
    </html>
  );
}
