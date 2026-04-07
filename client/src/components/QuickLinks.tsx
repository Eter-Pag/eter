import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Newspaper, ShoppingBag, Calendar, Gamepad2, Sparkles } from "lucide-react";

interface QuickLink {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
  bgColor: string;
}

export function QuickLinks() {
  const [, navigate] = useLocation();

  const quickLinks: QuickLink[] = [
    {
      icon: <Newspaper className="size-8" />,
      label: "Noticias",
      path: "/noticias",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <ShoppingBag className="size-8" />,
      label: "Tienda",
      path: "/tienda",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Calendar className="size-8" />,
      label: "Calendario",
      path: "/calendario",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      icon: <Gamepad2 className="size-8" />,
      label: "Quizzes",
      path: "/quizzes",
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <section className="md:hidden container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-5 text-purple-600" />
          <h2 className="text-lg font-black text-slate-900">Accesos Rápidos</h2>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-3"
      >
        {quickLinks.map((link) => (
          <motion.button
            key={link.path}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(link.path)}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300 ${link.bgColor} hover:shadow-lg group`}
          >
            <div className={`${link.color} group-hover:scale-110 transition-transform duration-300`}>
              {link.icon}
            </div>
            <span className={`text-sm font-bold ${link.color}`}>{link.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
