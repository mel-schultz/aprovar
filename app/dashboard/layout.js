import "./globals.css";

export const metadata = {
  title: "Aprovar",
  description: "Sistema de aprovação de documentos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          {`
            :root {
              --brand: #0ea472;
              --brand-light: #dcf8ed;
              --surface: #ffffff;
              --surface-2: #fafafa;
              --surface-3: #f0f0f0;
              --text-1: #1a1a1a;
              --text-2: #666666;
              --text-3: #999999;
              --border: #e0e0e0;
              --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            html, body {
              height: 100%;
              font-family: var(--font-display);
              background: var(--surface-2);
              color: var(--text-1);
            }

            body {
              line-height: 1.5;
              -webkit-font-smoothing: antialiased;
            }

            button, input, textarea, select {
              font-family: inherit;
              font-size: inherit;
            }

            a {
              color: inherit;
              text-decoration: none;
            }
          `}
        </style>
      </head>
      <body>
        {/* Renderizar children diretamente - sem AppLayout aqui */}
        {children}
      </body>
    </html>
  );
}
