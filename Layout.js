import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Package, Search, Plus, User, LogOut, Menu, X, Contrast, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User as UserEntity } from "@/entities/User";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useCallback } from "react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const checkUser = useCallback(async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    // Load Google Fonts - Inter
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleLogout = async () => {
    await UserEntity.logout();
    setUser(null);
    navigate(createPageUrl("Home"));
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const enableVLibras = () => {
    // VLibras integration
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
    };
    document.body.appendChild(script);
  };

  const isHomePage = currentPageName === "Home";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-xl"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Accessibility Banner */}
      {isHomePage && (
        <div className="bg-orange-500 text-white py-2 px-4 text-center text-sm">
          <span className="font-medium">🎯 Novas vagas de armazenamento estão disponíveis!</span>
          <Link to={createPageUrl("Dashboard")} className="ml-2 underline hover:no-underline">
            Ver agora
          </Link>
        </div>
      )}

      {/* Header */}
      <header className={`${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white'} shadow-sm border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${highContrast ? 'text-white' : 'text-gray-900'}`}>ARMAZENE-JÁ</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  <Link 
                    to={createPageUrl("Dashboard")}
                    className={`${highContrast ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} font-medium transition-colors ${
                      location.pathname === createPageUrl("Dashboard") ? "text-orange-500" : ""
                    }`}
                  >
                    Buscar Espaços
                  </Link>
                  
                  {user.user_type === "warehouse" && (
                    <Link 
                      to={createPageUrl("CreateListing")}
                      className={`${highContrast ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} font-medium transition-colors ${
                        location.pathname === createPageUrl("CreateListing") ? "text-orange-500" : ""
                      }`}
                    >
                      + Criar Anúncio
                    </Link>
                  )}

                  <Link 
                    to={createPageUrl("Favorites")}
                    className={`${highContrast ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} font-medium transition-colors ${
                      location.pathname === createPageUrl("Favorites") ? "text-orange-500" : ""
                    }`}
                  >
                    Favoritos
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={`flex items-center gap-2 ${highContrast ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className={`font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>{user.full_name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => UserEntity.login()}
                    variant="ghost"
                    className={`${highContrast ? 'text-gray-300 hover:text-orange-400' : 'text-gray-600 hover:text-orange-500'} font-medium transition-colors`}
                  >
                    Acessar
                  </Button>
                  <Button
                    onClick={() => UserEntity.login()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cadastrar
                  </Button>
                </div>
              )}

              {/* Accessibility Tools */}
              <div className="flex items-center gap-2 ml-4 border-l border-gray-200 pl-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleHighContrast}
                  title="Alto Contraste"
                >
                  <Contrast className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={enableVLibras}
                  title="VLibras - Tradução em Libras"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${highContrast ? 'bg-gray-900' : 'bg-white'} border-t`}>
            <div className="px-4 py-3 space-y-3">
              {user ? (
                <>
                  <Link 
                    to={createPageUrl("Dashboard")}
                    className={`block ${highContrast ? 'text-gray-300' : 'text-gray-600'} hover:text-orange-500 font-medium py-2`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Buscar Espaços
                  </Link>
                  
                  {user.user_type === "warehouse" && (
                    <Link 
                      to={createPageUrl("CreateListing")}
                      className={`block ${highContrast ? 'text-gray-300' : 'text-gray-600'} hover:text-orange-500 font-medium py-2`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      + Criar Anúncio
                    </Link>
                  )}

                  <Link 
                    to={createPageUrl("Favorites")}
                    className={`block ${highContrast ? 'text-gray-300' : 'text-gray-600'} hover:text-orange-500 font-medium py-2`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Favoritos
                  </Link>
                  
                  <div className={`border-t ${highContrast ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className={`font-medium ${highContrast ? 'text-white' : 'text-gray-700'}`}>{user.full_name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleHighContrast}
                        className="flex items-center gap-2"
                      >
                        <Contrast className="w-4 h-4" />
                        Alto Contraste
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={enableVLibras}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        VLibras
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      UserEntity.login();
                      setMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className={`w-full justify-start ${highContrast ? 'text-gray-300' : 'text-gray-600'} hover:text-orange-500 font-medium`}
                  >
                    Acessar
                  </Button>
                  <Button
                    onClick={() => {
                      UserEntity.login();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
                  >
                    Cadastrar
                  </Button>
                  
                  <div className={`border-t ${highContrast ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleHighContrast}
                        className="flex items-center gap-2"
                      >
                        <Contrast className="w-4 h-4" />
                        Alto Contraste
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={enableVLibras}
                        className="flex items-center gap-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        VLibras
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      {isHomePage && (
        <footer className={`${highContrast ? 'bg-black text-white' : 'bg-gray-900 text-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">ARMAZENE-JÁ</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  Soluções inteligentes para sua logística. 
                  Conectando empresas de armazenagem a microempreendedores.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Plataforma</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Como funciona</p>
                  <p>Para armazéns</p>
                  <p>Para microempreendedores</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Suporte</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>Central de ajuda</p>
                  <p>Contato</p>
                  <p>Termos de uso</p>
                </div>
              </div>
            </div>
            
            <div className={`border-t ${highContrast ? 'border-gray-700' : 'border-gray-800'} mt-8 pt-8 text-center text-sm text-gray-400`}>
              © 2025 Armazene-Já. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      )}

      {/* VLibras Widget Container */}
      <div vw className="enabled">
        <div vw-access-button className="active"></div>
        <div vw-plugin-wrapper></div>
      </div>
    </div>
  );
}