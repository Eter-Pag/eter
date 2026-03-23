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
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { RAFFLE_CONFIG } from "@shared/raffle";

// Tipos de fuentes disponibles
type FontStyle = "professional" | "cursive" | "creative";

interface FontOption {
  id: FontStyle;
  name: string;
  family: string;
  description: string;
}

// Configuración de fuentes
const FONT_OPTIONS: FontOption[] = [
  {
    id: "professional",
    name: "Profesional",
    family: "Arial, Helvetica, sans-serif",
    description: "Limpia y formal",
  },
  {
    id: "cursive",
    name: "Cursiva Elegante",
    family: "'Georgia', 'Garamond', serif",
    description: "Sofisticada y elegante",
  },
  {
    id: "creative",
    name: "Creativa",
    family: "'Lucida Handwriting', 'Palatino Linotype', cursive",
    description: "Artística y especial",
  },
];

// Tipos de diplomas disponibles con posiciones personalizadas
interface DiplomaTemplate {
  id: string;
  name: string;
  group: string;
  fandom: string;
  imagePath: string;
  description: string;
  namePosition: {
    x: number; // porcentaje del ancho
    y: number; // porcentaje del alto
    fontSize: number; // en píxeles
    maxWidth: number; // porcentaje del ancho
    color: string; // color del texto
    fontWeight: "normal" | "bold" | "italic";
  };
}

// Lista de plantillas disponibles en orden secuencial
const DIPLOMA_TEMPLATES: DiplomaTemplate[] = [
  {
    id: "bts-army-hq",
    name: "BTS ARMY HQ",
    group: "BTS",
    fandom: "ARMY",
    imagePath: "/assets/diploma_bts_army_hq.png",
    description: "Diploma oficial BTS ARMY (Alta Calidad)",
    namePosition: {
      x: 50,
      y: 40,
      fontSize: 48,
      maxWidth: 60,
      color: "#000000",
      fontWeight: "normal",
    },
  },
  {
    id: "twice-once",
    name: "TWICE ONCE",
    group: "TWICE",
    fandom: "ONCE",
    imagePath: "/assets/diploma_twice_once.jpeg",
    description: "Diploma de la ONCE",
    namePosition: {
      x: 50,
      y: 45,
      fontSize: 40,
      maxWidth: 70,
      color: "#000000",
      fontWeight: "bold",
    },
  },
  {
    id: "blackpink-blink",
    name: "BLACKPINK BLINK",
    group: "BLACKPINK",
    fandom: "BLINK",
    imagePath: "/assets/diploma_blackpink_blink.jpeg",
    description: "Diploma BLINK",
    namePosition: {
      x: 50,
      y: 34,
      fontSize: 38,
      maxWidth: 70,
      color: "#ff69b4",
      fontWeight: "normal",
    },
  },
  {
    id: "txt-moa",
    name: "TXT MOA",
    group: "TOMORROW X TOGETHER",
    fandom: "MOA",
    imagePath: "/assets/diploma_txt_moa.jpeg",
    description: "Diploma MOA",
    namePosition: {
      x: 50,
      y: 40,
      fontSize: 40,
      maxWidth: 70,
      color: "#000000",
      fontWeight: "normal",
    },
  },
  {
    id: "skz-stay",
    name: "STRAY KIDS STAY",
    group: "STRAY KIDS",
    fandom: "STAY",
    imagePath: "/assets/diploma_skz_stay.jpeg",
    description: "Certificate of Stay",
    namePosition: {
      x: 50,
      y: 50,
      fontSize: 36,
      maxWidth: 70,
      color: "#000000",
      fontWeight: "normal",
    },
  },

];

