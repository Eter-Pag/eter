import { useLocation } from "wouter";
import { Home, Newspaper, ShoppingBag, Calendar, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
}

export function MobileBottomNav() {
  const [location, navigate] = useLocation();

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
    {
      icon: <Gamepad2 className="size-6" />,
      label: "Quizzes",
      path: "/quizzes",
      color: "from-pink-500 to-rose-500",
    },
  ];

  const isActive = (path: string) => location === path;

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
        </div>
      </motion.nav>
    </>
  );
}
