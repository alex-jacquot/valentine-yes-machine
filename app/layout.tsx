import "./globals.css";
import type { Metadata } from "next";

const TITLE = "Yes Machine – Valentine’s Game";
const DESCRIPTION = "A playful Valentine’s game where Yes always wins.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    // You can replace this with a dedicated 1200x630 PNG in /public
    images: [
      {
        url: "/preview.png",
        width: 800,
        height: 600,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/preview.png"],
  },
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

