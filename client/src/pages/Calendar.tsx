import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  Cake,
  Calendar as CalendarIcon,
  Sparkles,
  Film,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { BIRTHDAYS } from "@shared/birthdays";

type Category = "all" | "K-Pop" | "K-Drama" | "K-Movie";

interface BirthdayEntry {
  name: string;
  group?: string;
  category: string;
  year?: number;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DAYS_OF_WEEK = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function Calendar() {
  const [, navigate] = useLocation();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Obtener cumpleaños de hoy
  const today = new Date();
  const todayKey = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
  const todayBirthdays = BIRTHDAYS[todayKey] || [];

  // Obtener cumpleaños del mes actual
  const monthBirthdays = useMemo(() => {
    const result: { [key: number]: BirthdayEntry[] } = {};

    for (let day = 1; day <= DAYS_IN_MONTH[currentMonth]; day++) {
      const dateKey = `${String(currentMonth + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const entries = BIRTHDAYS[dateKey] || [];

      let filtered = entries;
      if (selectedCategory !== "all") {
        filtered = entries.filter((e) => e.category === selectedCategory);
      }
      if (searchQuery) {
        filtered = filtered.filter(
          (e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.group?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filtered.length > 0) {
        result[day] = filtered;
      }
    }

    return result;
  }, [currentMonth, selectedCategory, searchQuery]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "K-Pop":
        return {
          gradient: "from-purple-500 to-pink-500",
          light: "from-purple-100 to-pink-100",
          border: "border-purple-300",
          text: "text-purple-900",
          badge: "bg-purple-600 text-white",
        };
      case "K-Drama":
        return {
          gradient: "from-blue-500 to-cyan-500",
          light: "from-blue-100 to-cyan-100",
          border: "border-blue-300",
          text: "text-blue-900",
          badge: "bg-blue-600 text-white",
        };
      case "K-Movie":
        return {
          gradient: "from-orange-500 to-red-500",
          light: "from-orange-100 to-red-100",
          border: "border-orange-300",
          text: "text-orange-900",
          badge: "bg-orange-600 text-white",
        };
      default:
        return {
          gradient: "from-slate-500 to-slate-600",
          light: "from-slate-100 to-slate-200",
          border: "border-slate-300",
          text: "text-slate-900",
          badge: "bg-slate-600 text-white",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "K-Pop":
        return <Sparkles className="h-3.5 w-3.5" />;
      case "K-Drama":
        return <Film className="h-3.5 w-3.5" />;
      case "K-Movie":
        return <Film className="h-3.5 w-3.5" />;
      default:
        return <Cake className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20 p-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="font-black text-lg flex items-center gap-2 text-white drop-shadow-lg">
            <CalendarIcon className="h-5 w-5 text-yellow-400" />
            Calendario de Cumpleaños
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-8 px-4 relative z-10">
        {/* Cumpleaños de Hoy */}
        <AnimatePresence>
          {todayBirthdays.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000 animate-pulse" />
                
                <Card className="relative bg-gradient-to-br from-yellow-50/95 to-orange-50/95 border-2 border-yellow-300 shadow-2xl backdrop-blur-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-yellow-900">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        🎂
                      </motion.div>
                      Cumpleaños de Hoy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {todayBirthdays.map((entry, idx) => {
                        const colors = getCategoryColor(entry.category);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-4 rounded-xl bg-gradient-to-br ${colors.light} border-2 ${colors.border} shadow-lg hover:shadow-xl transition-all hover:scale-105`}
                          >
                            <p className={`font-black text-sm ${colors.text}`}>{entry.name}</p>
                            {entry.group && (
                              <p className={`text-xs opacity-75 ${colors.text} mt-1`}>{entry.group}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <Badge className={`text-xs gap-1 ${colors.badge}`}>
                                {getCategoryIcon(entry.category)}
                                {entry.category}
                              </Badge>
                              {entry.year && (
                                <span className={`text-xs font-semibold ${colors.text}`}>
                                  {new Date().getFullYear() - entry.year} años
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros y Búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/60" />
            <Input
              placeholder="Buscar por nombre o grupo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-xl focus:bg-white/20 focus:border-white/40 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "K-Pop", "K-Drama", "K-Movie"] as const).map(
              (category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-bold text-sm gap-2 flex items-center transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-xl"
                  }`}
                >
                  {category === "all" && <CalendarIcon className="h-4 w-4" />}
                  {category === "K-Pop" && <Sparkles className="h-4 w-4" />}
                  {(category === "K-Drama" || category === "K-Movie") && (
                    <Film className="h-4 w-4" />
                  )}
                  {category === "all" ? "Todos" : category}
                </motion.button>
              )
            )}
          </div>
        </motion.div>

        {/* Calendario Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000" />
            
            <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden">
              {/* Header del Calendario */}
              <CardHeader className="pb-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
                    }
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </motion.button>
                  
                  <motion.h2
                    key={currentMonth}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black text-center flex-1 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg"
                  >
                    {MONTHS[currentMonth]} {currentYear}
                  </motion.h2>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
                    }
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </motion.button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {DAYS_OF_WEEK.map((day) => (
                    <div
                      key={day}
                      className="text-center font-black text-white/70 text-sm py-3 border-b border-white/10"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid de días */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: DAYS_IN_MONTH[currentMonth] }).map(
                    (_, day) => {
                      const dayNum = day + 1;
                      const hasBirthdays = monthBirthdays[dayNum];
                      const isToday =
                        dayNum === today.getDate() &&
                        currentMonth === today.getMonth();
                      const isSelected = selectedDay === dayNum;

                      return (
                        <motion.button
                          key={dayNum}
                          onClick={() =>
                            setSelectedDay(
                              selectedDay === dayNum ? null : dayNum
                            )
                          }
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className={`aspect-square p-2 rounded-xl font-bold text-sm transition-all relative overflow-hidden group ${
                            isToday
                              ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/50 border-2 border-yellow-300"
                              : hasBirthdays
                              ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 text-white border-2 border-purple-400/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer"
                              : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:border-white/20"
                          } ${
                            isSelected
                              ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900"
                              : ""
                          }`}
                        >
                          {/* Fondo animado para días con cumpleaños */}
                          {hasBirthdays && !isToday && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20"
                              animate={{ opacity: [0.5, 0.8, 0.5] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          )}

                          <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            <span className="text-lg">{dayNum}</span>
                            {hasBirthdays && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-xs font-black mt-0.5"
                              >
                                {hasBirthdays.length} 🎂
                              </motion.span>
                            )}
                          </div>
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Detalles del día seleccionado */}
        <AnimatePresence>
          {selectedDay && monthBirthdays[selectedDay] && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              className="mb-8"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20 transition duration-1000" />
                
                <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl">
                  <CardHeader className="pb-4 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3 text-white">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-2xl"
                      >
                        🎉
                      </motion.span>
                      Cumpleaños del {selectedDay} de {MONTHS[currentMonth]}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {monthBirthdays[selectedDay].map((entry, idx) => {
                        const colors = getCategoryColor(entry.category);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-5 rounded-2xl bg-gradient-to-br ${colors.light} border-2 ${colors.border} shadow-xl hover:shadow-2xl transition-all hover:scale-105 group cursor-pointer`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <p className={`font-black text-lg ${colors.text}`}>
                                  {entry.name}
                                </p>
                                {entry.group && (
                                  <p className={`text-sm opacity-75 ${colors.text} mt-1`}>
                                    {entry.group}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={`gap-1.5 ${colors.badge}`}>
                                {getCategoryIcon(entry.category)}
                                {entry.category}
                              </Badge>
                              {entry.year && (
                                <span className={`text-xs font-bold ${colors.text} bg-white/30 px-3 py-1 rounded-full`}>
                                  {new Date().getFullYear() - entry.year} años
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resumen del mes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-20 transition duration-1000" />
            
            <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="text-white">Resumen de {MONTHS[currentMonth]}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Días con cumpleaños",
                      value: Object.keys(monthBirthdays).length,
                      gradient: "from-purple-500 to-pink-500",
                      icon: "📅",
                    },
                    {
                      label: "Cumpleaños totales",
                      value: Object.values(monthBirthdays).reduce(
                        (sum, arr) => sum + arr.length,
                        0
                      ),
                      gradient: "from-pink-500 to-rose-500",
                      icon: "🎂",
                    },
                    {
                      label: "K-Pop",
                      value: Object.values(monthBirthdays)
                        .flat()
                        .filter((e) => e.category === "K-Pop").length,
                      gradient: "from-purple-600 to-violet-600",
                      icon: "✨",
                    },
                    {
                      label: "K-Drama & K-Movie",
                      value: Object.values(monthBirthdays)
                        .flat()
                        .filter((e) => e.category !== "K-Pop").length,
                      gradient: "from-blue-600 to-cyan-600",
                      icon: "🎬",
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 border-2 border-white/20 text-center hover:border-white/40 transition-all`}
                    >
                      <p className="text-2xl mb-2">{stat.icon}</p>
                      <p className="text-3xl font-black text-white mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm font-bold text-white/80">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
