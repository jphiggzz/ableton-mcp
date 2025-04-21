import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AbletonMCP Web",
  description: "Web interface for controlling Ableton Live through MCP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50`}>{children}</body>
    </html>
  );
}
