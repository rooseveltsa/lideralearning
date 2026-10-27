"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/treinamento/modulo-1", label: "Treinamento" },
  { href: "/cursos", label: "Academy" },
  { href: "/empresas", label: "Para empresas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const darkHeroRoutes = ["/empresas", "/cursos", "/treinamento", "/pricing"];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasDarkHero = useMemo(
    () =>
      darkHeroRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      ),
    [pathname],
  );
  const isDark = hasDarkHero;

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        borderBottom: `1px solid ${isDark ? "rgba(245,241,234,0.10)" : "rgba(12,23,41,0.10)"}`,
        background: isDark ? "#070e1c" : "#f5f1ea",
      }}
    >
      <div
        className="ld-mw-xl flex items-center justify-between"
        style={{ height: 76 }}
      >
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            {/* Marca oficial Lidera */}
            <Image
              src="/brand/lidera-mark.png"
              alt=""
              width={38}
              height={26}
              priority
              aria-hidden
            />
            <span
              className="font-sans text-xl font-bold tracking-tight"
              style={{
                color: isDark ? "#f5f1ea" : "#070e1c",
                letterSpacing: "-0.02em",
              }}
            >
              Lidera
            </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center text-sm font-medium transition-opacity hover:opacity-100"
                style={{
                  color: isDark ? "#f5f1ea" : "#070e1c",
                  opacity: pathname === link.href ? 1 : 0.78,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/auth/login"
            className="rounded-[10px] px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: isDark ? "#f5f1ea" : "#070e1c",
              opacity: 0.78,
            }}
          >
            Área do aluno
          </Link>
          <Link href="/cursos" className="institutional-button">
            Ver treinamentos
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex size-11 items-center justify-center rounded-lg lg:hidden"
          style={{ color: isDark ? "#f5f1ea" : "#070e1c" }}
          aria-label={isMobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMobileOpen}
          aria-controls="site-mobile-menu"
          onClick={() => setIsMobileOpen((v) => !v)}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          id="site-mobile-menu"
          className="space-y-2 border-t px-6 py-4 lg:hidden"
          style={{
            borderColor: isDark
              ? "rgba(245,241,234,0.10)"
              : "rgba(12,23,41,0.10)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium"
              style={{ color: isDark ? "#f5f1ea" : "#070e1c" }}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="mt-3 space-y-2 border-t pt-3"
            style={{
              borderColor: isDark
                ? "rgba(245,241,234,0.10)"
                : "rgba(12,23,41,0.10)",
            }}
          >
            <Link
              href="/auth/login"
              onClick={() => setIsMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium"
              style={{ color: isDark ? "rgba(245,241,234,0.78)" : "#070e1c" }}
            >
              Área do aluno
            </Link>
            <Link
              href="/cursos"
              onClick={() => setIsMobileOpen(false)}
              className="institutional-button w-full text-center"
              style={{ borderRadius: "0.5rem" }}
            >
              Ver treinamentos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
