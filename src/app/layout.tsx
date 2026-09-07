import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel_Decorative } from "next/font/google";
import Navbar from "@/components/Navbar";
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

export const metadata: Metadata = {
  title: "Noctreel",
  description: "App pessoal para catalogar e acompanhar filmes assistidos",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzelDecorative.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col text-white pt-28 relative"
        style={{ backgroundColor: "#171b24" }}
      >
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 600px 900px at 0% 40%, rgba(120, 140, 200, 0.12), transparent), radial-gradient(ellipse 600px 900px at 100% 60%, rgba(120, 140, 200, 0.12), transparent)",
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
