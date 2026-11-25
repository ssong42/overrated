import type { Metadata } from "next";
import { Game } from "@/components/Game";

export const metadata: Metadata = {
  title: "Holiday Edition | Over / Under",
  description: "A festive guessing game for opinionated friends and family."
};

export default function Holiday() {
  return <main><Game edition="holiday" /></main>;
}
