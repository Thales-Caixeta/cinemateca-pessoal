"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", bg: "bg-white/10" },
  { href: "/buscar", label: "Buscar", bg: "bg-emerald-400/15" },
  { href: "/colecao", label: "Coleção", bg: "bg-amber-400/15" },
  { href: "/challenges", label: "Challenges", bg: "bg-orange-500/15" },
  { href: "/stats", label: "Estatísticas", bg: "bg-violet-400/15" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY;
      const goingDown = currentY > lastScrollY.current;

      if (goingDown && currentY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0d0f16]/80 backdrop-blur-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col items-center gap-1">
          <Image
            src="/logo.png"
            alt="Noctreel"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <span className="font-[family-name:var(--font-cinzel)] text-white text-xs tracking-[0.1em]">
            NOCTREEL
          </span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm px-4 py-2 rounded-full transition ${
                  isActive
                    ? `${item.bg} text-white`
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            aria-label="Buscar"
            className="text-neutral-400 hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-neutral-700" />
        </div>
      </div>
    </nav>
  );
}
