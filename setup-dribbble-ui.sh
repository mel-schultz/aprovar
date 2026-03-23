#!/bin/bash

echo "🚀 Instalando Design System Dribbble..."

# Criar pastas
mkdir -p styles
mkdir -p components/ui
mkdir -p components/layout

# =========================
# TOKENS
# =========================
cat > styles/tokens.ts << 'EOF'
export const tokens = {
  color: {
    bg: {
      base: "#F6F7F9",
      gradient: "linear-gradient(135deg, #EDEEF2, #F4E7B7)"
    },
    surface: {
      glass: "rgba(255,255,255,0.6)"
    },
    brand: {
      primary: "#F5C84C",
      soft: "#F9E7A3"
    },
    text: {
      primary: "#111",
      secondary: "#6B7280",
      muted: "#9CA3AF"
    },
    border: {
      subtle: "rgba(0,0,0,0.06)"
    }
  },
  radius: {
    lg: "24px",
    pill: "999px"
  },
  spacing: {
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  shadow: {
    depth: "0 20px 60px rgba(0,0,0,0.12)"
  }
}
EOF

# =========================
# THEME
# =========================
cat > styles/theme.tsx << 'EOF'
"use client"

import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"

export function AppTheme({ children }) {
  return (
    <Theme accentColor="yellow" grayColor="sand" radius="large">
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#EDEEF2,#F4E7B7)",
          fontFamily: "Inter, sans-serif"
        }}
      >
        {children}
      </div>
    </Theme>
  )
}
EOF

# =========================
# GLASS CARD
# =========================
cat > components/ui/GlassCard.tsx << 'EOF'
export function GlassCard({ children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12)"
      }}
    >
      {children}
    </div>
  )
}
EOF

# =========================
# METRIC CARD
# =========================
cat > components/ui/MetricCard.tsx << 'EOF'
import { GlassCard } from "./GlassCard"

export function MetricCard({ label, value }) {
  return (
    <GlassCard>
      <div style={{ fontSize: 12, color: "#6B7280" }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600 }}>
        {value}
      </div>
    </GlassCard>
  )
}
EOF

# =========================
# SIDEBAR
# =========================
cat > components/ui/Sidebar.tsx << 'EOF'
import { GlassCard } from "./GlassCard"

export function Sidebar() {
  return (
    <GlassCard>
      <div style={{ fontWeight: 600, marginBottom: 20 }}>
        Crextio
      </div>

      <div>Dashboard</div>
      <div>People</div>
      <div>Hiring</div>
      <div>Devices</div>
    </GlassCard>
  )
}
EOF

# =========================
# CIRCULAR PROGRESS
# =========================
cat > components/ui/CircularProgress.tsx << 'EOF'
export function CircularProgress({ value = 70 }) {
  return (
    <div
      style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `conic-gradient(#F5C84C ${value}%, #eee ${value}%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div>{value}%</div>
    </div>
  )
}
EOF

# =========================
# LAYOUT
# =========================
cat > components/layout/DashboardLayout.tsx << 'EOF'
export function DashboardLayout({ children }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr 1fr 1fr",
        gap: 24
      }}
    >
      {children}
    </div>
  )
}
EOF

# =========================
# APP LAYOUT
# =========================
cat > app/layout.tsx << 'EOF'
import { AppTheme } from "../styles/theme"

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AppTheme>{children}</AppTheme>
      </body>
    </html>
  )
}
EOF

# =========================
# PAGE
# =========================
cat > app/page.tsx << 'EOF'
import { DashboardLayout } from "../components/layout/DashboardLayout"
import { Sidebar } from "../components/ui/Sidebar"
import { MetricCard } from "../components/ui/MetricCard"
import { CircularProgress } from "../components/ui/CircularProgress"

export default function Page() {
  return (
    <div style={{ padding: 32 }}>
      <DashboardLayout>
        <Sidebar />
        <MetricCard label="Employees" value="78" />
        <MetricCard label="Hiring" value="56" />
        <MetricCard label="Projects" value="203" />
        <CircularProgress value={75} />
      </DashboardLayout>
    </div>
  )
}
EOF

echo "✅ Design System instalado com sucesso!"