import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  Ticket,
  Store,
  Images,
  Users,
  ArrowRight,
  Clock,
  ChevronDown,
  Lightbulb,
  Newspaper,
} from "lucide-react";
import { RAFFLE_CONFIG } from "@shared/raffle";

export default function LandingHome() {
  const [, navigate] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src={RAFFLE_CONFIG.logoUrl}
              alt={RAFFLE_CONFIG.storeName}
              className="h-8 w-8 rounded-lg shadow-md"
            />
            <span className="font-bold text-sm tracking-tight">
              {RAFFLE_CONFIG.storeName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium gap-1">
              <ShieldCheck className="size-3" />
              Sitio Oficial
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-500" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative container py-8 md:py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 mb-3 md:mb-6 text-xs md:text-sm font-medium">
            <Sparkles className="size-3 md:size-4" />
            <span className="hidden md:inline">Bienvenido a ETER KPOP MX</span>
            <span className="md:hidden">ETER KPOP MX</span>
          </div>
          <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-4 drop-shadow-lg">
            Descubre el Mundo K-POP
          </h1>
          <p className="text-white/90 text-xs md:text-lg max-w-2xl mx-auto leading-relaxed">
            <span className="hidden md:inline">Productos exclusivos, rifas emocionantes y contenido de tus artistas favoritos. Todo en un solo lugar.</span>
            <span className="md:hidden">Rifas, productos y contenido K-POP</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-8">
            <Button
              onClick={() => navigate("/rifa")}
              className="hidden gap-1 md:gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-xs md:text-sm py-1 md:py-2"
            >
              <Ticket className="size-3 md:size-4" />
              <span className="hidden md:inline">Ir a Rifas</span>
              <span className="md:hidden">Rifas</span>
            </Button>
            <div className="relative" ref={dropdownRef}>
              <div
                className={`bg-white/20 border border-white/40 text-white rounded-lg overflow-hidden transition-all duration-300 ${
                  isDropdownOpen ? "w-48" : "w-auto"
                }`}
              >
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between gap-1 md:gap-2 hover:bg-white/30 text-xs md:text-sm py-1 md:py-2 px-3 md:px-4 transition-colors"
                >
                  <div className="flex items-center gap-1 md:gap-2">
                    <Lightbulb className="size-3 md:size-4" />
                    <span className="hidden md:inline">Explorar</span>
                    <span className="md:hidden">Menú</span>
                  </div>
                  <ChevronDown className={`size-3 md:size-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="border-t border-white/40 divide-y divide-white/20 space-y-0">
                    <button
                      onClick={() => handleNavigate("/noticias")}
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-3 hover:translate-x-1 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      <Newspaper className="size-4 md:size-5" />
                      <span>Noticias</span>
                    </button>
                    <button
                      onClick={() => handleNavigate("/tienda")}
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-3 hover:translate-x-1 animate-in fade-in slide-in-from-top-2 duration-300 delay-75"
                    >
                      <Store className="size-4 md:size-5" />
                      <span>Tienda</span>
                    </button>
                    <button
                      onClick={() => handleNavigate("/galerias")}
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-3 hover:translate-x-1 animate-in fade-in slide-in-from-top-2 duration-300 delay-150"
                    >
                      <Images className="size-4 md:size-5" />
                      <span>Galerias</span>
                    </button>
                    <button
                      onClick={() => handleNavigate("/biografias")}
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-3 hover:translate-x-1 animate-in fade-in slide-in-from-top-2 duration-300 delay-200"
                    >
                      <Users className="size-4 md:size-5" />
                      <span>Biografias</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Noticias Section - Tarjeta Grande */}
          <Card className="md:col-span-2 bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-48 md:h-64 bg-gradient-to-br from-emerald-400 to-teal-400 overflow-hidden">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663454062860/OkKvFoQfhoNmWKfR.png"
                  alt="Noticias K-POP"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-6 flex flex-col justify-center w-full md:w-1/2">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                  <Newspaper className="size-6 md:size-8 text-emerald-600" />
                  Noticias
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-6">
                  Mantente al día con las últimas novedades, regresos y eventos de tus grupos favoritos de K-POP. ¡No te pierdas nada!
                </p>
                <Button
                  onClick={() => navigate("/noticias")}
                  className="w-full md:w-max gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm py-2 px-8"
                >
                  <span>Ver Noticias</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tienda Section */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-blue-400 to-cyan-400 overflow-hidden">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/TIENDA_a3fdf310.png"
                  alt="K-POP Merchandise"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-2 md:p-6">
                <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Store className="size-4 md:size-5 text-blue-600" />
                  Tienda
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Explora nuestra colección de productos K-POP: álbumes,
                  figuras, merchandise y mucho más. Envíos a todo México.
                </p>
                <Button
                  onClick={() => navigate("/tienda")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Store className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ver Tienda</span>
                  <span className="md:hidden">Tienda</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Galerías Section */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-orange-400 to-red-400 overflow-hidden">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/GALERIAS_fd059a61.png"
                  alt="BTS Concert Performance"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-2 md:p-6">
                <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Images className="size-4 md:size-5 text-orange-600" />
                  Galerías
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Disfruta de las mejores fotos y momentos de tus idols en
                  nuestras galerías exclusivas.
                </p>
                <Button
                  onClick={() => navigate("/galerias")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Images className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ver Galerías</span>
                  <span className="md:hidden">Galerías</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Espacio Inferior Adicional */}
        <div className="mt-12 md:mt-24 pb-12">
          <div className="text-center space-y-4">
            <h2 className="text-xl md:text-3xl font-bold text-slate-900">
              Únete a nuestra comunidad
            </h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
              Síguenos en nuestras redes sociales para no perderte ningún sorteo, noticia o lanzamiento exclusivo de tus artistas favoritos.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" className="rounded-full px-6">Instagram</Button>
              <Button variant="outline" className="rounded-full px-6">TikTok</Button>
              <Button variant="outline" className="rounded-full px-6">Facebook</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border/50 py-8 md:py-12">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <img
              src={RAFFLE_CONFIG.logoUrl}
              alt={RAFFLE_CONFIG.storeName}
              className="h-6 w-6 md:h-8 md:w-8 rounded-lg"
            />
            <span className="font-bold text-sm md:text-xl">
              {RAFFLE_CONFIG.storeName}
            </span>
          </div>
          <p className="text-gray-500 text-[10px] md:text-sm max-w-md mx-auto mb-4 md:mb-8">
            Tu destino favorito para todo lo relacionado con el K-POP en México.
            Productos oficiales, noticias y eventos exclusivos.
          </p>
          <div className="flex justify-center gap-4 md:gap-8 text-[10px] md:text-sm text-gray-400">
            <a href="#" className="hover:text-purple-600 transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-purple-600 transition-colors">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
