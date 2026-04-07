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
  Brain,
  Newspaper,
  Instagram,
  Youtube,
  Facebook,
  Award,
  MessageCircle,
  Clock,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { STORE_CONFIG } from "@shared/const";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function LandingHome() {
  const [, navigate] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [productCarouselIndex, setProductCarouselIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Admin Access State
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // Fetch products
  const { data: products = [] } = trpc.products.list.useQuery();

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
    setIsMobileMenuOpen(false);
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

  const menuItems = [
    { icon: Newspaper, label: "Noticias", path: "/noticias" },
    { icon: Store, label: "Tienda", path: "/tienda" },
    { icon: Images, label: "Galerías", path: "/galerias" },
    { icon: Users, label: "Biografías", path: "/biografias" },
    { icon: MessageCircle, label: "Historias", path: "/historias" },
    { icon: Brain, label: "Quizzes", path: "/quizzes" },
  ];

  const sections = [
    {
      icon: Images,
      title: "Galerías",
      description: "Disfruta de las mejores fotos y visuales de tus idols preferidos.",
      path: "/galerias",
      color: "from-rose-500 to-pink-500",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663470405189/BXfaoAKIojRjPgam.png",
    },
    {
      icon: Users,
      title: "Biografías",
      description: "Conoce la historia, logros y curiosidades de los grupos más populares.",
      path: "/biografias",
      color: "from-purple-500 to-violet-500",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663470405189/nZHSklzIKsAgLUdi.png",
    },
    {
      icon: Award,
      title: "Diplomas",
      description: "Crea tu diploma ARMY personalizado y descárgalo.",
      path: "/diploma",
      color: "from-indigo-500 to-purple-500",
      image: "https://lh3.googleusercontent.com/d/1gk6QkcP5Jgr-ou_Ay4inkaSaxVgmvWuw",
    },
    {
      icon: MessageCircle,
      title: "Historias",
      description: "Comparte tu historia con el K-Pop y léela traducida al coreano.",
      path: "/historias",
      color: "from-pink-500 to-rose-500",
      image: "https://lh3.googleusercontent.com/d/1_Bc-X7xfBNUcvhwi5M9XsNvUaHJzkw3t",
    },
    {
      icon: Brain,
      title: "Quizzes",
      description: "Pon a prueba tu pasión y demuestra cuánto sabes de tus grupos favoritos.",
      path: "/quizzes",
      color: "from-violet-500 to-fuchsia-500",
      image: "https://lh3.googleusercontent.com/d/16_3UTSlqrB1VHVIVM4cMMea0n96vm7Is",
    },
  ];

  // Carousel logic
  const itemsPerPageDesktop = 3;
  const itemsPerPageMobile = 1;

  const handlePrevProduct = () => {
    setProductCarouselIndex((prev) => (prev === 0 ? Math.max(0, products.length - itemsPerPageDesktop) : prev - 1));
  };

  const handleNextProduct = () => {
    setProductCarouselIndex((prev) => {
      const maxIndex = Math.max(0, products.length - itemsPerPageDesktop);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const visibleProducts = products.slice(productCarouselIndex, productCarouselIndex + itemsPerPageDesktop);

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Premium Design */}
      <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-2xl border-b border-border/30 shadow-sm">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
          >
            <img
              src={STORE_CONFIG.logoUrl}
              alt={STORE_CONFIG.storeName}
              className="h-9 w-9 rounded-xl shadow-md"
            />
            <span className="font-bold text-base tracking-tight hidden md:inline">
              {STORE_CONFIG.storeName}
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.slice(0, 3).map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate(item.path)}
                className="text-xs font-medium hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs font-medium gap-1 hidden md:flex bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
              <ShieldCheck className="size-3" />
              Sitio Oficial
            </Badge>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden border-t border-border/30 bg-white/50 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium hover:bg-purple-50 hover:text-purple-600"
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon className="size-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section - Premium */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative container py-12 md:py-24 text-center text-white">
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 text-sm font-medium border border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="size-4" />
            <span>Bienvenido a ETER KPOP MX</span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-black tracking-tight mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Descubre el Mundo K-POP
          </motion.h1>

          <motion.p 
            className="text-white/80 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Productos exclusivos, contenido premium y experiencias únicas de tus artistas favoritos. Todo en un solo lugar.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => handleNavigate("/tienda")}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 h-12 rounded-full"
            >
              <Store className="size-5" />
              Explorar Tienda
              <ArrowRight className="size-5" />
            </Button>
            <Button
              onClick={() => handleNavigate("/noticias")}
              variant="outline"
              className="gap-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 h-12 rounded-full"
            >
              <Newspaper className="size-5" />
              Últimas Noticias
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Section - Noticias */}
      <section className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass-effect overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <CardContent className="p-0 flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/2 h-64 md:h-80 bg-gradient-to-br from-emerald-500 to-teal-500 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/d/16_3UTSlqrB1VHVIVM4cMMea0n96vm7Is"
                  alt="Noticias K-POP"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-6 md:p-12 flex flex-col justify-center md:w-1/2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                  <h2 className="text-2xl md:text-4xl font-black">Noticias K-POP</h2>
                </div>
                <p className="text-slate-600 text-base md:text-lg mb-6 leading-relaxed">
                  Mantente al día con las últimas novedades, regresos, conciertos y eventos de tus grupos favoritos. Cobertura completa del mundo K-POP en México.
                </p>
                <Button
                  onClick={() => navigate("/noticias")}
                  className="w-full md:w-fit gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 h-12 rounded-full"
                >
                  <Newspaper className="size-5" />
                  Ver todas las noticias
                  <ArrowRight className="size-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Featured Section - Tienda con Carrusel */}
      <section className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass-effect overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <CardContent className="p-0 flex flex-col md:flex-row">
              {/* Columna Izquierda: Imagen, Texto y Botón */}
              <div className="w-full md:w-1/3 flex flex-col">
                {/* Imagen */}
                <div className="relative h-48 md:h-80 bg-gradient-to-br from-blue-500 to-indigo-500 overflow-hidden">
                  <img
                    src="/assets/imagentienda.png"
                    alt="Tienda K-POP"
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Texto y Botón */}
                <div className="p-4 md:p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                      <h2 className="text-lg md:text-2xl font-black">Tienda K-POP</h2>
                    </div>
                    <p className="text-slate-600 text-xs md:text-sm mb-4 leading-relaxed">
                      Explora nuestra colección exclusiva de álbumes, mercancía oficial y productos premium.
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate("/tienda")}
                    className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 h-10 rounded-lg text-sm"
                  >
                    <Store className="size-4" />
                    Ver tienda
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Columna Derecha: Carrusel de Productos */}
              <div className="w-full md:w-2/3 p-4 md:p-6 flex flex-col justify-between">
                {products.length > 0 ? (
                  <>
                    {/* Grid de Productos - Idéntico a Store.tsx */}
                    <div className="flex-grow flex items-center">
                      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {visibleProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ y: -8 }}
                            className="cursor-pointer"
                          >
                            <Card className="group h-full bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col">
                              <div className="relative aspect-square overflow-hidden bg-slate-100">
                                <img
                                  src={product.image || ""}
                                  alt={product.name || "Producto"}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {product.badge && (
                                  <Badge className="absolute top-4 right-4 bg-fuchsia-600 text-white border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest">
                                    {product.badge}
                                  </Badge>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                                    <Maximize2 className="size-6 text-white" />
                                  </div>
                                </div>
                              </div>
                              <CardContent className="p-5 flex flex-col flex-grow">
                                <h3 className="font-black text-slate-900 text-sm md:text-base mb-2 line-clamp-2 leading-tight uppercase tracking-tight">
                                  {product.name || "Producto sin nombre"}
                                </h3>
                                <div className="mt-auto pt-4 flex flex-col gap-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-xl md:text-2xl font-black text-purple-600 tracking-tighter">
                                      ${(Number(product.price) / 100).toFixed(2)} <span className="text-[10px] text-slate-400 uppercase">MXN</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest h-9 transition-all">
                                      Ver Detalles
                                    </Button>
                                    <a
                                      href={product.link || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-full"
                                    >
                                      <Button
                                        variant="outline"
                                        className="w-full rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-9 transition-all gap-2"
                                      >
                                        <ExternalLink className="size-3" />
                                        Comprar
                                      </Button>
                                    </a>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Controles del Carrusel */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Button
                        onClick={handlePrevProduct}
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                      >
                        <ChevronLeft className="size-5" />
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.ceil(products.length / itemsPerPageDesktop) }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 rounded-full transition-all ${
                              i === Math.floor(productCarouselIndex / itemsPerPageDesktop)
                                ? "w-6 bg-blue-600"
                                : "w-2 bg-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Button
                        onClick={handleNextProduct}
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-blue-50 hover:text-blue-600"
                      >
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 text-sm">Cargando productos...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Grid de Secciones - Premium */}
      <section className="container py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-black text-center mb-2">Explora Nuestras Secciones</h2>
          <p className="text-slate-500 text-center text-base">Acceso rápido a todo lo que necesitas sobre K-POP</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Card className="glass-effect overflow-hidden h-full hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className={`relative h-48 bg-gradient-to-br ${section.color} overflow-hidden`}>
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} bg-opacity-20`}>
                        <section.icon className="size-5 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold">{section.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm mb-6 flex-grow">
                      {section.description}
                    </p>
                    <Button
                      onClick={() => handleNavigate(section.path)}
                      className={`w-full gap-2 font-semibold px-6 h-11 rounded-lg transition-all bg-gradient-to-r ${section.color} text-white hover:shadow-lg`}
                    >
                      <section.icon className="size-4" />
                      Ir a {section.title}
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Historias Wall Section */}
      <StoriesWall />

      {/* Legal Footer */}
      <LegalFooter
        title={`© ${new Date().getFullYear()} ${STORE_CONFIG.storeName}`}
        description={`${STORE_CONFIG.storeName} es una tienda especializada en productos K-POP. Todos los derechos de autor y marcas registradas pertenecen a sus respectivos propietarios. Los contenidos mostrados en este sitio son solo con fines informativos y educativos.`}
        storeName={STORE_CONFIG.storeName}
      />

      {/* Footer - Premium */}
      <footer className="py-12 md:py-16 bg-gradient-to-b from-white to-slate-50 border-t border-border/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <motion.div 
              className="flex flex-col items-center md:items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowAdminPrompt(true)}>
                <img
                  src={STORE_CONFIG.logoUrl}
                  alt={STORE_CONFIG.storeName}
                  className="h-12 w-12 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                />
                <span className="font-black text-xl tracking-tight">
                  {STORE_CONFIG.storeName}
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs text-center md:text-left leading-relaxed">
                Tu destino número uno para todo lo relacionado con el K-POP en México.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-sm uppercase tracking-widest">Acceso Rápido</h3>
              <div className="flex flex-col gap-2 text-center md:text-left">
                {menuItems.slice(0, 3).map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className="text-slate-600 hover:text-purple-600 text-sm transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Social & Legal */}
            <motion.div 
              className="flex flex-col items-center md:items-end gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600 transition-all">
                  <Instagram className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600 transition-all">
                  <Youtube className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all">
                  <Facebook className="size-5" />
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-4 text-sm font-medium text-slate-500">
                <a href="/terminos" className="hover:text-slate-900 transition-colors">Términos</a>
                <a href="/privacidad" className="hover:text-slate-900 transition-colors">Privacidad</a>
              </div>
            </motion.div>
          </div>

          <div className="pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-400 text-xs font-medium">
              © {new Date().getFullYear()} {STORE_CONFIG.storeName}. Todos los derechos reservados. | Hecho con ❤️ para ARMY
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
              <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-100 to-pink-100 size-14 rounded-xl flex items-center justify-center mb-6 mx-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <ShieldCheck className="size-7 text-purple-600" />
                  </motion.div>
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
                    className="w-full px-6 py-3 border-2 border-slate-200 rounded-xl mb-4 bg-slate-50 focus:border-purple-600 focus:outline-none transition-all text-center font-semibold"
                    autoFocus
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleAdminAccess}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-11 rounded-lg font-black uppercase tracking-widest text-xs"
                    >
                      Entrar al Panel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAdminPrompt(false);
                        setAdminPassword("");
                      }}
                      variant="ghost"
                      className="w-full h-11 rounded-lg font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs uppercase tracking-widest"
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
