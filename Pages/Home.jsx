import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowRight, 
  Package, 
  Truck, 
  Clock,
  CheckCircle,
  Warehouse,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Soluções
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"> inteligentes </span>
                  para sua logística
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Conecte-se aos melhores espaços de armazenamento ou monetize seu armazém. 
                  Gestão eficiente e monitoramento em tempo real para seu negócio crescer.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    onClick={() => window.location.href = createPageUrl("Dashboard")}
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Conheça agora
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur-3xl opacity-20 transform rotate-6"></div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&crop=center" 
                    alt="Logística - Caixas e armazenamento" 
                    className="w-full h-96 object-cover rounded-3xl shadow-2xl border border-orange-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefícios da Nossa Plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos soluções completas para otimizar sua cadeia logística
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">📦 Gestão de Estoque</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sistema avançado de controle que otimiza o espaço e monitora suas mercadorias com eficiência total.
                </p>
                <div className="flex items-center justify-center mt-4 text-orange-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Controle completo
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">🚚 Armazenagem Inteligente</h3>
                <p className="text-gray-600 leading-relaxed">
                  Espaços adaptados para diferentes tipos de produtos com tecnologia de ponta e segurança garantida.
                </p>
                <div className="flex items-center justify-center mt-4 text-blue-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tecnologia avançada
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">⏱ Monitoramento em Tempo Real</h3>
                <p className="text-gray-600 leading-relaxed">
                  Acompanhe suas mercadorias 24/7 com relatórios detalhados e alertas instantâneos.
                </p>
                <div className="flex items-center justify-center mt-4 text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Monitoramento 24/7
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-xl text-gray-600">
              Processo simples e eficiente em 3 passos
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cadastre-se na Plataforma</h3>
              <p className="text-gray-600">
                Crie sua conta escolhendo o perfil ideal: microempreendedor ou empresa de armazém
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Busque ou Anuncie Espaços</h3>
              <p className="text-gray-600">
                Encontre o espaço perfeito para suas necessidades ou monetize seu armazém disponível
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Conecte-se e Negocie</h3>
              <p className="text-gray-600">
                Entre em contato direto e negocie as melhores condições para sua operação logística
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para otimizar sua logística?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Junte-se a centenas de empresas que já transformaram seus processos de armazenagem
          </p>
          <Button 
            onClick={() => window.location.href = createPageUrl("Dashboard")}
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}