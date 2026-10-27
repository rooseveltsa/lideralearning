"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, X } from "lucide-react";
import type { UserCourseProgressSummary } from "@/lib/actions/lms";
import CourseShelfCard from "./CourseShelfCard";
import { findTrainings, getTrainingStatus } from "@/lib/training-library";

const filters = [
  { id: "all", label: "Todos" },
  { id: "progress", label: "Em andamento" },
  { id: "new", label: "Não iniciados" },
  { id: "done", label: "Concluídos" },
];

export default function TrainingLibrary({
  courses,
}: {
  courses: UserCourseProgressSummary[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [order, setOrder] = useState("recent");
  const [page, setPage] = useState(1);
  const results = findTrainings(courses, query, filter, order);
  const pages = Math.ceil(results.length / 12);
  if (!courses.length)
    return (
      <section className="rounded-xl border border-learning-border bg-learning-panel p-8 text-center">
        <BookOpen className="mx-auto size-9 text-learning-accent" />
        <h2 className="mt-5 text-xl font-semibold text-learning-text">
          Você ainda não tem treinamentos
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-learning-muted">
          Conheça o catálogo para começar. Já fez a matrícula? Confira se está
          usando o mesmo e-mail da inscrição.
        </p>
        <Link href="/cursos" className="learning-button mt-6">
          Conhecer treinamentos
        </Link>
        <Link
          href="/contato"
          className="mt-4 block py-2 text-sm text-learning-muted"
        >
          Preciso de ajuda com meu acesso
        </Link>
      </section>
    );
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="training-search" className="sr-only">
            Buscar treinamento pelo nome
          </label>
          <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-learning-muted" />
          <input
            id="training-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar pelo nome do treinamento"
            className="h-11 w-full rounded-lg border border-learning-border bg-learning-panel pl-10 pr-4 text-sm text-learning-text placeholder:text-learning-muted"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-learning-muted">
          <span className="sr-only">Ordenar treinamentos</span>
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full rounded-lg border border-learning-border bg-learning-panel px-3 text-sm text-learning-text sm:w-auto"
          >
            <option value="recent">Acessados recentemente</option>
            <option value="title">Nome: A a Z</option>
          </select>
        </label>
      </div>
      <div
        role="group"
        aria-label="Filtrar treinamentos por situação"
        className="flex flex-wrap gap-2"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setPage(1);
            }}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm ${filter === f.id ? "border-learning-accent bg-learning-accent-soft text-learning-accent" : "border-learning-border text-learning-muted hover:text-learning-text"}`}
          >
            {f.label}
            <span className="text-xs tabular-nums">
              {f.id === "all"
                ? courses.length
                : courses.filter((c) => getTrainingStatus(c) === f.id).length}
            </span>
          </button>
        ))}
      </div>
      <p role="status" className="text-xs text-learning-muted">
        {results.length}{" "}
        {results.length === 1
          ? "treinamento encontrado"
          : "treinamentos encontrados"}
      </p>
      {results.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.slice((page - 1) * 12, page * 12).map((course) => (
            <CourseShelfCard key={course.enrollmentId} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-learning-border p-8 text-center">
          <Search className="mx-auto size-7 text-learning-muted" />
          <h2 className="mt-4 text-lg font-semibold text-learning-text">
            Nenhum treinamento encontrado
          </h2>
          <p className="mt-2 text-sm text-learning-muted">
            Tente outro nome ou mude o filtro selecionado.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
              setPage(1);
            }}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-learning-accent"
          >
            <X className="size-4" />
            Limpar busca e filtros
          </button>
        </div>
      )}
      {pages > 1 ? (
        <nav
          aria-label="Páginas de treinamentos"
          className="flex items-center justify-center gap-5"
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="min-h-11 rounded-lg border border-learning-border px-4 text-sm text-learning-text disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-learning-muted">
            Página {page} de {pages}
          </span>
          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="min-h-11 rounded-lg border border-learning-border px-4 text-sm text-learning-text disabled:opacity-40"
          >
            Próxima
          </button>
        </nav>
      ) : null}
    </div>
  );
}
