import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findTrainings,
  getTrainingStatus,
} from "../src/lib/training-library.ts";

const training = (changes = {}) => ({
  title: "Comunicação e liderança",
  totalLessons: 8,
  completedLessons: 0,
  trackedLessons: 0,
  enrolledAt: "2026-01-01T12:00:00Z",
  lastAccessedAt: null,
  ...changes,
});

test("treinamento sem aulas não é concluído", () => {
  assert.equal(getTrainingStatus(training({ totalLessons: 0 })), "new");
});
test("iniciado e concluído são estados distintos", () => {
  assert.equal(getTrainingStatus(training({ trackedLessons: 1 })), "progress");
  assert.equal(
    getTrainingStatus(training({ trackedLessons: 8, completedLessons: 8 })),
    "done",
  );
});
test("percentual arredondado não libera conclusão", () => {
  assert.equal(
    getTrainingStatus(
      training({
        totalLessons: 200,
        completedLessons: 199,
        trackedLessons: 200,
        progressPercent: 100,
      }),
    ),
    "progress",
  );
});
test("busca ignora acentos, caixa e espaços externos", () => {
  assert.equal(
    findTrainings([training()], "  COMUNICACAO  ", "all", "recent").length,
    1,
  );
});
test("busca e filtro de situação são aplicados juntos", () => {
  const courses = [
    training(),
    training({ title: "Gestão", trackedLessons: 3 }),
  ];
  assert.equal(
    findTrainings(courses, "gestao", "progress", "recent").length,
    1,
  );
  assert.equal(findTrainings(courses, "gestao", "done", "recent").length, 0);
});
test("último acesso tem prioridade e não altera lista de origem", () => {
  const courses = [
    training({ title: "A" }),
    training({ title: "B", lastAccessedAt: "2026-10-01T12:00:00Z" }),
  ];
  assert.deepEqual(
    findTrainings(courses, "", "all", "recent").map((c) => c.title),
    ["B", "A"],
  );
  assert.deepEqual(
    courses.map((c) => c.title),
    ["A", "B"],
  );
});
test("ordenação por nome e biblioteca vazia", () => {
  assert.deepEqual(
    findTrainings(
      [training({ title: "Z" }), training({ title: "A" })],
      "",
      "all",
      "title",
    ).map((c) => c.title),
    ["A", "Z"],
  );
  assert.deepEqual(findTrainings([], "", "all", "recent"), []);
});
