import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Over / Under",
  description: "A social guessing game for opinionated friends."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
