import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle2, Users, Package, Calendar, Zap, Shield } from "lucide-react";

/**
 * Home Page - Primer CSS Design
 * 
 * Design Philosophy:
 * - Modern landing page with clear value proposition
 * - Feature showcase with icons and descriptions
 * - Professional color scheme inspired by GitHub
 * - Responsive design for all devices
 * - Clear call-to-action buttons
 */

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Users,
      title: "Usuários",
      description: "Admin, Atendimento, Cliente - Controle total de permissões",
    },
    {
      icon: Shield,
      title: "Clientes",
      description: "White label completo - Personalize para sua marca",
    },
    {
      icon: Package,
      title: "Entregáveis",
      description: "Upload e gerenciamento - Organize seus arquivos",
    },
    {
      icon: Calendar,
      title: "Calendário",
      description: "Tipo Google Agenda - Visualize prazos e eventos",
    },
    {
      icon: CheckCircle2,
      title: "Aprovações",
      description: "Workflow completo - Gerencie o processo de aprovação",
    },
    {
      icon: Zap,
      title: "Moderno",
      description: "Design responsivo - Funciona em qualquer dispositivo",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AprovaAí</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/login")}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Entrar
            </Button>
            <Button
              onClick={() => setLocation("/login?tab=signup")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50 py-20 sm:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Gerenciamento de Aprovações
              <span className="block text-blue-600">Moderno e Eficiente</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Sistema completo para gerenciar clientes, entregáveis, calendário e aprovações em um único lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 text-lg"
              >
                🚀 Começar Agora
              </Button>
              <Button
                onClick={() => setLocation("/login?tab=signup")}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-8 py-3 text-lg"
              >
                📝 Criar Conta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recursos Poderosos</h2>
            <p className="text-xl text-gray-600">Tudo que você precisa para gerenciar aprovações com eficiência</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Por que escolher AprovaAí?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Interface Intuitiva</h3>
                    <p className="text-gray-600 mt-1">Fácil de usar, sem curva de aprendizado</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Segurança em Primeiro Lugar</h3>
                    <p className="text-gray-600 mt-1">Seus dados estão protegidos com criptografia</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Suporte Profissional</h3>
                    <p className="text-gray-600 mt-1">Equipe dedicada pronta para ajudar</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-600 text-white">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Escalável</h3>
                    <p className="text-gray-600 mt-1">Cresce com seu negócio</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="mt-8 space-y-3">
                  <div className="h-3 bg-blue-100 rounded w-1/2" />
                  <div className="h-3 bg-blue-100 rounded w-2/3" />
                  <div className="h-3 bg-blue-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Pronto para começar?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Crie sua conta agora e comece a gerenciar suas aprovações com eficiência
          </p>
          <Button
            onClick={() => setLocation("/login?tab=signup")}
            className="bg-white hover:bg-gray-100 text-blue-600 font-medium px-8 py-3 text-lg"
          >
            Criar Conta Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <span className="text-white font-bold">AprovaAí</span>
              </div>
              <p className="text-sm">Sistema de aprovações moderno e profissional</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">© 2024 AprovaAí. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
