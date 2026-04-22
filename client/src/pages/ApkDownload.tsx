import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Download, Star, Shield, Smartphone, Check,
  Wifi, Bell, Calendar, Image, Globe, ArrowLeft,
  Send, User, MessageSquare, TrendingDown
} from "lucide-react";

const APP_VERSION = "2.1.0";
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyEgUCF8FawfIfqIDIigz9MdQIDJ_iFcAt1vo7T1phRC9gAxZYtd9zy0AE1HJhREPXJ/exec";
const DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=1fio6k9fOwpaTEQiFJokVdAoLZIw5XEwB";

const VERSIONS = [
  {
    version: "2.1.0",
    date: "Abril 2026",
    tag: "Más reciente",
    changes: [
      "Detección automática de ubicación para el clima",
      "Notas con links a artículos de ETER",
      "Eventos sincronizados en tiempo real desde la nube",
      "Mejoras de rendimiento y estabilidad",
    ],
  },
  {
    version: "2.0.0",
    date: "Marzo 2026",
    tag: "Mayor",
    changes: [
      "Rediseño completo de la interfaz",
      "Widget del clima integrado",
      "Sistema de notificaciones mejorado",
      "Soporte para fondos personalizados por mes",
    ],
  },
  {
    version: "1.0.0",
    date: "Enero 2026",
    tag: "Inicial",
    changes: [
      "Lanzamiento inicial de BTS Calendar",
      "Calendario con fechas importantes de BTS",
      "Perfil ARMY personalizable",
      "Temas de color personalizables",
    ],
  },
];

const FEATURES = [
  { icon: Calendar, label: "Calendario BTS", desc: "Fechas y eventos en tiempo real" },
  { icon: Wifi, label: "Sincronización", desc: "Datos siempre actualizados" },
  { icon: Bell, label: "Notificaciones", desc: "Alertas de eventos importantes" },
  { icon: Image, label: "Fondos por mes", desc: "Personaliza cada mes" },
  { icon: Globe, label: "Clima local", desc: "Detecta tu ubicación" },
  { icon: Globe, label: "Noticias ETER", desc: "Links directos a artículos" },
];

