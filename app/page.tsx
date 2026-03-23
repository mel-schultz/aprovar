/**
 * Página inicial — AprovaAí
 *
 * ATENÇÃO: Este arquivo é um EXEMPLO de como substituir os emojis da sua
 * página inicial por ícones Phosphor. Adapte conforme o seu app/page.tsx real.
 *
 * Como a página usa ícones de forma interativa, marcamos como "use client".
 * Para Server Components, basta importar de "@phosphor-icons/react/dist/ssr"
 * caso sua versão instalada suporte (v2.1+).
 */

"use client";

import {
  Users,
  Buildings,
  Package,
  Calendar,
  CheckCircle,
  Lightning,
  Sparkle,
  RocketLaunch,
  NotePencil,
  Heart,
} from "@phosphor-icons/react";

const features = [
  { Icon: Users,       title: "Usuários",     description: "Admin, Atendimento, Cliente" },
  { Icon: Buildings,   title: "Clientes",     description: "White label completo" },
  { Icon: Package,     title: "Entregáveis",  description: "Upload e gerenciamento" },
  { Icon: Calendar,    title: "Calendário",   description: "Tipo Google Agenda" },
  { Icon: CheckCircle, title: "Aprovações",   description: "Workflow completo" },
  { Icon: Lightning,   title: "Moderno",      description: "Design responsivo" },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section>
        <div>
          <Sparkle size={20} weight="fill" />
          <span>Bem-vindo ao AprovaAí</span>
        </div>

        <h1>Gerenciamento de Aprovações Moderno</h1>
        <p>
          Sistema completo para gerenciar clientes, entregáveis, calendário e
          aprovações em um único lugar.
        </p>

        <div>
          <a href="/login">
            <RocketLaunch size={18} weight="fill" />
            Começar Agora
          </a>
          <a href="/login?tab=signup">
            <NotePencil size={18} />
            Criar Conta
          </a>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section>
        {features.map(({ Icon, title, description }) => (
          <div key={title}>
            <Icon size={32} weight="duotone" />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer>
        <p>
          © 2024 AprovaAí. Desenvolvido com{" "}
          <Heart size={14} weight="fill" color="#e11d48" />
        </p>
      </footer>
    </main>
  );
}
