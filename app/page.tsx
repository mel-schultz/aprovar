/**
 * Página inicial do AprovaAí
 * Emojis substituídos por ícones Phosphor Icons
 *
 * ATENÇÃO: Este arquivo substitui o seu app/page.tsx (ou pages/index.tsx)
 * Adapte a estrutura ao seu arquivo original mantendo apenas os ícones.
 */

// Importação para Server Component (Next.js App Router)
import {
  UsersIcon,
  BuildingsIcon,
  PackageIcon,
  CalendarIcon,
  CheckCircleIcon,
  LightningIcon,
  SparkleIcon,
  RocketLaunchIcon,
  NotePencilIcon,
} from "@phosphor-icons/react/ssr";

// Features da landing page com ícones Phosphor
const features = [
  {
    Icon: UsersIcon,
    title: "Usuários",
    description: "Admin, Atendimento, Cliente",
  },
  {
    Icon: BuildingsIcon,
    title: "Clientes",
    description: "White label completo",
  },
  {
    Icon: PackageIcon,
    title: "Entregáveis",
    description: "Upload e gerenciamento",
  },
  {
    Icon: CalendarIcon,
    title: "Calendário",
    description: "Tipo Google Agenda",
  },
  {
    Icon: CheckCircleIcon,
    title: "Aprovações",
    description: "Workflow completo",
  },
  {
    Icon: LightningIcon,
    title: "Moderno",
    description: "Design responsivo",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section>
        <div>
          <SparkleIcon size={20} weight="fill" />
          <span>Bem-vindo ao AprovaAí</span>
        </div>

        <h1>Gerenciamento de Aprovações Moderno</h1>
        <p>
          Sistema completo para gerenciar clientes, entregáveis, calendário e
          aprovações em um único lugar.
        </p>

        <div>
          <a href="/login">
            <RocketLaunchIcon size={18} weight="fill" />
            Começar Agora
          </a>
          <a href="/login?tab=signup">
            <NotePencilIcon size={18} />
            Criar Conta
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        {features.map(({ Icon, title, description }) => (
          <div key={title}>
            <Icon size={32} weight="duotone" />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      <footer>
        <p>
          © 2024 AprovaAí. Desenvolvido com{" "}
          <HeartIcon size={14} weight="fill" />
        </p>
      </footer>
    </main>
  );
}

// Importação extra para o footer (pode ser feita junto com as demais acima)
import { HeartIcon } from "@phosphor-icons/react/ssr";
