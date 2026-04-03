import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../components/ui/badge";
import { LegalFooter } from "@/components/LegalFooter";
import { StoriesWall } from "@/components/StoriesWall";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  Store,
  Images,
  Users,
  ArrowRight,
  ChevronDown,
  Lightbulb,
  Newspaper,
  Instagram,
  Youtube,
  Facebook,
  Award,
  MessageCircle,
  Clock,
  Ticket,
} from "lucide-react";
import { RAFFLE_CONFIG } from "@shared/raffle";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LandingHome() {
  const [, navigate] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Admin Access State
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

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

  const handleAdminAccess = () => {
    if (adminPassword === "panochonas12") {
      setShowAdminPrompt(false);
      setAdminPassword("");
      navigate("/admin");
    } else {
      toast.error("Contraseña incorrecta");
      setAdminPassword("");
    }
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
                    <button
                      onClick={() => handleNavigate("/historias")}
                      className="w-full px-4 md:px-5 py-3 md:py-4 text-left text-xs md:text-sm font-medium text-gray-900 hover:bg-white/60 transition-all duration-200 flex items-center gap-3 hover:translate-x-1 animate-in fade-in slide-in-from-top-2 duration-300 delay-300"
                    >
                      <MessageCircle className="size-4 md:size-5" />
                      <span>Historias</span>
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
        {/* Noticias Section - Tarjeta Grande */}
        <div className="mb-8 md:mb-12">
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-48 md:h-64 bg-gradient-to-br from-emerald-400 to-teal-400 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/d/16_3UTSlqrB1VHVIVM4cMMea0n96vm7Is"
                  alt="Noticias K-POP"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-4 md:p-8 flex flex-col justify-center md:w-1/2">
                <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 flex items-center gap-2">
                  <Newspaper className="size-5 md:size-6 text-emerald-600" />
                  Noticias K-POP
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">
                  Mantente al día con las últimas novedades, regresos y eventos de tus grupos favoritos.
                </p>
                <Button
                  onClick={() => navigate("/noticias")}
                  className="w-full md:w-fit gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  <Newspaper className="size-4" />
                  Ver todas las noticias
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Secciones */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {/* Tienda */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-blue-400 to-indigo-400 overflow-hidden">
                <img
                  src="/assets/imagentienda.png"
                  alt="Tienda K-POP"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Store className="size-4 md:size-5 text-blue-600" />
                  Tienda
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Explora nuestra colección de álbumes, mercancía oficial y más.
                </p>
                <Button
                  onClick={() => navigate("/tienda")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Store className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ir a la Tienda</span>
                  <span className="md:hidden">Tienda</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Galerias */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-rose-400 to-pink-400 overflow-hidden">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663470405189/BXfaoAKIojRjPgam.png"
                  alt="Galerias K-POP"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Images className="size-4 md:size-5 text-rose-600" />
                  Galerias
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Disfruta de las mejores fotos y visuales de tus idols preferidos.
                </p>
                <Button
                  disabled
                  className="w-full gap-1 md:gap-2 bg-slate-200 text-slate-500 text-xs md:text-sm py-1 md:py-2 cursor-not-allowed"
                >
                  <Clock className="size-3 md:size-4" />
                  <span>Próximamente</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Biografias */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-purple-400 to-violet-400 overflow-hidden">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663470405189/nZHSklzIKsAgLUdi.png"
                  alt="Biografias K-POP"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Users className="size-4 md:size-5 text-purple-600" />
                  Biografias
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Conoce la historia, logros y curiosidades de los grupos más populares.
                </p>
                <Button
                  onClick={() => navigate("/biografias")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Users className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ver Biografias</span>
                  <span className="md:hidden">Bios</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Diploma */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-purple-400 to-violet-400 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/d/1gk6QkcP5Jgr-ou_Ay4inkaSaxVgmvWuw"
                  alt="Diploma ARMY"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                />
                {/* Capa invisible de protección */}
                <div 
                  className="absolute inset-0 z-10" 
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <Award className="size-4 md:size-5 text-purple-600" />
                  Diploma
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Crea tu diploma ARMY personalizado y descárgalo.
                </p>
                <Button
                  onClick={() => navigate("/diploma")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <Award className="size-3 md:size-4" />
                  <span className="hidden md:inline">Ir a Diplomas</span>
                  <span className="md:hidden">Diplomas</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Historias Section */}
          <Card className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
            <CardContent className="p-0">
              <div className="relative h-32 md:h-48 bg-gradient-to-br from-pink-400 to-purple-400 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/d/1_Bc-X7xfBNUcvhwi5M9XsNvUaHJzkw3t"
                  alt="Muro de Ilusiones"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-3 md:p-6">
                <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2 flex items-center gap-2">
                  <MessageCircle className="size-4 md:size-5 text-pink-600" />
                  Historias
                </h2>
                <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 hidden md:block">
                  Comparte tu historia con el K-Pop y léela traducida al coreano.
                </p>
                <Button
                  onClick={() => navigate("/historias")}
                  className="w-full gap-1 md:gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs md:text-sm py-1 md:py-2"
                >
                  <MessageCircle className="size-3 md:size-4" />
                  <span className="hidden md:inline">Escribir mi Historia</span>
                  <span className="md:hidden">Historias</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Historias Wall Section */}
      <StoriesWall />

      {/* Legal Footer */}
      <LegalFooter
        title={`© ${new Date().getFullYear()} ${RAFFLE_CONFIG.storeName}`}
        description={`${RAFFLE_CONFIG.storeName} es una tienda especializada en productos K-POP. Todos los derechos de autor y marcas registradas pertenecen a sus respectivos propietarios. Los contenidos mostrados en este sitio son solo con fines informativos y educativos.`}
        storeName={RAFFLE_CONFIG.storeName}
      />

      {/* Footer */}
      <footer className="py-8 md:py-12 bg-white border-t border-border/50">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={RAFFLE_CONFIG.logoUrl}
                  alt={RAFFLE_CONFIG.storeName}
                  onClick={() => setShowAdminPrompt(true)}
                  className="h-10 w-10 rounded-xl shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                  title="Eter"
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
                <a href="/terminos" className="hover:text-slate-900 transition-colors">Términos</a>
                <a href="/privacidad" className="hover:text-slate-900 transition-colors">Privacidad</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} {RAFFLE_CONFIG.storeName}. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Admin Password Modal */}
        {showAdminPrompt && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm"
            >
              <Card className="bg-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                  <div className="bg-purple-100 size-12 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <ShieldCheck className="size-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-black text-center text-slate-900 uppercase tracking-tight mb-2">Acceso Restringido</h2>
                  <p className="text-xs text-slate-400 text-center mb-6 font-medium">Ingresa la contraseña maestra para continuar</p>
                  
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdminAccess();
                    }}
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl mb-4 bg-slate-50 focus:border-purple-600 focus:outline-none transition-all text-center font-bold"
                    autoFocus
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleAdminAccess}
                      className="w-full bg-purple-600 hover:bg-purple-700 h-12 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Entrar al Panel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAdminPrompt(false);
                        setAdminPassword("");
                      }}
                      variant="ghost"
                      className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </footer>
    </div>
  );
}
