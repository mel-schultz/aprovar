import './globals.css'
import './theme.css'
import { ThemeProvider } from './ThemeContext'

export const metadata = {
  title: 'AprovaAí - Gerenciador de Aprovações',
  description: 'Sistema completo de gerenciamento de aprovações de entregáveis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
