import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Smartphone,
  Sparkles,
  ShieldAlert,
  Info,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function ApkDownload() {
  const [, navigate] = useLocation();
  // El link de Drive se actualizará cuando el usuario lo proporcione. Por ahora usamos un placeholder.
  const [downloadLink] = useState("https://drive.google.com/file/d/1cD9xBb7fFsksSMrOaVWFO-vvNhgRmN96/view?usp=sharing");

  const steps = [
    {
      title: "Descargar el archivo",
      description: "Haz clic en el botón de descarga para obtener el archivo APK de nuestro calendario BTS.",
      icon: Download,
    },
    {
      title: "Habilitar orígenes desconocidos",
      description: "Ve a los ajustes de tu Android, sección Seguridad o Aplicaciones, y activa 'Instalar aplicaciones de fuentes desconocidas'.",
      icon: Smartphone,
    },
    {
      title: "Instalar y Disfrutar",
      description: "Abre el archivo descargado y sigue las instrucciones en pantalla para completar la instalación.",
      icon: CheckCircle2,
    },
  ];

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
            <Smartphone className="h-5 w-5 text-purple-400" />
            Calendario BTS APK
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
                  FAN-APK
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-200 bg-purple-950/50">
                  v1.0
                </Badge>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-black text-white mb-2">
                Descarga la App del Calendario BTS 2026
              </CardTitle>
              <div className="flex items-start gap-3 bg-purple-500/20 border border-purple-400/50 rounded-lg p-4 mb-6">
                <Sparkles className="h-6 w-6 text-purple-400 shrink-0 mt-1" />
                <p className="text-purple-100 text-sm leading-relaxed">
                  <span className="font-bold">Proyecto de Fans:</span> Esta es una aplicación creada con mucho cariño por fans para la comunidad (Fan-APK). Es un proyecto 100% libre de virus y sin fines de lucro, diseñado para que disfrutes de BTS en tu dispositivo. ¡Esperamos que te encante!
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Columna Izquierda: Imagen/Preview */}
                <div className="space-y-4">
                  <div className="relative aspect-[9/16] max-w-[250px] mx-auto bg-slate-800 rounded-[2.5rem] border-[6px] border-slate-700 shadow-2xl overflow-hidden shadow-purple-500/20">
                    <img
                      src="/assets/bts_apk_preview.png"
                      alt="Vista previa APK Calendario BTS"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent" />
                  </div>
                  <p className="text-center text-purple-200 text-sm italic">
                    Lleva a BTS en tu pantalla de inicio
                  </p>
                </div>

                {/* Columna Derecha: Acciones */}
                <div className="flex flex-col gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-400" />
                      Características:
                    </h3>
                    <ul className="space-y-3 text-purple-100">
                      <li className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-pink-500" />
                        <span>Interfaz inspirada en BTS</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-pink-500" />
                        <span>Recordatorios de fechas importantes</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-pink-500" />
                        <span>Galería de fotos integrada</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-pink-500" />
                        <span>Optimizado para Android</span>
                      </li>
                    </ul>
                  </div>

                  <motion.a
                    href={downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg h-16 rounded-2xl shadow-lg hover:shadow-purple-500/40 transition-all">
                      <Download className="h-6 w-6" />
                      DESCARGAR APK
                    </Button>
                  </motion.a>
                  
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] text-purple-300 text-center uppercase tracking-widest">
                      Tamaño: 91.4 MB • Compatible con Android 8.0+
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guía de Instalación */}
        <div className="mt-16">
          <h2 className="text-3xl font-black text-white text-center mb-10 drop-shadow-lg">
            Guía de Instalación Paso a Paso
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border border-white/10 backdrop-blur-md h-full hover:bg-white/10 transition-colors">
                  <CardContent className="pt-8 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-pink-400 font-black text-sm mb-2">PASO {index + 1}</span>
                    <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                    <p className="text-purple-100 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer de la página */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center space-y-4"
        >
          <p className="text-purple-300 text-sm">
            ¿Tienes problemas con la instalación? Contáctanos a través de nuestras redes sociales.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              className="border-purple-400 text-purple-200 hover:bg-purple-400/10"
              onClick={() => navigate("/")}
            >
              Volver al Inicio
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
