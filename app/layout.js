import './globals.css'

export const metadata = {
  title: 'AprovaAí Light',
  description: 'Sistema leve de gerenciamento de aprovações',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