const SCREENSHOTS = [
  { label: "Calendario", color: "from-violet-600 to-purple-800", img: "/assets/screen_calendario.jpg" },
  { label: "Clima", color: "from-blue-600 to-indigo-800", img: "/assets/screen_clima.jpg" },
  { label: "Próximas", color: "from-pink-600 to-rose-800", img: "/assets/screen_proximas.jpg" },
  { label: "ETER Web", color: "from-emerald-600 to-teal-800", img: "/assets/screen_eter_web.jpg" },
];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              s <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const fecha = review.timestamp
    ? new Date(review.timestamp).toLocaleDateString("es-MX", { month: "short", year: "numeric" })
    : "";
  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-black">
            {(review.nombre || "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{review.nombre || "Anónimo"}</p>
            {fecha && <p className="text-white/30 text-xs">{fecha}</p>}
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-3.5 h-3.5 ${
                s <= Number(review.estrellas)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/15"
              }`}
            />
          ))}
        </div>
      </div>
      {review.comentario && (
        <p className="text-white/60 text-sm leading-relaxed">{review.comentario}</p>
      )}
    </div>
  );
}

export default function ApkDownload() {
  const [, navigate] = useLocation();
  const [activeVersion, setActiveVersion] = useState(0);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  // Contador de descargas
  const [totalDescargas, setTotalDescargas] = useState<number | null>(null);

  // Reviews
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Formulario de reseña
  const [nombre, setNombre] = useState("");
  const [estrellas, setEstrellas] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  // Cargar reviews y contador al montar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Reviews
        const resR = await fetch(`${SCRIPT_URL}?sheet=app_reviews`);
        const jsonR = await resR.json();
        if (jsonR.ok && Array.isArray(jsonR.data)) {
          // Ordenar más recientes primero
          const sorted = [...jsonR.data].reverse();
          setReviews(sorted);
        }
      } catch (e) {
        console.log("Error cargando reviews:", e);
      } finally {
        setLoadingReviews(false);
      }

      try {
        // Contador de descargas
        const resD = await fetch(`${SCRIPT_URL}?sheet=app_downloads`);
        const jsonD = await resD.json();
        if (jsonD.ok && Array.isArray(jsonD.data)) {
          setTotalDescargas(jsonD.data.length);
        }
      } catch (e) {
        console.log("Error cargando descargas:", e);
      }
    };
    cargarDatos();
  }, []);

  // Promedio de estrellas
  const promedioEstrellas =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + Number(r.estrellas || 0), 0) / reviews.length
      : 0;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "download", version: APP_VERSION }),
      });
      setTotalDescargas((prev) => (prev !== null ? prev + 1 : 1));
    } catch (e) {
      console.log("Error registrando descarga:", e);
    }
    setTimeout(() => {
      window.open(DOWNLOAD_LINK, "_blank");
      setDownloading(false);
    }, 1000);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) { setErrorEnvio("Por favor escribe tu nombre 💜"); return; }
    if (!comentario.trim()) { setErrorEnvio("Escribe un comentario antes de enviar"); return; }
    setErrorEnvio("");
    setEnviando(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "review",
          nombre: nombre.trim(),
          estrellas,
          comentario: comentario.trim(),
          version: APP_VERSION,
        }),
      });
      // Agregar la nueva reseña al inicio localmente
      setReviews((prev) => [
        { nombre: nombre.trim(), estrellas, comentario: comentario.trim(), timestamp: new Date().toISOString() },
        ...prev,
      ]);
      setNombre("");
      setComentario("");
      setEstrellas(5);
      setEnviado(true);
      setTimeout(() => setEnviado(false), 4000);
    } catch (e) {
      setErrorEnvio("Hubo un error al enviar. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Fondo ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </button>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">Aplicaciones</span>
          <span className="text-white/20">/</span>
          <span className="text-white text-sm font-medium">BTS Calendar</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">

        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-6 items-start mb-8"
        >
          <div className="w-24 h-24 rounded-[22px] overflow-hidden shrink-0 shadow-2xl shadow-purple-500/30 border border-white/10">
            <img src="/assets/bts_calendar_logo.png" alt="BTS Calendar" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).parentElement!.innerHTML='<span style="font-size:2.5rem;display:flex;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg,#7c3aed,#db2777)">💜</span>'; }} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight mb-1">BTS Calendar</h1>
            <p className="text-purple-400 font-semibold text-sm mb-2">ETER Kpop MX</p>
            <div className="flex items-center gap-4 text-sm text-white/50 mb-4 flex-wrap">
              {promedioEstrellas > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-bold">{promedioEstrellas.toFixed(1)}</span>
                  <span className="text-white/40">({reviews.length})</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-green-400" />
                Verificada por ETER
              </span>
              <span>Android 8.0+</span>
              <span>91.4 MB</span>
            </div>
            <motion.button
              onClick={handleDownload}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-purple-500/25"
            >
              <AnimatePresence mode="wait">
                {downloading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Preparando descarga...
                  </motion.span>
                ) : (
                  <motion.span key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar v{APP_VERSION}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden mb-8 border border-white/8"
        >
          {[
            { value: "Gratis", label: "Precio" },
            { value: `v${APP_VERSION}`, label: "Versión" },
            { value: totalDescargas !== null ? totalDescargas.toLocaleString() : "—", label: "Descargas" },
          ].map((s, i) => (
            <div key={i} className="bg-[#0f0f18] py-4 flex flex-col items-center gap-0.5">
              <span className="text-white font-black text-lg">{s.value}</span>
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── SCREENSHOTS ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10">
          <h2 className="text-lg font-black mb-5 tracking-tight">Capturas de pantalla</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SCREENSHOTS.map((sc, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setScreenshotIndex(i)}
                className={`shrink-0 w-32 h-56 rounded-2xl overflow-hidden bg-gradient-to-br ${sc.color} flex flex-col items-center justify-end cursor-pointer border-2 transition-all relative ${screenshotIndex === i ? "border-white/60" : "border-white/10"}`}
              >
                <img src={sc.img} alt={sc.label} className="absolute inset-0 w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="relative z-10 text-white text-xs font-bold bg-black/30 px-2 py-1 rounded-full mb-3">{sc.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── DESCRIPCIÓN ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-10 border-t border-white/8 pt-8">
          <h2 className="text-lg font-black mb-4 tracking-tight">Acerca de esta app</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            <span className="font-bold text-white">BTS Calendar</span> es la app oficial de la comunidad ETER Kpop MX — creada con amor para el fandom. Lleva el universo de BTS en tu bolsillo con un calendario de eventos, noticias exclusivas y personalización total.
          </p>
          <p className="text-white/60 text-sm leading-relaxed">
            Todos los eventos se sincronizan automáticamente desde nuestra base de datos, así que siempre tendrás la información más reciente sin necesidad de actualizar la app.
          </p>
        </motion.section>

        {/* ── CARACTERÍSTICAS ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10 border-t border-white/8 pt-8">
          <h2 className="text-lg font-black mb-5 tracking-tight">Funciones destacadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4 flex gap-3 items-start hover:bg-white/7 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">{f.label}</p>
                  <p className="text-white/50 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── HISTORIAL DE VERSIONES ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-10 border-t border-white/8 pt-8">
          <h2 className="text-lg font-black mb-5 tracking-tight">Historial de versiones</h2>
          <div className="flex gap-2 mb-5 flex-wrap">
            {VERSIONS.map((v, i) => (
              <button
                key={i}
                onClick={() => setActiveVersion(i)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeVersion === i ? "bg-purple-600 border-purple-500 text-white" : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                v{v.version}
                {i === 0 && <span className="ml-1.5 text-[9px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded-full">NUEVA</span>}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVersion}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/4 border border-white/8 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-white font-black text-base">v{VERSIONS[activeVersion].version}</span>
                  <span className="ml-3 text-xs text-white/40">{VERSIONS[activeVersion].date}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${activeVersion === 0 ? "bg-green-500/20 text-green-400" : activeVersion === 1 ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/40"}`}>
                  {VERSIONS[activeVersion].tag}
                </span>
              </div>
              <ul className="space-y-2.5">
                {VERSIONS[activeVersion].changes.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* ── GUÍA DE INSTALACIÓN ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-10 border-t border-white/8 pt-8">
          <h2 className="text-lg font-black mb-5 tracking-tight">Cómo instalar</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Descargar", desc: "Toca el botón de descarga y guarda el archivo APK en tu dispositivo.", icon: Download },
              { step: "02", title: "Habilitar instalación", desc: "En Ajustes → Seguridad, activa 'Instalar apps de fuentes desconocidas'.", icon: Shield },
              { step: "03", title: "Instalar y disfrutar", desc: "Abre el archivo descargado y sigue las instrucciones en pantalla.", icon: Smartphone },
            ].map((s, i) => (
              <div key={i} className="relative bg-white/4 border border-white/8 rounded-2xl p-5 overflow-hidden group hover:bg-white/6 transition-colors">
                <span className="absolute top-3 right-4 text-5xl font-black text-white/4 group-hover:text-white/7 transition-colors select-none">{s.step}</span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30 flex items-center justify-center mb-3">
                  <s.icon className="w-4 h-4 text-purple-300" />
                </div>
                <p className="font-black text-sm mb-1.5">{s.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── CALIFICACIONES Y RESEÑAS ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-10 border-t border-white/8 pt-8">
          <h2 className="text-lg font-black mb-6 tracking-tight">Calificaciones y reseñas</h2>

          {/* Resumen de rating */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-8 mb-8 bg-white/4 border border-white/8 rounded-2xl p-6">
              <div className="text-center shrink-0">
                <p className="text-6xl font-black text-white leading-none mb-1">{promedioEstrellas.toFixed(1)}</p>
                <div className="flex gap-0.5 justify-center mb-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(promedioEstrellas) ? "fill-yellow-400 text-yellow-400" : "text-white/20"}`} />
                  ))}
                </div>
                <p className="text-white/40 text-xs">{reviews.length} reseñas</p>
              </div>
              {/* Barras de distribución */}
              <div className="flex-1 space-y-1.5">
                {[5,4,3,2,1].map(s => {
                  const count = reviews.filter(r => Number(r.estrellas) === s).length;
                  const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-xs text-white/40 w-2">{s}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="h-full bg-yellow-400 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-white/30 w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Formulario de reseña */}
          <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-6">
            <h3 className="font-black text-base mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Dejar una reseña
            </h3>
            <AnimatePresence>
              {enviado ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-4 text-green-300 font-bold text-sm"
                >
                  <Check className="w-5 h-5" />
                  ¡Gracias por tu reseña! 💜 Ya aparece abajo.
                </motion.div>
              ) : (
                <form onSubmit={handleReview} className="space-y-4">
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1">
                      <label className="text-xs text-white/50 font-bold mb-1.5 block">TU NOMBRE</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="text"
                          value={nombre}
                          onChange={e => setNombre(e.target.value)}
                          placeholder="Nombre o apodo..."
                          maxLength={30}
                          className="w-full bg-white/6 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 font-bold mb-1.5 block">CALIFICACIÓN</label>
                      <StarPicker value={estrellas} onChange={setEstrellas} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 font-bold mb-1.5 block">COMENTARIO</label>
                    <textarea
                      value={comentario}
                      onChange={e => setComentario(e.target.value)}
                      placeholder="¿Qué te pareció la app? 💜"
                      rows={3}
                      maxLength={300}
                      className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                    />
                    <p className="text-right text-white/20 text-xs mt-1">{comentario.length}/300</p>
                  </div>
                  {errorEnvio && (
                    <p className="text-red-400 text-xs font-bold">{errorEnvio}</p>
                  )}
                  <motion.button
                    type="submit"
                    disabled={enviando}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
                  >
                    {enviando ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {enviando ? "Enviando..." : "Publicar reseña"}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Lista de reseñas */}
          {loadingReviews ? (
            <div className="flex justify-center py-8">
              <svg className="w-6 h-6 animate-spin text-purple-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-8">Sé la primera en dejar una reseña 💜</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ReviewCard review={r} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── CTA final ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="font-black text-base mb-1">¿Lista para descargar? 💜</p>
            <p className="text-white/50 text-sm">Gratis · Sin anuncios · Hecho con amor para el ARMY</p>
          </div>
          <motion.button
            onClick={handleDownload}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-purple-500/25"
          >
            <Download className="w-4 h-4" />
            Descargar gratis
          </motion.button>
        </motion.div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/30">
          <p>© 2026 ETER Kpop MX · Proyecto de fans sin fines de lucro</p>
          <button onClick={() => navigate("/")} className="hover:text-white/60 transition-colors">Volver al inicio</button>
        </div>
      </main>
    </div>
  );
}
