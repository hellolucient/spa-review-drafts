import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spa Review Reply Drafts",
  description: "Generate professional reply drafts for spa reviews",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
