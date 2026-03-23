/**
 * Página inicial — AprovaAí
 *
 * ATENÇÃO: Este é um EXEMPLO de como usar os ícones Lucide na sua página.
 * Adapte ao seu app/page.tsx real mantendo sua estrutura de estilos/classes.
 *
 * lucide-react funciona em Server Components (sem "use client") no Next.js 14.
 */

import {
  Users,
  Building2,
  Package,
  Calendar,
  CheckCircle,
  Zap,
  Sparkles,
  Rocket,
  NotebookPen,
  Heart,
} from "lucide-react";

const features = [
  { Icon: Users,        title: "Usuários",     description: "Admin, Atendimento, Cliente" },
  { Icon: Building2,    title: "Clientes",     description: "White label completo"        },
  { Icon: Package,      title: "Entregáveis",  description: "Upload e gerenciamento"      },
  { Icon: Calendar,     title: "Calendário",   description: "Tipo Google Agenda"          },
  { Icon: CheckCircle,  title: "Aprovações",   description: "Workflow completo"           },
  { Icon: Zap,          title: "Moderno",      description: "Design responsivo"           },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section>
        <div>
          <Sparkles size={20} />
          <span>Bem-vindo ao AprovaAí</span>
        </div>

        <h1>Gerenciamento de Aprovações Moderno</h1>
        <p>
          Sistema completo para gerenciar clientes, entregáveis, calendário e
          aprovações em um único lugar.
        </p>

        <div>
          <a href="/login">
            <Rocket size={18} />
            Começar Agora
          </a>
          <a href="/login?tab=signup">
            <NotebookPen size={18} />
            Criar Conta
          </a>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section>
        {features.map(({ Icon, title, description }) => (
          <div key={title}>
            <Icon size={32} />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer>
        <p>
          © 2024 AprovaAí. Desenvolvido com{" "}
          <Heart size={14} fill="currentColor" color="#e11d48" />
        </p>
      </footer>
    </main>
  );
}
