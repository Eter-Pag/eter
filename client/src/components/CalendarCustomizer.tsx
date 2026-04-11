import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  Image as ImageIcon,
  Printer,
  FileDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function CalendarCustomizer() {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateDownload = async (format: "png" | "pdf") => {
    if (!calendarRef.current) return;
    setIsProcessing(true);
    const toastId = toast.loading(`Generando ${format.toUpperCase()} de alta calidad...`);

    try {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 3, // Alta resolución
        useCORS: true,
        backgroundColor: null,
      });

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `Calendario_Eter_Personalizado.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Calendario_Eter_Personalizado.pdf`);
      }
      toast.success("¡Descarga completada!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error al generar el archivo", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {!showEditor ? (
        <div
          {...getRootProps()}
          className={`relative overflow-hidden rounded-[2.5rem] border-4 border-dashed transition-all duration-500 group cursor-pointer aspect-[3/4] flex flex-col items-center justify-center p-12 text-center ${
            isDragActive
              ? "border-purple-400 bg-purple-400/10 scale-[0.98]"
              : "border-white/20 bg-white/5 hover:border-purple-400/40 hover:bg-white/10"
          }`}
        >
          <input {...getInputProps()} />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="size-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/40 group-hover:scale-110 transition-transform">
              <Upload className="size-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
              Personaliza tu Calendario
            </h3>
            <p className="text-purple-200/60 font-medium max-w-xs mx-auto">
              Sube tu foto favorita para que aparezca en el recuadro blanco del calendario.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-400/10 px-4 py-2 rounded-full border border-purple-400/20">
              <ImageIcon className="size-3" />
              JPG, PNG aceptados
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Editor de Recorte */}
          <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-white/20 bg-black shadow-2xl">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={2 / 3} // Ajustado al recuadro del calendario
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{
                    containerClassName: "rounded-[2.5rem]",
                    mediaClassName: "rounded-[2.5rem]"
                }}
              />
            )}
          </div>

          {/* Controles */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-2xl p-6 rounded-[2rem]">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/60">
                  <span>Zoom de imagen</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(val) => setZoom(val[0])}
                  className="py-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImage(null);
                    setShowEditor(false);
                  }}
                  className="rounded-xl border-white/10 text-white/60 hover:bg-white/5 uppercase font-black text-xs tracking-widest"
                >
                  <X className="size-4 mr-2" /> Cancelar
                </Button>
                <Button
                  onClick={() => setShowEditor(false)}
                  className="rounded-xl bg-green-500 hover:bg-green-600 text-white uppercase font-black text-xs tracking-widest"
                >
                  <Check className="size-4 mr-2" /> Confirmar
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Preview Real del Calendario (Oculto o Visible como Preview) */}
      <AnimatePresence>
        {image && !showEditor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/20 text-xs font-black uppercase tracking-widest">
                    <Sparkles className="size-4" />
                    ¡Vista Previa Lista!
                </div>
            </div>

            {/* El Calendario Renderizado */}
            <div className="flex justify-center">
                <div 
                    ref={calendarRef}
                    className="relative w-full max-w-[400px] aspect-[1/1.4] bg-white shadow-2xl overflow-hidden"
                    style={{ borderRadius: '0px' }} // El diseño original es rectangular para impresión
                >
                    {/* Imagen de fondo (El diseño del calendario proporcionado) */}
                    <img 
                        src="/assets/calendario_base_abril.png" 
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        alt="Calendario Base"
                    />

                    {/* Recuadro Blanco de Personalización (Aproximado según el PDF) */}
                    {/* El recuadro blanco en el PDF está en la parte inferior izquierda */}
                    <div 
                        className="absolute bottom-[4%] left-[4%] w-[92%] h-[40%] z-0 bg-white rounded-[2rem] overflow-hidden"
                    >
                        {image && croppedAreaPixels && (
                            <div className="relative w-full h-full">
                                <img
                                    src={image}
                                    alt="User Content"
                                    className="absolute"
                                    style={{
                                        width: `${100 * (100 / (croppedAreaPixels.width / 100))}%`,
                                        height: 'auto',
                                        left: `${-croppedAreaPixels.x * (100 / croppedAreaPixels.width)}%`,
                                        top: `${-croppedAreaPixels.y * (100 / croppedAreaPixels.width)}%`,
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'top left'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Botones de Descarga */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                    onClick={() => generateDownload("png")}
                    disabled={isProcessing}
                    className="h-16 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest shadow-xl"
                >
                    <FileDown className="size-5 mr-2" /> Descargar PNG
                </Button>
                <Button
                    onClick={() => generateDownload("pdf")}
                    disabled={isProcessing}
                    className="h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 font-black uppercase tracking-widest shadow-xl"
                >
                    <Printer className="size-5 mr-2" /> Descargar PDF
                </Button>
            </div>

            <Button
                variant="ghost"
                onClick={() => setShowEditor(true)}
                className="w-full text-white/40 hover:text-white uppercase font-black text-xs tracking-widest"
            >
                <RotateCcw className="size-4 mr-2" /> Ajustar Imagen de nuevo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
