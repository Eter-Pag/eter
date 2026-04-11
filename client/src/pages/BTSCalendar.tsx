import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Play,
  Sparkles,
  Heart,
  Calendar as CalendarIcon,
  Crown,
  Printer,
  FileDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import CalendarCustomizer from "@/components/CalendarCustomizer";

export default function BTSCalendar() {
  const [, navigate] = useLocation();
  const [downloadLink] = useState("https://drive.google.com/file/d/1Zhuc3a9Pc2kAy6o9dR1fwtXsWKd8NbJ_/view?usp=sharing");
  const [activeTab, setActiveTab] = useState<"standard" | "custom">("standard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20 p-4">
        <div className="container flex items-center justify-between max-w-6xl mx-auto">
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
            <CalendarIcon className="h-5 w-5 text-purple-400" />
            Calendario BTS 2026
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-12 px-4 relative z-10 max-w-5xl mx-auto">
        {/* Título y Selector de Modo */}
        <div className="text-center mb-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 mb-6"
            >
                <Crown className="size-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-black uppercase tracking-widest text-white">
                    Edición Limitada para ARMY
                </span>
                <Crown className="size-4 text-yellow-400 fill-yellow-400" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6 text-white">
                Tu Calendario <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">Personalizado</span>
            </h1>

            <div className="flex items-center justify-center gap-3 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md mx-auto">
                <button
                    onClick={() => setActiveTab("standard")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === "standard" 
                        ? "bg-white text-slate-900 shadow-lg" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                >
                    Versión Estándar
                </button>
                <button
                    onClick={() => setActiveTab("custom")}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeTab === "custom" 
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                >
                    <Sparkles className="size-3 inline mr-1" />
                    Personalizar
                </button>
            </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "standard" ? (
            /* ── VERSIÓN ESTÁNDAR ── */
            <motion.div
              key="standard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-400/50 shadow-2xl overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-4 py-1.5 text-sm font-bold">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Disponible Gratis
                    </Badge>
                    <Badge variant="outline" className="border-purple-400 text-purple-200 bg-purple-950/50">
                      Abril 2026
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">
                    Descarga el Diseño Original
                  </CardTitle>
                  <p className="text-purple-100 text-base md:text-lg leading-relaxed font-medium">
                    El calendario oficial de Eter con fotos exclusivas de BTS, listo para imprimir y decorar tu espacio.
                  </p>
                </CardHeader>

                <CardContent className="pt-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
                          <Heart className="h-5 w-5 text-pink-400" />
                          ¿Qué incluye el PDF?
                        </h3>
                        <ul className="space-y-3 text-purple-100 font-medium">
                          <li className="flex items-start gap-3">
                            <div className="size-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-400 font-black text-xs">01</span>
                            </div>
                            <span>Diseño premium de Abril con Suga (BTS)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="size-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-400 font-black text-xs">02</span>
                            </div>
                            <span>Alta resolución (300 DPI) para impresión nítida</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="size-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-400 font-black text-xs">03</span>
                            </div>
                            <span>Medidas exactas para portarretratos estándar</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                        <p className="text-sm text-purple-100 leading-relaxed">
                          <span className="font-black text-white uppercase tracking-widest text-[10px] bg-purple-500 px-2 py-0.5 rounded mr-2">Tip</span> 
                          Usa papel fotográfico brillante o mate de 200g para que los colores de BTS resalten al máximo.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-[2.5rem] border-2 border-purple-400/50 overflow-hidden group shadow-2xl">
                        <img
                          src="/assets/calendario_base_abril.png"
                          alt="Vista previa calendario BTS"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 mb-2">Original Design</Badge>
                            <p className="text-white font-black uppercase tracking-tighter text-lg italic">Edición Especial Abril</p>
                        </div>
                      </div>

                      <motion.a
                        href={downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button className="w-full gap-3 bg-white text-slate-900 hover:bg-slate-100 font-black text-base h-16 rounded-2xl shadow-xl transition-all uppercase tracking-widest">
                          <Download className="h-5 w-5" />
                          Descargar PDF Original
                        </Button>
                      </motion.a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recomendaciones */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: Printer, title: "Impresión", desc: "Ajusta a tamaño real (100%) en papel A4 o Carta." },
                    { icon: FileDown, title: "Formato", desc: "PDF de alta calidad listo para cualquier imprenta." },
                    { icon: Sparkles, title: "Acabado", desc: "Recorta por los bordes para un look profesional." }
                ].map((item, i) => (
                    <Card key={i} className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl">
                        <div className="size-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                            <item.icon className="size-6" />
                        </div>
                        <h4 className="font-black text-white uppercase tracking-tighter mb-2">{item.title}</h4>
                        <p className="text-purple-200/60 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </Card>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ── HERRAMIENTA DE PERSONALIZACIÓN ── */
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-10 text-center">
                <p className="text-purple-200/80 font-medium text-lg max-w-2xl mx-auto">
                    Sigue los pasos para crear tu calendario único. Tu foto se ajustará automáticamente al recuadro blanco.
                </p>
              </div>

              <CalendarCustomizer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="relative p-10 rounded-[3rem] bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/50 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                <Heart className="size-32 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">
                ¿Te encantó el resultado?
            </h3>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto font-medium text-lg">
                Comparte tu calendario armado en redes sociales y etiquétanos. ¡Nos encantaría ver cómo luce en tu espacio! 💜
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <Button 
                    variant="outline" 
                    className="h-14 px-8 border-2 border-purple-400/50 text-white hover:bg-purple-400/10 rounded-2xl font-black uppercase tracking-widest text-xs"
                    onClick={() => navigate("/")}
                >
                    Volver al Inicio
                </Button>
                <Button 
                    className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl"
                    onClick={() => navigate("/tienda")}
                >
                    Ver Más Productos <ChevronRight className="size-4 ml-2" />
                </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
