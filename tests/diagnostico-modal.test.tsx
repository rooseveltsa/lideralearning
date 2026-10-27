import { after, afterEach, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLButtonElement",
  "Element",
  "Node",
  "NodeFilter",
  "MutationObserver",
  "CustomEvent",
  "Event",
  "KeyboardEvent",
  "MouseEvent",
]) {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    value:
      key === "window"
        ? dom.window
        : key === "document"
          ? dom.window.document
          : dom.window[key as keyof Window],
  });
}
Object.defineProperty(globalThis, "self", {
  configurable: true,
  value: dom.window,
});
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
Object.defineProperty(globalThis, "getComputedStyle", {
  configurable: true,
  value: dom.window.getComputedStyle.bind(dom.window),
});
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  configurable: true,
  value: true,
});
let createRoot: (typeof import("react-dom/client"))["createRoot"];
let DiagnosticoCTA: (typeof import("../src/components/diagnostico/DiagnosticoCTA"))["DiagnosticoCTA"];
before(async () => {
  ({ createRoot } = await import("react-dom/client"));
  ({ DiagnosticoCTA } = await import(
    "../src/components/diagnostico/DiagnosticoCTA"
  ));
});
let host: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

beforeEach(async () => {
  host = document.createElement("div");
  host.style.transform = "translate(5px, 5px)";
  document.body.append(host);
  root = createRoot(host);
  await act(async () => {
    root.render(<DiagnosticoCTA>Fazer teste</DiagnosticoCTA>);
  });
});
afterEach(async () => {
  await act(async () => {
    root.unmount();
  });
  host.remove();
});
after(() => dom.window.close());

async function openDialog() {
  const trigger = host.querySelector("button")!;
  await act(async () => {
    trigger.focus();
    trigger.click();
  });
  return trigger;
}

test("diálogo fica fora do ancestral transformado e mantém os dois caminhos", async () => {
  await openDialog();
  const dialog = document.querySelector('[role="dialog"]')!;
  assert.ok(dialog);
  assert.equal(host.contains(dialog), false);
  assert.ok(document.body.contains(dialog));
  assert.ok(dialog.textContent?.includes("Qual é o seu objetivo?"));
  assert.equal(
    dialog
      .querySelector('a[href="/diagnostico/pessoal"]')
      ?.textContent?.includes("minha liderança"),
    true,
  );
  assert.equal(
    dialog
      .querySelector('a[href="/diagnostico/empresa"]')
      ?.textContent?.includes("da empresa"),
    true,
  );
  assert.equal(dialog.hasAttribute("data-lenis-prevent"), true);
  assert.equal(dialog.contains(document.activeElement), true);
});

test("Escape fecha o diálogo e devolve o foco ao botão de origem", async () => {
  const trigger = await openDialog();
  await act(async () => {
    document.activeElement?.dispatchEvent(
      new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  assert.equal(document.querySelector('[role="dialog"]'), null);
  assert.equal(document.activeElement, trigger);
});

test("botão fechar permite abrir novamente sem estado de navegação preso", async () => {
  await openDialog();
  const close = document.querySelector<HTMLButtonElement>(
    'button[aria-label="Fechar diagnóstico"]',
  )!;
  await act(async () => {
    close.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
  assert.equal(document.querySelector('[role="dialog"]'), null);
  await openDialog();
  assert.ok(document.querySelector('[role="dialog"]'));
  assert.equal(document.querySelectorAll('[role="dialog"]').length, 1);
});
