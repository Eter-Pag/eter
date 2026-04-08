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
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function BTSCalendar() {
  const [, navigate] = useLocation();
  const [downloadLink] = useState("https://drive.google.com/file/d/1af4r1FSJU4rvo4n0Wau4GxlCZuqOzWdR/view?usp=sharing");

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
            <CalendarIcon className="h-5 w-5 text-purple-400" />
            Calendario BTS 2026
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-12 px-4 relative z-10 max-w-4xl mx-auto">
        {/* Tarjeta Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-400/50 shadow-2xl overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none px-4 py-1.5 text-sm font-bold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Exclusivo
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-200 bg-purple-950/50">
                  2026
                </Badge>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-white mb-2">
                ¡Descarga tu Calendario BTS 2026 Gratis!
              </CardTitle>
              <p className="text-purple-100 text-base md:text-lg leading-relaxed">
                Un calendario físico premium listo para imprimir con fotos exclusivas de BTS. Perfecto para decorar tu espacio y celebrar cada día con tus idols favoritos.
              </p>
            </CardHeader>

            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Columna Izquierda: Información */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white mb-3 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-400" />
                      Lo que incluye:
                    </h3>
                    <ul className="space-y-2 text-purple-100">
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400 font-bold mt-1">✓</span>
                        <span>12 páginas con fotos de alta calidad de BTS</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400 font-bold mt-1">✓</span>
                        <span>Diseño premium listo para imprimir</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400 font-bold mt-1">✓</span>
                        <span>Medidas optimizadas para impresión profesional</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-pink-400 font-bold mt-1">✓</span>
                        <span>Acceso a tutorial de armado en video</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <p className="text-sm text-purple-100">
                      <span className="font-bold text-white">Nota:</span> Este PDF está optimizado para impresión. Asegúrate de usar papel de buena calidad para los mejores resultados.
                    </p>
                  </div>
                </div>

                {/* Columna Derecha: Acciones */}
                <div className="flex flex-col gap-4">
                  {/* Vista Previa - Imagen 1 */}
                  <div className="relative aspect-square bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl border-2 border-purple-400/50 overflow-hidden group">
                    <img
                      src="https://drive.google.com/uc?export=view&id=1cRi-VQbBssz-ceArnwZKlqGkXp-cZEki"
                      alt="Vista previa calendario BTS"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  {/* Vista Previa - Imagen 2 */}
                  <div className="relative aspect-square bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-2xl border-2 border-purple-400/50 overflow-hidden group">
                    <img
                      src="https://drive.google.com/uc?export=view&id=1O2SluXy7adjIg-JMpaNnYAkbkKsVHUyE"
                      alt="Vista previa calendario BTS 2"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Botón de Descarga */}
                  <motion.a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-base h-14 rounded-xl shadow-lg hover:shadow-xl transition-all">
                      <Download className="h-5 w-5" />
                      Descargar PDF
                    </Button>
                  </motion.a>

                  {/* Botón de Video (Placeholder) */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-2 border-purple-400/50 text-purple-200 hover:bg-purple-400/10 font-bold text-base h-14 rounded-xl"
                      disabled
                    >
                      <Play className="h-5 w-5" />
                      Ver Tutorial (Próximamente)
                    </Button>
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sección de Instrucciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Recomendaciones de Impresión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-white">📏 Tamaño Final</h4>
                  <p className="text-purple-100 text-sm">
                    <span className="font-semibold">11 x 15.5 cm</span> - Tamaño perfecto para escritorio. Imprime a escala 100% sin ajustar a página.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white">📄 Papel Recomendado</h4>
                  <p className="text-purple-100 text-sm">
                    Papel fotográfico de 200-250 gsm para mejor calidad y durabilidad. ¡Las fotos de BTS se verán increíbles!
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white">✂️ Acabado</h4>
                  <p className="text-purple-100 text-sm">
                    Recorta por los bordes y considera plastificar para mayor durabilidad. ¡Tu calendario quedará como nuevo!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tarjeta de Llamada a Acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/50">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-black text-white mb-3">
                ¿Te encantó el calendario?
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Comparte tu calendario armado en redes sociales y etiquétanos. ¡Nos encantaría ver cómo luce en tu espacio! 💜
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  variant="outline" 
                  className="border-purple-400 text-purple-200 hover:bg-purple-400/10"
                  onClick={() => navigate("/")}
                >
                  Volver al Inicio
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => navigate("/tienda")}
                >
                  Ver Más Productos
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
