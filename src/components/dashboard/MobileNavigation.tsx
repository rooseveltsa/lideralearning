"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarNav from "./SidebarNav";
import { logout } from "@/app/auth/actions";

export default function MobileNavigation({
  isAdmin,
  role,
}: {
  isAdmin: boolean;
  role: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={
          open ? "Fechar menu de navegação" : "Abrir menu de navegação"
        }
        aria-expanded={open}
        aria-controls="student-mobile-menu"
        onClick={() => setOpen(!open)}
        className="flex size-11 items-center justify-center rounded-lg border border-learning-border text-learning-text"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div
          id="student-mobile-menu"
          className="absolute inset-x-0 top-full max-h-[75dvh] overflow-y-auto border-b border-learning-border bg-learning-bg shadow-xl"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        >
          <SidebarNav
            isAdmin={isAdmin}
            role={role}
            onNavigate={() => setOpen(false)}
          />
          <form action={logout} className="border-t border-learning-border p-4">
            <button className="min-h-11 w-full rounded-lg px-3 text-left text-sm text-learning-muted">
              Sair da conta
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
