"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="learning-container">
      <div
        role="alert"
        className="rounded-xl border border-learning-border bg-learning-panel p-7"
      >
        <h2 className="text-xl font-semibold text-learning-text">
          Não foi possível carregar seus treinamentos
        </h2>
        <p className="mt-3 text-sm text-learning-muted">
          Tente novamente. Se o problema continuar, entre em contato para
          verificarmos seu acesso.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <button onClick={reset} className="learning-button">
            <RotateCcw className="size-4" />
            Tentar novamente
          </button>
          <Link
            href="/contato"
            className="inline-flex min-h-11 items-center text-sm text-learning-accent"
          >
            Falar com a Lidera
          </Link>
        </div>
      </div>
    </div>
  );
}
