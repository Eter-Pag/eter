import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Calendar, MapPin, Clock,
  ExternalLink, Loader2, Search, Ticket,
  ArrowRight, Star,
} from "lucide-react";

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyEgUCF8FawfIfqIDIigz9MdQIDJ_iFcAt1vo7T1phRC9gAxZYtd9zy0AE1HJhREPXJ/exec";
const EVENT_DETAILS_URL = SHEETS_URL + "?sheet=event_details";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const TIPO_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  bts:       { label: "BTS",       color: "from-purple-600 to-pink-600",   bg: "bg-purple-100 text-purple-700",   emoji: "💜" },
  concierto: { label: "Concierto", color: "from-pink-600 to-rose-600",     bg: "bg-pink-100 text-pink-700",       emoji: "🎤" },
  album:     { label: "Álbum",     color: "from-blue-600 to-indigo-600",   bg: "bg-blue-100 text-blue-700",       emoji: "💿" },
  army:      { label: "ARMY",      color: "from-emerald-600 to-teal-600",  bg: "bg-emerald-100 text-emerald-700", emoji: "🪖" },
  personal:  { label: "Personal",  color: "from-amber-500 to-orange-500",  bg: "bg-amber-100 text-amber-700",     emoji: "⭐" },
  default:   { label: "Evento",    color: "from-slate-500 to-slate-700",   bg: "bg-slate-100 text-slate-700",     emoji: "📡" },
};

function getTipo(type: string) {
  return TIPO_CONFIG[(type || "").toLowerCase()] ?? TIPO_CONFIG["default"];
}


interface Evento {
  id: string;
  slug?: string;
  day: string;
  month: string;
  year: string;
  title: string;
  type: string;
  summary?: string;
  description?: string;
  image?: string;
  location?: string;
  time?: string;
  ticketsUrl?: string;
  extraUrl?: string;
  tags?: string;
  createdAt?: string;
}

type Filtro = "todos" | "bts" | "concierto" | "album" | "army" | "personal";

