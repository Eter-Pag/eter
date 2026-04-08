import { useLocation } from "wouter";
import { Home, Newspaper, ShoppingBag, Calendar, Menu, ArrowRight, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

interface MenuSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  color: string;
}

export function MobileBottomNav() {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      icon: <Home className="size-6" />,
      label: "Inicio",
      path: "/",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Newspaper className="size-6" />,
      label: "Noticias",
      path: "/noticias",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <ShoppingBag className="size-6" />,
      label: "Tienda",
      path: "/tienda",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Calendar className="size-6" />,
      label: "Calendario",
      path: "/calendario",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const menuSections: MenuSection[] = [
    {
      icon: <ShoppingBag className="size-5" />,
      title: "Tienda",
      description: "Explora nuestros productos K-POP",
      path: "/tienda",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Calendar className="size-5" />,
      title: "Calendario",
      description: "Efemérides y eventos especiales",
      path: "/calendario",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: <Download className="size-5" />,
      title: "Calendario BTS 2026",
      description: "Descarga gratis listo para imprimir",
      path: "/calendario-bts",
      color: "from-purple-600 to-pink-600",
    },
    {
      icon: <Sparkles className="size-5" />,
      title: "Historias",
      description: "Muro de Ilusiones - Comparte tu historia",
      path: "/historias",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: <Newspaper className="size-5" />,
      title: "Noticias",
      description: "Últimas noticias del K-POP",
      path: "/noticias",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const isActive = (path: string) => location === path;

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Spacer para que el contenido no quede debajo de la barra */}
      <div className="h-24 md:h-0" />

      {/* Barra de Navegación Inferior - Solo en móviles */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 md:hidden bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-xl border-t border-white/10 z-40"
      >
        <div className="flex justify-around items-center h-20 px-2">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 relative group ${
                isActive(item.path)
                  ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {/* Icono */}
              <div className="relative">
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navGlow"
                    className="absolute inset-0 blur-xl opacity-50 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {item.icon}
              </div>

              {/* Label */}
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                {item.label}
              </span>

              {/* Indicador de activo */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 h-1 w-8 bg-gradient-to-r from-white/0 via-white to-white/0 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}

          {/* Botón "Ver todo" */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 text-slate-400 hover:text-white"
          >
            <div className="relative">
              <Menu className="size-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Ver todo
            </span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Sheet/Drawer con todas las secciones */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/10">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-white text-2xl font-black">Todas las Secciones</SheetTitle>
          </SheetHeader>

          <div className="grid grid-cols-1 gap-3 overflow-y-auto h-[calc(80vh-120px)] pr-4">
            {menuSections.map((section) => (
              <motion.button
                key={section.path}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMenuItemClick(section.path)}
                className={`p-4 rounded-2xl bg-gradient-to-br ${section.color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all text-left group`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base mb-1">{section.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{section.description}</p>
                  </div>
                  <ArrowRight className="size-5 text-slate-400 group-hover:text-white transition-colors flex-shrink-0 mt-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
