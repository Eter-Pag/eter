import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Download,
  Award,
  ArrowLeft,
  Check,
} from "lucide-react";
import { RAFFLE_CONFIG } from "@shared/raffle";

// Tipos de diplomas disponibles
interface DiplomaTemplate {
  id: string;
  name: string;
  imagePath: string;
  description: string;
}

// Lista de plantillas disponibles - actualizar con nuevos diseños
const DIPLOMA_TEMPLATES: DiplomaTemplate[] = [
  {
    id: "army-bts",
    name: "ARMY BTS",
    imagePath: "/assets/certificadoARMYBTS.jpeg",
    description: "Diploma oficial ARMY BTS",
  },
  // Aquí se añadirán más plantillas conforme se reciban las imágenes
];

export default function Diploma() {
  const [, navigate] = useLocation();

  // Diploma state
  const [diplomaName, setDiplomaName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<DiplomaTemplate>(
    DIPLOMA_TEMPLATES[0]
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const diplomaImageRef = useRef<HTMLImageElement | null>(null);

  // Cargar la imagen del template seleccionado
  useEffect(() => {
    const img = new Image();
    img.src = selectedTemplate.imagePath;
    img.onload = () => {
      diplomaImageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
  }, [selectedTemplate]);

  // Dibujar el diploma en el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = diplomaImageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Draw name if exists
    if (diplomaName) {
      ctx.font = "italic 40px 'Georgia', serif";
      ctx.fillStyle = "#1a1a1a";
      ctx.textAlign = "center";
      ctx.fillText(diplomaName, canvas.width / 2, canvas.height / 2 - 10);
    }
  }, [diplomaName, imageLoaded, selectedTemplate]);

  const handleDownloadDiploma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `Diploma_${selectedTemplate.name}_${diplomaName || "ARMY"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img
              src={RAFFLE_CONFIG.logoUrl}
              alt={RAFFLE_CONFIG.storeName}
              className="h-8 w-8 rounded-lg shadow-md"
            />
            <span className="font-bold text-sm tracking-tight">
              {RAFFLE_CONFIG.storeName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium gap-1">
              <ShieldCheck className="size-3" />
              Sitio Oficial
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container py-8 md:py-16">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="mb-8 gap-2"
        >
          <ArrowLeft className="size-4" />
          Volver al Inicio
        </Button>

        {/* Diploma Generator Section */}
        <div className="mb-12 md:mb-20">
          <Card className="bg-white/80 backdrop-blur-xl border-purple-200 shadow-2xl overflow-hidden border-2">
            <CardContent className="p-0 flex flex-col lg:flex-row">
              <div className="w-full lg:w-3/5 p-4 md:p-8 bg-slate-50 flex items-center justify-center">
                <div className="relative w-full max-w-2xl shadow-2xl rounded-lg overflow-hidden border border-slate-200">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-auto block bg-white"
                    style={{ aspectRatio: '1/1' }}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center w-full lg:w-2/5 bg-white">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold w-fit">
                  <Award className="size-4" />
                  EXCLUSIVO ARMY
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 leading-tight">
                  Genera tu Diploma ARMY
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                  ¡Obtén tu reconocimiento oficial como ARMY! Selecciona tu diseño favorito, ingresa tu nombre y descárgalo para compartirlo.
                </p>
                
                <div className="space-y-6">
                  {/* Selector de Plantillas */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Elige tu Diploma
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DIPLOMA_TEMPLATES.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`relative p-3 rounded-lg border-2 transition-all ${
                            selectedTemplate.id === template.id
                              ? "border-purple-600 bg-purple-50"
                              : "border-slate-200 bg-white hover:border-purple-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-900">
                                {template.name}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {template.description}
                              </p>
                            </div>
                            {selectedTemplate.id === template.id && (
                              <Check className="size-4 text-purple-600 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input de Nombre */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Tu Nombre
                    </label>
                    <Input
                      type="text"
                      placeholder="Escribe tu nombre aquí..."
                      value={diplomaName}
                      onChange={(e) => setDiplomaName(e.target.value)}
                      className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-lg"
                      maxLength={25}
                    />
                  </div>
                  
                  {/* Botón de Descarga */}
                  <Button
                    onClick={handleDownloadDiploma}
                    disabled={!diplomaName.trim() || !imageLoaded}
                    className="w-full gap-3 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Download className="size-5" />
                    <span>Descargar mi Diploma</span>
                  </Button>
                  
                  <p className="text-[10px] text-center text-slate-400 mt-4 italic">
                    * El diploma se generará automáticamente con el nombre que ingreses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 bg-white border-t border-border/50">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={RAFFLE_CONFIG.logoUrl}
                  alt={RAFFLE_CONFIG.storeName}
                  className="h-10 w-10 rounded-xl shadow-lg"
                />
                <span className="font-bold text-xl tracking-tight">
                  {RAFFLE_CONFIG.storeName}
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs text-center md:text-left">
                Tu destino número uno para todo lo relacionado con el K-POP en México.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
              <div className="flex gap-6 text-sm font-medium text-slate-400">
                <a href="#" className="hover:text-slate-900 transition-colors">Términos</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Contacto</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} {RAFFLE_CONFIG.storeName}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
