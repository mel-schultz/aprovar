import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "AprovaAí - Plataforma de Aprovação de Conteúdo",
  description:
    "Envie, aprove e agende posts em um só lugar. Seus clientes aprovam com um clique — você publica no piloto automático.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "Google Sans, sans-serif",
                fontSize: 14,
                borderRadius: 10,
              },
              success: {
                iconTheme: { primary: "#0ea472", secondary: "#fff" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
