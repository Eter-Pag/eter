import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Loader2,
  Share2,
  Smartphone,
  Globe,
  Ticket,
  Star,
} from "lucide-react";

// ─── Misma URL del Apps Script que usa la app ────────────────────────────────
const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbyEgUCF8FawfIfqIDIigz9MdQIDJ_iFcAt1vo7T1phRC9gAxZYtd9zy0AE1HJhREPXJ/exec";
const EVENT_DETAILS_URL = SHEETS_URL + "?sheet=event_details";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const TIPO_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  bts:       { label: "BTS",       color: "from-purple-600 to-pink-600",   emoji: "💜" },
  concierto: { label: "Concierto", color: "from-pink-600 to-rose-600",     emoji: "🎤" },
  album:     { label: "Álbum",     color: "from-blue-600 to-indigo-600",   emoji: "💿" },
  army:      { label: "ARMY",      color: "from-emerald-600 to-teal-600",  emoji: "🪖" },
  default:   { label: "Evento",    color: "from-amber-500 to-orange-500",  emoji: "📡" },
};

function getTipo(type: string) {
  return TIPO_CONFIG[(type || "").toLowerCase()] ?? TIPO_CONFIG["default"];
}

interface Evento {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  type: string;
  // Campos extra que agregarás a tu Sheet
  slug?: string;
  description?: string;
  image?: string;
  location?: string;
  time?: string;
  ticketsUrl?: string;
  extraUrl?: string;
  tags?: string;
  createdAt?: string;
}

export default function EventoDetalle() {
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        const res = await fetch(EVENT_DETAILS_URL);
        const json = await res.json();

        if (json.ok && Array.isArray(json.data)) {
          // Busca por slug
          const found = json.data.find(
            (ev: Evento) => ev.slug === slug
          );
          if (found) {
            setEvento(found);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: evento?.title || "Evento", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-purple-400" />
          <p className="text-white/60 font-medium">Cargando evento...</p>
        </div>
      </div>
    );
  }

  // ─── Error / No encontrado ───────────────────────────────────────────────────
  if (error || !evento) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-black text-white mb-2">Evento no encontrado</h2>
          <p className="text-white/60 mb-8">
            No encontramos este evento. Puede que haya sido eliminado o que el enlace sea incorrecto.
          </p>
          <Button
            onClick={() => navigate("/eventos")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
          >
            <ArrowLeft className="size-4 mr-2" />
            Ver Eventos
          </Button>
        </div>
      </div>
    );
  }

  const tipo = getTipo(evento.type);
  const mesNum = Number(evento.month) - 1;
  const mesNombre = MESES[mesNum] ?? "";
  const fechaFormateada = `${evento.day} de ${mesNombre}${evento.year ? `, ${evento.year}` : ""}`;
  const tags = evento.tags ? evento.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      {/* Fondo decorativo */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20 p-4">
        <div className="container flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/eventos")}
            className="gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            Eventos
          </Button>
          <span className="text-white/70 text-sm font-bold uppercase tracking-widest">
            {tipo.emoji} {tipo.label}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2 text-white hover:bg-white/20"
          >
            <Share2 className="size-4" />
            {copied ? "¡Copiado!" : "Compartir"}
          </Button>
        </div>
      </header>

      <main className="container py-10 px-4 relative z-10 max-w-4xl mx-auto">

        {/* ─── Hero ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Imagen portada */}
          {evento.image && (
            <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 relative shadow-2xl">
              <img
                src={evento.image}
                alt={evento.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Badge tipo + Fecha */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              className={`bg-gradient-to-r ${tipo.color} text-white border-none px-4 py-1.5 text-sm font-bold`}
            >
              {tipo.emoji} {tipo.label}
            </Badge>
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <Calendar className="size-4" />
              {fechaFormateada}
            </div>
            {evento.time && (
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <Clock className="size-4" />
                {evento.time}
              </div>
            )}
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {evento.title}
          </h1>

          {/* Lugar */}
          {evento.location && (
            <div className="flex items-center gap-2 text-purple-300 font-semibold mb-8">
              <MapPin className="size-5" />
              {evento.location}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-bold border border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── Descripción ────────────────────────────────────────────────────── */}
        {evento.description && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                  <Star className="size-5 text-purple-400" />
                  Sobre este evento
                </h2>
                <div className="prose prose-invert prose-purple max-w-none">
                  {evento.description.split("\n").map((párrafo, i) =>
                    párrafo.trim() ? (
                      <p key={i} className="text-white/80 text-base leading-relaxed mb-4 last:mb-0">
                        {párrafo}
                      </p>
                    ) : null
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── CTAs ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {evento.ticketsUrl && (
            <a href={evento.ticketsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full h-14 gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base rounded-xl shadow-lg">
                <Ticket className="size-5" />
                Conseguir Boletos
              </Button>
            </a>
          )}
          {evento.extraUrl && (
            <a href={evento.extraUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-14 gap-2 border-2 border-purple-400/50 text-purple-200 hover:bg-purple-400/10 font-bold text-base rounded-xl"
              >
                <ExternalLink className="size-5" />
                Más Información
              </Button>
            </a>
          )}
        </motion.div>

        {/* ─── Descarga la App ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/50">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-black text-white mb-1">
                  💜 ¿No quieres perder ningún evento?
                </h3>
                <p className="text-purple-100 text-sm">
                  Descarga la app BTS Calendar y recibe notificaciones de todos los eventos directamente en tu celular.
                </p>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <Button
                  onClick={() => navigate("/descarga-apk")}
                  className="gap-2 bg-white text-purple-700 hover:bg-purple-50 font-bold"
                >
                  <Smartphone className="size-4" />
                  Descargar App
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Ver más eventos ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/eventos")}
            className="text-white/50 hover:text-white hover:bg-white/10 gap-2"
          >
            <Globe className="size-4" />
            Ver todos los eventos
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
