"use client";

import { useRef } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { ArrowRight, Building2, UserRound, X } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export function DiagnosticoTipoModal({ open, onClose }: Props) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="diagnostic-overlay" />
        <Dialog.Content
          className="diagnostic-dialog"
          data-lenis-prevent
          onOpenAutoFocus={() => {
            returnFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocus.current?.focus();
          }}
        >
          <p className="institutional-eyebrow">Diagnóstico de liderança</p>
          <Dialog.Title className="mt-4 pr-5 text-2xl font-semibold leading-tight tracking-tight text-site-ink">
            Qual é o seu objetivo?
          </Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-relaxed text-site-muted">
            Escolha uma opção para abrir o formulário adequado ao seu momento.
          </Dialog.Description>
          <div className="mt-7 space-y-3">
            <Link
              href="/diagnostico/pessoal"
              onClick={onClose}
              className="diagnostic-option"
            >
              <UserRound
                className="mt-0.5 size-5 shrink-0 text-site-secondary"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-site-ink">
                  Quero avaliar minha liderança
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-site-muted">
                  Identifique suas competências e pontos de desenvolvimento.
                </span>
              </span>
              <ArrowRight
                className="mt-0.5 size-4 shrink-0 text-site-secondary"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/diagnostico/empresa"
              onClick={onClose}
              className="diagnostic-option"
            >
              <Building2
                className="mt-0.5 size-5 shrink-0 text-site-secondary"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-site-ink">
                  Quero avaliar um líder da empresa
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-site-muted">
                  Avalie a liderança considerando as necessidades da equipe.
                </span>
              </span>
              <ArrowRight
                className="mt-0.5 size-4 shrink-0 text-site-secondary"
                aria-hidden="true"
              />
            </Link>
          </div>
          <p className="mt-6 border-t border-site-border pt-4 text-xs leading-relaxed text-site-muted">
            O diagnóstico começa com suas respostas. Nenhum pagamento é
            solicitado nesta etapa.
          </p>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Fechar diagnóstico"
              className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-md text-site-muted hover:bg-site-paper"
            >
              <X className="size-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
