import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  Crown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import CalendarCustomizer from "@/components/CalendarCustomizer";

export default function VipCalendar() {
  const [, navigate] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Verificar autorización persistente (30 días) o de sesión
  useEffect(() => {
    const localAuth = localStorage.getItem("vip_access_token");
    let authorized = false;
    
    if (localAuth) {
      const authData = JSON.parse(localAuth);
      const now = new Date().getTime();
      if (now < authData.expiry) {
        authorized = true;
      }
    }

    const sessionAuth = sessionStorage.getItem("vip_authorized");
    if (sessionAuth === "true") {
      authorized = true;
    }

    if (authorized) {
      setIsAuthorized(true);
    } else {
      navigate("/suscriptores");
    }
  }, [navigate]);

  if (!isAuthorized) return null;

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
            onClick={() => navigate("/suscriptores")}
            className="gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Zona VIP
          </Button>
          <h1 className="font-black text-lg flex items-center gap-2 text-white drop-shadow-lg">
            <Crown className="h-5 w-5 text-yellow-400" />
            Calendario VIP Personalizado
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="container py-12 px-4 relative z-10 max-w-5xl mx-auto">
        {/* Título y Badge */}
        <div className="text-center mb-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 mb-6"
            >
                <Sparkles className="size-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-black uppercase tracking-widest text-white">
                    Herramienta Exclusiva para Suscriptores
                </span>
                <Sparkles className="size-4 text-yellow-400 fill-yellow-400" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6 text-white">
                Crea tu <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">Propio Calendario</span>
            </h1>
            
            <p className="text-purple-200/80 font-medium text-lg max-w-2xl mx-auto">
                Sube tu foto favorita, ajústala al recuadro y descarga tu calendario personalizado de Abril en alta resolución.
            </p>
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
        >
            <CalendarCustomizer />
        </motion.div>

        {/* Footer info */}
        <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
                { title: "Personalización", desc: "Ajusta el zoom y la posición de tu foto fácilmente." },
                { title: "Alta Calidad", desc: "Generamos archivos optimizados para impresión nítida." },
                { title: "Exclusividad", desc: "Diseño único disponible solo para nuestra familia VIP." }
            ].map((item, i) => (
                <Card key={i} className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl text-center">
                    <h4 className="font-black text-white uppercase tracking-tighter mb-2">{item.title}</h4>
                    <p className="text-purple-200/60 text-xs font-medium leading-relaxed">{item.desc}</p>
                </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
