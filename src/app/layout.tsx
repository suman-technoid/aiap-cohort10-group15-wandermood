import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WanderMood — Travel by Feeling",
  description:
    "Choose your mood, get a curated trip itinerary that matches how you feel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-wm-bg text-wm-ink font-sans antialiased">
        <div className="grain" />
        {children}
      </body>
    </html>
  );
}