export default function Diploma() {
  const [, navigate] = useLocation();

  // Diploma state
  const [diplomaName, setDiplomaName] = useState("");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [selectedFont, setSelectedFont] = useState<FontStyle>("cursive");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const diplomaImageRef = useRef<HTMLImageElement | null>(null);

  const selectedTemplate = DIPLOMA_TEMPLATES[selectedTemplateIndex];

  // Cargar la imagen del template seleccionado
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = selectedTemplate.imagePath;
    img.onload = () => {
      diplomaImageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
  }, [selectedTemplateIndex]);

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
      const fontOption = FONT_OPTIONS.find((f) => f.id === selectedFont);
      const fontFamily = fontOption?.family || "Arial";
      const fontSize = selectedTemplate.namePosition.fontSize;
      const x = (canvas.width * selectedTemplate.namePosition.x) / 100;
      const y = (canvas.height * selectedTemplate.namePosition.y) / 100;
      const maxWidth = (canvas.width * selectedTemplate.namePosition.maxWidth) / 100;

      ctx.font = `${selectedFont === "professional" ? "" : "italic"} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = selectedTemplate.namePosition.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(diplomaName, x, y, maxWidth);
    }
  }, [diplomaName, imageLoaded, selectedTemplateIndex, selectedFont]);

  const handlePreviousDiploma = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTemplateIndex((prev) =>
        prev === 0 ? DIPLOMA_TEMPLATES.length - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const handleNextDiploma = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTemplateIndex((prev) =>
        prev === DIPLOMA_TEMPLATES.length - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const handleDownloadDiploma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `Diploma_${selectedTemplate.group}_${diplomaName || "Fan"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const getPrevIndex = () =>
    selectedTemplateIndex === 0 ? DIPLOMA_TEMPLATES.length - 1 : selectedTemplateIndex - 1;
  const getNextIndex = () =>
    selectedTemplateIndex === DIPLOMA_TEMPLATES.length - 1 ? 0 : selectedTemplateIndex + 1;

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
              {/* Carrusel 3D con Animación Suave y Scroll Snap */}
              <div className="w-full lg:w-3/5 p-4 md:p-8 bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-2xl h-[350px] md:h-[450px] mb-8 flex items-center justify-center perspective scroll-snap-x-mandatory scroll-smooth" style={{ scrollSnapType: 'x mandatory', overflowX: 'auto', scrollBehavior: 'smooth' }}>
                  {/* Diploma Anterior (Deslizamiento desde la izquierda) */}
                  <div 
                    className={`absolute left-0 w-24 h-32 md:w-40 md:h-56 opacity-40 scale-90 transform transition-all duration-700 ease-out z-0 cursor-pointer hover:opacity-60 ${
                      isTransitioning ? "translate-x-0" : "-translate-x-1/4"
                    }`}
                    style={{ scrollSnapAlign: 'center' }}
                    onClick={handlePreviousDiploma}
                  >
                    <img
                      src={DIPLOMA_TEMPLATES[getPrevIndex()].imagePath}
                      alt="Anterior"
                      className="w-full h-full object-cover rounded-lg shadow-lg border border-slate-300"
                    />
                  </div>

                  {/* Diploma Actual (Centro con zoom) */}
                  <div 
                    className={`relative w-full max-w-sm h-auto shadow-2xl rounded-lg overflow-hidden border-4 border-purple-400 z-10 transform transition-all duration-700 ease-out ${
                      isTransitioning ? "scale-95 opacity-50" : "scale-100 opacity-100"
                    }`}
                    style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
                  >
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

                  {/* Diploma Siguiente (Deslizamiento hacia la derecha) */}
                  <div 
                    className={`absolute right-0 w-24 h-32 md:w-40 md:h-56 opacity-40 scale-90 transform transition-all duration-700 ease-out z-0 cursor-pointer hover:opacity-60 ${
                      isTransitioning ? "translate-x-0" : "translate-x-1/4"
                    }`}
                    style={{ scrollSnapAlign: 'center' }}
                    onClick={handleNextDiploma}
                  >
                    <img
                      src={DIPLOMA_TEMPLATES[getNextIndex()].imagePath}
                      alt="Siguiente"
                      className="w-full h-full object-cover rounded-lg shadow-lg border border-slate-300"
                    />
                  </div>
                </div>

                {/* Controles del Carrusel */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <Button
                    onClick={handlePreviousDiploma}
                    disabled={isTransitioning}
                    variant="outline"
                    size="icon"
                    className="rounded-full shadow-md hover:bg-purple-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="size-6" />
                  </Button>
                  <div className="text-center min-w-[150px]">
                    <p className="text-base font-black text-purple-700 uppercase tracking-wider">
                      {selectedTemplate.name}
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      {selectedTemplate.group}
                    </p>
                  </div>
                  <Button
                    onClick={handleNextDiploma}
                    disabled={isTransitioning}
                    variant="outline"
                    size="icon"
                    className="rounded-full shadow-md hover:bg-purple-50 disabled:opacity-50"
                  >
                    <ChevronRight className="size-6" />
                  </Button>
                </div>

                {/* Indicador de Progreso Secuencial */}
                <div className="flex gap-2">
                  {DIPLOMA_TEMPLATES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isTransitioning && index !== selectedTemplateIndex) {
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setSelectedTemplateIndex(index);
                            setIsTransitioning(false);
                          }, 300);
                        }
                      }}
                      disabled={isTransitioning}
                      className={`h-2.5 rounded-full transition-all ${
                        index === selectedTemplateIndex
                          ? "w-10 bg-purple-600"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400 disabled:opacity-50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Panel de Configuración */}
              <div className="p-6 md:p-10 flex flex-col justify-center w-full lg:w-2/5 bg-white border-l border-slate-100">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold w-fit">
                  <Award className="size-4" />
                  PERSONALIZACIÓN
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-slate-900 leading-tight">
                  Configura tu Diploma
                </h2>
                
                <div className="space-y-6">
                  {/* Selector de Fuentes */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Estilo de Letra
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {FONT_OPTIONS.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setSelectedFont(font.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                            selectedFont === font.id
                              ? "border-purple-600 bg-purple-50 shadow-sm"
                              : "border-slate-100 bg-white hover:border-purple-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`text-sm font-bold text-slate-900 ${font.id === 'cursive' ? 'italic' : ''}`} style={{ fontFamily: font.family }}>
                                {font.name}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {font.description}
                              </p>
                            </div>
                            {selectedFont === font.id && (
                              <div className="bg-purple-600 rounded-full p-1">
                                <Check className="size-3 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input de Nombre */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                      Nombre para el Diploma
                    </label>
                    <Input
                      type="text"
                      placeholder="Tu nombre aquí..."
                      value={diplomaName}
                      onChange={(e) => setDiplomaName(e.target.value)}
                      className="h-14 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-xl font-medium px-4"
                      maxLength={30}
                    />
                  </div>
                  
                  {/* Botón de Descarga */}
                  <Button
                    onClick={handleDownloadDiploma}
                    disabled={!diplomaName.trim() || !imageLoaded}
                    className="w-full gap-3 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold py-7 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg disabled:opacity-50"
                  >
                    <Download className="size-6" />
                    <span>Descargar Diploma</span>
                  </Button>
                  
                  <p className="text-[11px] text-center text-slate-400 mt-4 leading-relaxed">
                    * El diploma se generará en alta resolución con el diseño y nombre elegidos.
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

      {/* Estilos CSS para transiciones suaves */}
      <style>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }

        @keyframes slideOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
