"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  House,
  Settings,
  Shield,
  User,
  UsersRound,
} from "lucide-react";

const navGroups = [
  {
    label: "Aprendizagem",
    links: [
      { href: "/dashboard", label: "Início", icon: House },
      { href: "/dashboard/cursos", label: "Meus treinamentos", icon: BookOpen },
      { href: "/dashboard/certificados", label: "Certificados", icon: Award },
    ],
  },
  {
    label: "Minha conta",
    links: [
      { href: "/dashboard/perfil", label: "Meu perfil", icon: User },
      {
        href: "/dashboard/configuracoes",
        label: "Configurações",
        icon: Settings,
      },
    ],
  },
];

export default function SidebarNav({
  isAdmin = false,
  role,
  onNavigate,
}: {
  isAdmin?: boolean;
  role?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const groups = [...navGroups];
  if (role === "hr_manager")
    groups.push({
      label: "Gestão",
      links: [
        { href: "/dashboard/equipe", label: "Minha equipe", icon: UsersRound },
      ],
    });
  if (isAdmin)
    groups.push({
      label: "Administração",
      links: [{ href: "/admin", label: "Gerenciar plataforma", icon: Shield }],
    });
  return (
    <nav aria-label="Área do aluno" className="space-y-7 p-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-xs font-medium text-learning-muted">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.links.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? pathname === href
                  : pathname === href ||
                    pathname.startsWith(`${href}/`) ||
                    (href === "/dashboard/certificados" &&
                      pathname.startsWith("/dashboard/certificado/"));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-learning-accent-soft text-learning-accent" : "text-learning-muted hover:bg-learning-panel hover:text-learning-text"}`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
