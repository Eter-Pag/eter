import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LegalFooter } from "@/components/LegalFooter";
import { useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Download,
  Award,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";
import { RAFFLE_CONFIG } from "@shared/raffle";

// Tipos de fuentes disponibles
type FontStyle = "professional" | "cursive" | "creative" | "playwrite";

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

// Configuración del diploma único de BTS
const BTS_DIPLOMA = {
  id: "bts-army-hq",
  name: "BTS ARMY",
  group: "BTS",
  fandom: "ARMY",
  imagePath: "/assets/diploma_bts_army_hq.png",
  description: "Diploma oficial BTS ARMY",
  namePosition: {
    x: 50,
    y: 46.0,
    fontSize: 48,
    maxWidth: 60,
    color: "#000000",
    fontWeight: "normal" as const,
  },
};

export default function Diploma() {
  const [, navigate] = useLocation();

  // Diploma state
  const [diplomaName, setDiplomaName] = useState("");
  const [selectedFont, setSelectedFont] = useState<FontStyle>("cursive");
  const [fontSize, setFontSize] = useState(BTS_DIPLOMA.namePosition.fontSize);

  // Auto-ajuste de tamaño de letra según la longitud del nombre
  useEffect(() => {
    if (!diplomaName) {
      setFontSize(BTS_DIPLOMA.namePosition.fontSize);
      return;
    }

    const nameLength = diplomaName.length;
    let newSize = BTS_DIPLOMA.namePosition.fontSize;

    if (nameLength > 25) {
      newSize = 32;
    } else if (nameLength > 20) {
      newSize = 36;
    } else if (nameLength > 15) {
      newSize = 42;
    } else if (nameLength < 8) {
      newSize = 56;
    }

    setFontSize(newSize);
  }, [diplomaName]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const diplomaImageRef = useRef<HTMLImageElement | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Cargar la imagen del diploma
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = BTS_DIPLOMA.imagePath;
    img.onload = () => {
      diplomaImageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
  }, []);

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
      const x = (canvas.width * BTS_DIPLOMA.namePosition.x) / 100;
      const y = (canvas.height * BTS_DIPLOMA.namePosition.y) / 100;
      const maxWidth = (canvas.width * BTS_DIPLOMA.namePosition.maxWidth) / 100;

      ctx.font = `${selectedFont === "professional" ? "" : "italic"} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = BTS_DIPLOMA.namePosition.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom"; // El texto crece hacia arriba desde su base
      ctx.fillText(diplomaName, x, y, maxWidth);
    }
  }, [diplomaName, imageLoaded, selectedFont, fontSize]);

  const handleDownloadDiploma = async (isForPrint = false) => {
    const canvas = canvasRef.current;
    const img = diplomaImageRef.current;
    if (canvas && img && diplomaName.trim()) {
      if (isForPrint) setIsPrinting(true);
      else setIsDownloading(true);

      try {
        // Para impresión, creamos un canvas temporal de mayor resolución si es necesario
        // O simplemente nos aseguramos de que el canvas actual tenga la calidad máxima
        const downloadCanvas = document.createElement("canvas");
        const ctx = downloadCanvas.getContext("2d");
        if (!ctx) return;

        // Usamos las dimensiones originales de la imagen para máxima calidad
        downloadCanvas.width = img.width;
        downloadCanvas.height = img.height;

        // Dibujar fondo
        ctx.drawImage(img, 0, 0);

        // Dibujar nombre
        const fontOption = FONT_OPTIONS.find((f) => f.id === selectedFont);
        const fontFamily = fontOption?.family || "Arial";
        const x = (downloadCanvas.width * BTS_DIPLOMA.namePosition.x) / 100;
        const y = (downloadCanvas.height * BTS_DIPLOMA.namePosition.y) / 100;
        const maxWidth = (downloadCanvas.width * BTS_DIPLOMA.namePosition.maxWidth) / 100;

        ctx.font = `${selectedFont === "professional" ? "" : "italic"} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = BTS_DIPLOMA.namePosition.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(diplomaName, x, y, maxWidth);

        const link = document.createElement("a");
        link.download = `Diploma_BTS_ARMY_${diplomaName}${isForPrint ? "_Para_Imprimir" : ""}.png`;
        // Para impresión usamos calidad máxima (1.0)
        link.href = downloadCanvas.toDataURL("image/png", 1.0);
        link.click();
      } finally {
        if (isForPrint) setIsPrinting(false);
        else setIsDownloading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
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

        {/* Main Card */}
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-xl border-purple-200 shadow-2xl overflow-hidden border-2">
            <CardContent className="p-0 flex flex-col lg:flex-row gap-0">
              {/* Diploma Preview Section */}
              <div className="w-full lg:w-3/5 p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px]">
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full px-4 py-1.5 mb-3 text-sm font-bold">
                    <Sparkles className="size-4" />
                    VISTA PREVIA
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                    Tu Diploma {BTS_DIPLOMA.group}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2">
                    {BTS_DIPLOMA.fandom} • {BTS_DIPLOMA.description}
                  </p>
                </div>

                {/* Canvas Container */}
                <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-4 border-purple-200 overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto block"
                    style={{ aspectRatio: "1/1" }}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 rounded-2xl">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        <p className="text-sm text-slate-600 font-medium">
                          Cargando diploma...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info Text */}
                <p className="text-center text-xs text-slate-400 mt-6 max-w-sm leading-relaxed">
                  El diploma se genera en alta resolución. Personaliza con tu nombre y elige el estilo de letra que prefieras.
                </p>
              </div>

              {/* Configuration Panel */}
              <div className="p-6 md:p-10 flex flex-col justify-center w-full lg:w-2/5 bg-white border-t lg:border-t-0 lg:border-l border-slate-100">
                <div className="space-y-8">
                  {/* Title */}
                  <div>
                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-4 text-sm font-bold">
                      <Award className="size-4" />
                      PERSONALIZACIÓN
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                      Crea tu Diploma
                    </h2>
                  </div>

                  {/* Font Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 block">
                      Elige tu Estilo de Letra
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {FONT_OPTIONS.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setSelectedFont(font.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
                            selectedFont === font.id
                              ? "border-purple-600 bg-purple-50 shadow-md"
                              : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-bold text-slate-900 ${
                                  font.id === "cursive" ? "italic" : ""
                                }`}
                                style={{ fontFamily: font.family }}
                              >
                                {font.name}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {font.description}
                              </p>
                            </div>
                            {selectedFont === font.id && (
                              <div className="bg-gradient-to-br from-purple-600 to-violet-600 rounded-full p-1.5 ml-3 flex-shrink-0">
                                <Check className="size-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 block">
                      Tu Nombre
                    </label>
                    <Input
                      type="text"
                      placeholder="Escribe tu nombre..."
                      value={diplomaName}
                      onChange={(e) => setDiplomaName(e.target.value)}
                      className="h-12 border-slate-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                      maxLength={35}
                    />
                    <p className="text-[10px] text-slate-400">
                      {diplomaName.length}/35 caracteres
                    </p>
                  </div>

                  {/* Font Size Selector */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 block">
                        Tamaño de Letra
                      </label>
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                        {fontSize}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 px-1">
                      <span>Pequeño</span>
                      <span>Grande</span>
                    </div>
                  </div>

                  {/* Download Buttons Section */}
                  <div className="space-y-4">
                    <p className="text-center text-[11px] font-bold text-amber-600 animate-pulse">
                      ⚠️ Por favor, revisa la vista previa antes de descargar
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        onClick={() => handleDownloadDiploma(false)}
                        disabled={!diplomaName.trim() || !imageLoaded || isDownloading || isPrinting}
                        className="w-full gap-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-6 rounded-xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-base disabled:opacity-50"
                      >
                        <Download className="size-5" />
                        <span>
                          {isDownloading ? "Descargando..." : "Descargar Diploma"}
                        </span>
                      </Button>

                      <Button
                        onClick={() => handleDownloadDiploma(true)}
                        disabled={!diplomaName.trim() || !imageLoaded || isDownloading || isPrinting}
                        variant="outline"
                        className="w-full gap-3 border-2 border-purple-200 hover:border-purple-600 hover:bg-purple-50 text-purple-700 font-bold py-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-base disabled:opacity-50"
                      >
                        <Award className="size-5" />
                        <span>
                          {isPrinting ? "Preparando..." : "Descargar para Impresión"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-900 leading-relaxed">
                      <span className="font-bold block mb-1">💡 Consejo:</span>
                      El diploma se descargará en alta resolución PNG. Perfecto para compartir en redes sociales.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Legal Footer */}
      <LegalFooter
        title="Aviso de Privacidad y Uso Exclusivo"
        description={`El uso de esta herramienta es exclusivo de ${RAFFLE_CONFIG.storeName}. Se prohíbe la venta, distribución, reproducción o cualquier uso no autorizado de los diplomas generados. El incumplimiento de estas restricciones puede resultar en acciones legales.`}
        storeName={RAFFLE_CONFIG.storeName}
      />

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
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Términos
                </a>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Privacidad
                </a>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} {RAFFLE_CONFIG.storeName}. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
