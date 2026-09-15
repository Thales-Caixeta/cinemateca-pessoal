import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cinzel_Decorative,
  Fraunces,
} from "next/font/google";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: "700",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Noctreel",
  description: "Personal app to catalog and track watched movies",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzelDecorative.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col text-white pt-23 relative"
        style={{ backgroundColor: "#171b24" }}
      >
        <AmbientBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