export default function Eventos() {
  const [, navigate] = useLocation();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const res = await fetch(EVENT_DETAILS_URL);
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          const sorted = [...json.data].sort((a, b) => {
            const da = new Date(Number(a.year || 0), Number(a.month || 1) - 1, Number(a.day || 1));
            const db = new Date(Number(b.year || 0), Number(b.month || 1) - 1, Number(b.day || 1));
            return db.getTime() - da.getTime();
          });
          setEventos(sorted);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  const eventosFiltrados = eventos.filter((ev) => {
    const matchFiltro = filtro === "todos" || (ev.type || "").toLowerCase() === filtro;
    const matchBusqueda =
      !busqueda ||
      (ev.title || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (ev.location || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (ev.tags || "").toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusqueda;
  });

  const filtros: { id: Filtro; label: string; emoji: string }[] = [
    { id: "todos",     label: "Todos",      emoji: "🌟" },
    { id: "bts",       label: "BTS",        emoji: "💜" },
    { id: "concierto", label: "Conciertos", emoji: "🎤" },
    { id: "album",     label: "Álbumes",    emoji: "💿" },
    { id: "army",      label: "ARMY",       emoji: "🪖" },
    { id: "personal",  label: "Personal",   emoji: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      <div className="fixed inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20 p-4">
        <div className="container flex items-center justify-between max-w-6xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-white hover:bg-white/20">
            <ArrowLeft className="size-4" /> Inicio
          </Button>
          <h1 className="font-black text-lg text-white flex items-center gap-2">
            <Calendar className="size-5 text-purple-400" /> Eventos
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container py-10 px-4 relative z-10 max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-4 text-sm font-medium border border-white/20 text-white/80">
            <Star className="size-4 text-yellow-400" /> Todos los eventos K-POP
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">Eventos & Fechas</h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Conciertos, lanzamientos de álbumes, fechas especiales y más. No te pierdas nada.
          </p>
        </motion.div>

        {/* Búsqueda */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
            <Input
              placeholder="Buscar eventos, lugares, tags..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 h-12 rounded-2xl backdrop-blur-xl focus:bg-white/15 focus:border-white/40"
            />
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap justify-center gap-2 mb-10">
          {filtros.map((f) => (
            <button key={f.id} onClick={() => setFiltro(f.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                filtro === f.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
              }`}
            >
              <span>{f.emoji}</span> {f.label}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-24">
            <Loader2 className="size-10 animate-spin text-purple-400" />
            <p className="text-white/50 font-medium">Cargando eventos...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">😢</div>
            <p className="text-white/60 font-medium">No pudimos cargar los eventos. Intenta de nuevo.</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && eventosFiltrados.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white/60 font-medium">No hay eventos que coincidan con tu búsqueda.</p>
            <Button onClick={() => { setBusqueda(""); setFiltro("todos"); }} variant="ghost"
              className="mt-4 text-white/50 hover:text-white hover:bg-white/10">
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Grid de eventos */}
        {!loading && !error && eventosFiltrados.length > 0 && (
          <>
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 text-center">
              {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? "s" : ""}
            </div>
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {eventosFiltrados.map((ev, idx) => {
                  const tipo = getTipo(ev.type);
                  const mesNombre = MESES[Number(ev.month) - 1] ?? "";
                  const fecha = `${ev.day} ${mesNombre}${ev.year ? ` ${ev.year}` : ""}`;
                  const tags = ev.tags ? ev.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
                  const hasSlug = Boolean(ev.slug);

                  return (
                    <motion.div key={ev.id || idx}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.04 }}
                      whileHover={{ y: -6 }}
                      className="group cursor-pointer"
                      onClick={() => hasSlug && navigate(`/evento/${ev.slug}`)}
                    >
                      <Card className="bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden h-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 rounded-3xl">

                        {/* Imagen o franja de color */}
                        {ev.image ? (
                          <div className="relative h-44 overflow-hidden">
                            <img src={ev.image} alt={ev.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute top-3 left-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${tipo.color} text-white shadow-lg`}>
                                {tipo.emoji} {tipo.label}
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-xs font-bold">
                              <Calendar className="size-3" /> {fecha}
                            </div>
                          </div>
                        ) : (
                          <div className={`h-2 w-full bg-gradient-to-r ${tipo.color}`} />
                        )}

                        <CardContent className="p-5">
                          {/* Badge + fecha cuando no hay imagen */}
                          {!ev.image && (
                            <div className="flex items-center justify-between mb-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tipo.bg}`}>
                                {tipo.emoji} {tipo.label}
                              </span>
                              <div className="flex items-center gap-1 text-white/50 text-xs font-bold">
                                <Calendar className="size-3" /> {fecha}
                              </div>
                            </div>
                          )}

                          {/* Título */}
                          <h3 className="font-black text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {ev.title}
                          </h3>

                          {/* Resumen */}
                          {(ev.summary || ev.description) && (
                            <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-3">
                              {ev.summary || ev.description}
                            </p>
                          )}

                          {/* Lugar y hora */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                            {ev.location && (
                              <div className="flex items-center gap-1 text-purple-300 text-xs font-semibold">
                                <MapPin className="size-3" /> {ev.location}
                              </div>
                            )}
                            {ev.time && (
                              <div className="flex items-center gap-1 text-white/40 text-xs font-semibold">
                                <Clock className="size-3" /> {ev.time}
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="bg-white/10 text-white/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Botones */}
                          <div className="flex gap-2 pt-1">
                            {hasSlug ? (
                              <Button size="sm"
                                className={`flex-1 h-9 gap-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl bg-gradient-to-r ${tipo.color} text-white border-none`}
                                onClick={(e) => { e.stopPropagation(); navigate(`/evento/${ev.slug}`); }}
                              >
                                Ver evento <ArrowRight className="size-3" />
                              </Button>
                            ) : (
                              <div className="flex-1" />
                            )}
                            {ev.ticketsUrl && (
                              <a href={ev.ticketsUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="outline"
                                  className="h-9 gap-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border-purple-400/40 text-purple-300 hover:bg-purple-400/10">
                                  <Ticket className="size-3" /> Boletos
                                </Button>
                              </a>
                            )}
                            {!ev.ticketsUrl && ev.extraUrl && (
                              <a href={ev.extraUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="outline"
                                  className="h-9 gap-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border-white/20 text-white/50 hover:bg-white/10">
                                  <ExternalLink className="size-3" /> Info
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}
