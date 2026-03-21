import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Instagram,
  Youtube,
  Facebook,
  Download,
  Award,
} from "lucide-react";
import { RAFFLE_CONFIG } from "@shared/raffle";

export default function LandingHome() {
  const [, navigate] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Diploma state
  const [diplomaName, setDiplomaName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const diplomaImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/assets/certificadoARMYBTS.jpeg";
    img.onload = () => {
      diplomaImageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = diplomaImageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Draw name if exists
    if (diplomaName) {
      ctx.font = "italic 40px 'Georgia', serif"; // Estilo elegante para el diploma
      ctx.fillStyle = "#1a1a1a";
      ctx.textAlign = "center";
      // Posición aproximada sobre la línea del nombre en el diploma
      ctx.fillText(diplomaName, canvas.width / 2, canvas.height / 2 - 10);
    }
  }, [diplomaName, imageLoaded]);

  const handleDownloadDiploma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `Diploma_ARMY_${diplomaName || "BTS"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

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
        {/* Diploma Generator Section - NUEVA SECCIÓN */}
        <div className="mb-12 md:mb-20">
          <Card className="bg-white/80 backdrop-blur-xl border-purple-200 shadow-2xl overflow-hidden border-2">
            <CardContent className="p-0 flex flex-col lg:flex-row">
              <div className="w-full lg:w-3/5 p-4 md:p-8 bg-slate-50 flex items-center justify-center">
                <div className="relative w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden border border-slate-200">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-auto block bg-white"
                    style={{ aspectRatio: '1/1' }}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center w-full lg:w-2/5 bg-white">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold w-fit">
                  <Award className="size-4" />
                  EXCLUSIVO ARMY
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 leading-tight">
                  Genera tu Diploma ARMY
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                  ¡Obtén tu reconocimiento oficial como ARMY! Ingresa tu nombre abajo para personalizar tu diploma de BTS, visualízalo en tiempo real y descárgalo para compartirlo.
                </p>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Tu Nombre</label>
                    <Input
                      type="text"
                      placeholder="Escribe tu nombre aquí..."
                      value={diplomaName}
                      onChange={(e) => setDiplomaName(e.target.value)}
                      className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-lg"
                      maxLength={25}
                    />
                  </div>
                  
                  <Button
                    onClick={handleDownloadDiploma}
                    disabled={!diplomaName.trim() || !imageLoaded}
                    className="w-full gap-3 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="size-5" />
                    <span>Descargar mi Diploma</span>
                  </Button>
                  
                  <p className="text-[10px] text-center text-slate-400 mt-4 italic">
                    * El diploma se generará automáticamente con el nombre que ingreses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Noticias Section - Tarjeta Grande */}
        <div className="mb-8 md:mb-12">
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
        </div>

        {/* Grid de Secciones: 4 por línea en PC, 2 por línea en móvil */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
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
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Store className="size-4 md:size-5 text-blue-600" />
                  Tienda
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Explora nuestra colección de productos K-POP: álbumes, figuras y más.
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
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/GALERIA_64697330.png"
                  alt="K-POP Gallery"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Images className="size-4 md:size-5 text-orange-600" />
                  Galerías
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Disfruta de las mejores fotos y momentos de tus ídolos favoritos.
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

          {/* Biografías Section */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-purple-400 to-indigo-400 overflow-hidden">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/BIOGRAFIA_37994860.png"
                  alt="K-POP Biographies"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Users className="size-4 md:size-5 text-purple-600" />
                  Biografías
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Conoce la historia, logros y curiosidades de los grupos más influyentes.
                </p>
                <Button
                  onClick={() => navigate("/biografias")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Users className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ver Biografías</span>
                  <span className="md:hidden">Biografías</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rifas Section */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-pink-400 to-rose-400 overflow-hidden">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/RIFAS_66068630.png"
                  alt="K-POP Raffles"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Ticket className="size-4 md:size-5 text-pink-600" />
                  Rifas
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Participa en nuestros sorteos y gana premios increíbles de tus artistas.
                </p>
                <Button
                  onClick={() => navigate("/rifa")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Ticket className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ir a Rifas</span>
                  <span className="md:hidden">Rifas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 bg-white border-t border-border/50">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={RAFFLE_CONFIG.logoUrl}
                  alt={RAFFLE_CONFIG.storeName}
                  className="h-10 w-10 rounded-xl shadow-lg"
                />
                <span className="font-bold text-xl tracking-tight">
                  {RAFFLE_CONFIG.storeName}
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
                Tu destino número uno para todo lo relacionado con el K-POP en México.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600">
                  <Instagram className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600">
                  <Youtube className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600">
                  <Facebook className="size-5" />
                </Button>
              </div>
              <div className="flex gap-6 text-sm font-medium text-slate-400">
                <a href="#" className="hover:text-slate-900 transition-colors">Términos</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Contacto</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} {RAFFLE_CONFIG.storeName}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
