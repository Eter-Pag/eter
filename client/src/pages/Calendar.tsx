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
  Users,
  Film,
  Sparkles,
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
        return "from-purple-500 to-pink-500";
      case "K-Drama":
        return "from-blue-500 to-cyan-500";
      case "K-Movie":
        return "from-orange-500 to-red-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "K-Pop":
        return <Sparkles className="h-3 w-3" />;
      case "K-Drama":
        return <Film className="h-3 w-3" />;
      case "K-Movie":
        return <Film className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 p-4">
        <div className="container flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-purple-600" />
            Calendario de Cumpleaños
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-8 px-4">
        {/* Cumpleaños de Hoy */}
        {todayBirthdays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <Cake className="h-5 w-5 text-yellow-600" />
                  Cumpleaños de Hoy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayBirthdays.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-white rounded-lg border border-yellow-200 shadow-sm"
                    >
                      <p className="font-bold text-slate-900">{entry.name}</p>
                      {entry.group && (
                        <p className="text-sm text-slate-600">{entry.group}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-yellow-600 text-white text-xs">
                          {entry.category}
                        </Badge>
                        {entry.year && (
                          <span className="text-xs text-slate-500">
                            {new Date().getFullYear() - entry.year} años
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filtros y Búsqueda */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre o grupo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "K-Pop", "K-Drama", "K-Movie"] as const).map(
              (category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`gap-2 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : ""
                  }`}
                >
                  {category === "all" && <CalendarIcon className="h-4 w-4" />}
                  {category === "K-Pop" && <Sparkles className="h-4 w-4" />}
                  {category === "K-Drama" && <Film className="h-4 w-4" />}
                  {category === "K-Movie" && <Film className="h-4 w-4" />}
                  {category === "all" ? "Todos" : category}
                </Button>
              )
            )}
          </div>
        </motion.div>

        {/* Navegación de Meses */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
                  }
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold text-center flex-1">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
                  }
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Grid de días */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-bold text-slate-600 text-sm py-2"
                    >
                      {day}
                    </div>
                  )
                )}

                {Array.from({ length: DAYS_IN_MONTH[currentMonth] }).map(
                  (_, day) => {
                    const dayNum = day + 1;
                    const hasBirthdays = monthBirthdays[dayNum];
                    const isToday =
                      dayNum === today.getDate() &&
                      currentMonth === today.getMonth();

                    return (
                      <motion.button
                        key={dayNum}
                        onClick={() =>
                          setSelectedDay(
                            selectedDay === dayNum ? null : dayNum
                          )
                        }
                        whileHover={{ scale: 1.05 }}
                        className={`p-3 rounded-lg text-center font-semibold transition-all ${
                          isToday
                            ? "bg-yellow-200 border-2 border-yellow-500 text-yellow-900"
                            : hasBirthdays
                            ? "bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-400 text-purple-900 cursor-pointer hover:shadow-lg"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        } ${selectedDay === dayNum ? "ring-2 ring-purple-600" : ""}`}
                      >
                        <div className="text-sm">{dayNum}</div>
                        {hasBirthdays && (
                          <div className="text-xs mt-1 font-bold">
                            {hasBirthdays.length} 🎂
                          </div>
                        )}
                      </motion.button>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detalles del día seleccionado */}
        <AnimatePresence>
          {selectedDay && monthBirthdays[selectedDay] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="bg-white shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cake className="h-5 w-5 text-pink-600" />
                    Cumpleaños del {selectedDay} de {MONTHS[currentMonth]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {monthBirthdays[selectedDay].map((entry, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-lg border-2 bg-gradient-to-br ${getCategoryColor(
                          entry.category
                        )} bg-opacity-10`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-slate-900 text-lg">
                              {entry.name}
                            </p>
                            {entry.group && (
                              <p className="text-sm text-slate-600">
                                {entry.group}
                              </p>
                            )}
                          </div>
                          <Badge className="gap-1">
                            {getCategoryIcon(entry.category)}
                            {entry.category}
                          </Badge>
                        </div>
                        {entry.year && (
                          <p className="text-xs text-slate-500">
                            Nacido en {entry.year} (
                            {new Date().getFullYear() - entry.year} años)
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resumen del mes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader>
              <CardTitle>Resumen de {MONTHS[currentMonth]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.keys(monthBirthdays).length}
                  </p>
                  <p className="text-sm text-slate-600">Días con cumpleaños</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-pink-600">
                    {Object.values(monthBirthdays).reduce(
                      (sum, arr) => sum + arr.length,
                      0
                    )}
                  </p>
                  <p className="text-sm text-slate-600">Cumpleaños totales</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {Object.values(monthBirthdays)
                      .flat()
                      .filter((e) => e.category === "K-Pop").length}
                  </p>
                  <p className="text-sm text-slate-600">K-Pop</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {Object.values(monthBirthdays)
                      .flat()
                      .filter((e) => e.category !== "K-Pop").length}
                  </p>
                  <p className="text-sm text-slate-600">Otros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
