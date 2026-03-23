'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="home-root">
      {/* HEADER / NAVBAR */}
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-logo">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>AprovaAí</span>
          </div>
          <nav className="home-nav">
            <Link href="/login" className="home-nav-link">Entrar</Link>
            <Link href="/login?tab=signup" className="btn btn-primary btn-sm">
              Criar conta
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <main className="home-hero">
        <div className="home-hero-inner">
          <div className="home-eyebrow">
            <span className="home-badge">Novo</span>
            <span>Sistema de aprovações de entregáveis</span>
          </div>

          <h1 className="home-title">
            Gerencie aprovações com<br />
            <span className="home-title-accent">clareza e eficiência</span>
          </h1>

          <p className="home-subtitle">
            Plataforma completa para gerenciar clientes, entregáveis, calendário e
            fluxos de aprovação em um único lugar — com controle de acesso por perfil.
          </p>

          <div className="home-cta-group">
            <Link href="/login" className="btn btn-primary btn-lg">
              Começar agora
            </Link>
            <Link href="/login?tab=signup" className="btn btn-secondary btn-lg">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </main>

      {/* FEATURES */}
      <section className="home-features">
        <div className="home-features-inner">
          <h2 className="home-section-title">Tudo que você precisa em um só lugar</h2>
          <p className="home-section-subtitle">
            Funcionalidades pensadas para agências, times de criação e seus clientes.
          </p>

          <div className="home-features-grid">
            <FeatureCard
              icon={<IconUsers />}
              title="Controle de usuários"
              desc="Perfis de Admin, Atendimento e Cliente com permissões distintas e seguras."
            />
            <FeatureCard
              icon={<IconBuilding />}
              title="Gestão de clientes"
              desc="Cadastro completo com suporte a white label e personalização por conta."
            />
            <FeatureCard
              icon={<IconPackage />}
              title="Entregáveis"
              desc="Upload, versionamento e gerenciamento de arquivos com rastreabilidade."
            />
            <FeatureCard
              icon={<IconCalendar />}
              title="Calendário integrado"
              desc="Visualização de eventos e prazos no estilo Google Agenda."
            />
            <FeatureCard
              icon={<IconCheck />}
              title="Fluxo de aprovações"
              desc="Workflow completo com comentários, histórico e notificações."
            />
            <FeatureCard
              icon={<IconShield />}
              title="Segurança"
              desc="Autenticação via Supabase com JWT e Row Level Security habilitado."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer-inner">
          <span>© 2024 AprovaAí</span>
          <span className="home-footer-sep">·</span>
          <span>Todos os direitos reservados</span>
        </div>
      </footer>

      <style>{`
        /* ---- Root ---- */
        .home-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-canvas-default);
        }

        /* ---- Header ---- */
        .home-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--color-canvas-default);
          border-bottom: 1px solid var(--color-border-muted);
          backdrop-filter: blur(8px);
        }

        .home-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .home-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--color-fg-default);
        }

        .home-logo svg {
          color: var(--color-accent-fg);
        }

        .home-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .home-nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-fg-default);
          text-decoration: none;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background-color 0.15s ease;
        }

        .home-nav-link:hover {
          background: var(--hover-bg);
          text-decoration: none;
          color: var(--color-fg-default);
        }

        .btn-sm {
          padding: 4px 12px;
          font-size: 13px;
          line-height: 18px;
        }

        /* ---- Hero ---- */
        .home-hero {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 24px 64px;
        }

        .home-hero-inner {
          max-width: 720px;
          text-align: center;
        }

        .home-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-fg-muted);
          margin-bottom: 24px;
        }

        .home-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          background: var(--color-accent-subtle);
          color: var(--color-accent-fg);
          border: 1px solid var(--color-accent-muted);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .home-title {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.5px;
          color: var(--color-fg-default);
          margin-bottom: 20px;
        }

        .home-title-accent {
          color: var(--color-accent-fg);
        }

        .home-subtitle {
          font-size: 18px;
          color: var(--color-fg-muted);
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        .home-cta-group {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* ---- Features ---- */
        .home-features {
          background: var(--color-canvas-subtle);
          border-top: 1px solid var(--color-border-muted);
          border-bottom: 1px solid var(--color-border-muted);
          padding: 64px 24px;
        }

        .home-features-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .home-section-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--color-fg-default);
          text-align: center;
          margin-bottom: 8px;
        }

        .home-section-subtitle {
          font-size: 15px;
          color: var(--color-fg-muted);
          text-align: center;
          margin-bottom: 40px;
        }

        .home-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .feature-card {
          background: var(--color-canvas-default);
          border: 1px solid var(--color-border-default);
          border-radius: 6px;
          padding: 20px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .feature-card:hover {
          border-color: var(--color-border-muted);
          box-shadow: var(--color-shadow-medium);
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-accent-subtle);
          border: 1px solid var(--color-accent-muted);
          border-radius: 6px;
          color: var(--color-accent-fg);
          margin-bottom: 12px;
        }

        .feature-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-fg-default);
          margin-bottom: 6px;
        }

        .feature-card p {
          font-size: 13px;
          color: var(--color-fg-muted);
          line-height: 1.5;
          margin: 0;
        }

        /* ---- Footer ---- */
        .home-footer {
          padding: 24px;
          border-top: 1px solid var(--color-border-muted);
        }

        .home-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-fg-muted);
        }

        .home-footer-sep {
          opacity: 0.4;
        }

        /* ---- Responsive ---- */
        @media (max-width: 640px) {
          .home-title {
            font-size: 32px;
          }

          .home-subtitle {
            font-size: 16px;
          }

          .home-hero {
            padding: 48px 16px 40px;
          }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

/* ---- SVG Icons ---- */
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M5.5 3.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.507 5.507 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a.75.75 0 1 0 0 1.5 1.5 1.5 0 0 1 .666 2.844.75.75 0 0 0-.416.672v.352a.75.75 0 0 0 .574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 1 0 1.434-.44 5.01 5.01 0 0 0-2.56-3.012A3 3 0 0 0 11 4Z" />
    </svg>
  )
}

function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h3.75a.75.75 0 0 1 0 1.5H1.75Z" />
      <path d="M3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 6.75.75.75 0 0 1 3.75 6ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM7 6.75A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM13 13.25a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-1.5h3v1.5Zm-3-3h3v.5h-3v-.5Z" />
    </svg>
  )
}

function IconPackage() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.2.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.25.25 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm6.25 8.271 4.625-2.683a.25.25 0 0 0 .125-.216V5.677L8.75 8.432Z" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M7.467.133a1.748 1.748 0 0 1 1.066 0l5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667Zm.61 1.429a.25.25 0 0 0-.153 0l-5.25 1.68a.25.25 0 0 0-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.196.196 0 0 0 .154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.25.25 0 0 0-.174-.237l-5.25-1.68ZM8.75 9.5a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 1.5 0Zm-.75-4.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
    </svg>
  )
}
