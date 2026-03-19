import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: { default: 'Aprovar', template: '%s | Aprovar' },
  description: 'Plataforma de aprovações e agendamento de postagens para agências e criadores de conteúdo.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230ea472'/><polyline points='25,55 42,72 75,35' stroke='white' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'var(--font-body)', fontSize: 14, borderRadius: 10, boxShadow: 'var(--shadow)' },
            success: { iconTheme: { primary: '#0ea472', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
