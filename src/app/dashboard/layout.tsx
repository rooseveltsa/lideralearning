import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/SidebarNav";
import MobileNavigation from "@/components/dashboard/MobileNavigation";
import { logout } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  const role = profile?.role ?? "";
  const name =
    profile?.full_name || user.user_metadata?.full_name || "Minha conta";
  return (
    <div className="learning-shell min-h-screen bg-learning-bg text-learning-text md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <a
        href="#student-content"
        className="sr-only z-50 bg-learning-panel p-4 focus:not-sr-only focus:fixed"
      >
        Pular para o conteúdo
      </a>
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-learning-border bg-learning-bg md:flex">
        <Link
          href="/dashboard"
          className="flex h-20 items-center gap-3 border-b border-learning-border px-7"
          aria-label="Lidera Treinamentos — início"
        >
          <Image src="/brand/lidera-mark.png" alt="" width={40} height={28} className="h-auto w-10 shrink-0" />
          <span>
            <span className="block text-2xl font-bold tracking-tight">
              Lidera
            </span>
            <span className="block text-[10px] tracking-[0.18em] text-learning-muted">
              TREINAMENTOS
            </span>
          </span>
        </Link>
        <div className="min-h-0 flex-1 overflow-y-auto py-5">
          <SidebarNav isAdmin={role === "admin"} role={role} />
        </div>
        <div className="m-4 rounded-xl border border-learning-border p-4">
          <p className="text-sm font-semibold">Seu próximo aprendizado</p>
          <p className="mt-2 text-xs leading-relaxed text-learning-muted">
            Conheça os treinamentos disponíveis para desenvolver sua liderança.
          </p>
          <Link
            href="/cursos"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-learning-accent"
          >
            Explorar treinamentos →
          </Link>
        </div>
        <form action={logout} className="border-t border-learning-border p-4">
          <button className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-learning-muted hover:bg-learning-panel hover:text-learning-text">
            <LogOut className="size-4" />
            Sair da conta
          </button>
        </form>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between gap-4 border-b border-learning-border bg-learning-bg px-4 md:px-8">
          <div className="flex items-center gap-3">
            <MobileNavigation isAdmin={role === "admin"} role={role} />
            <Link href="/dashboard" className="font-semibold md:hidden">
              Lidera
            </Link>
            <span className="hidden text-sm text-learning-muted md:block">
              Área do aluno <span className="mx-3 text-learning-border">/</span>{" "}
              Aprenda. Pratique. Lidere.
            </span>
          </div>
          <Link
            href="/dashboard/perfil"
            className="flex min-h-11 min-w-0 items-center gap-3 rounded-lg px-2 text-sm"
          >
            <span className="max-w-40 truncate">{name}</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-learning-panel">
              <UserRound className="size-4 text-learning-muted" />
            </span>
          </Link>
        </header>
        <main id="student-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
