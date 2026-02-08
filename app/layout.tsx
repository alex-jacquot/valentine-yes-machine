import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yes Machine – Valentine’s Game",
  description: "A playful Valentine’s game where Yes always wins.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

