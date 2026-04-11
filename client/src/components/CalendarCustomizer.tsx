import { useState, useCallback, useRef, useEffect } from "react";
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
  Printer,
  FileDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

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
  const [base64Calendar, setBase64Calendar] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const convertToBase64 = async () => {
      try {
        const response = await fetch("/assets/calendario_base_abril.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Calendar(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error cargando imagen base:", error);
      }
    };
    convertToBase64();
  }, []);

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

  const downloadOriginalPdf = async () => {
    if (!base64Calendar) {
      toast.error("Error: La imagen base del calendario no está cargada.");
      return;
    }
    setIsProcessing(true);
    const toastId = toast.loading("Generando PDF del calendario original...");

    try {
      const calendarWidth = 500; // Ancho fijo para el calendario
      const calendarHeight = 707; // Alto fijo para el calendario (aspecto 1/1.414 de 500px)

      const canvas = document.createElement("canvas");
      canvas.width = calendarWidth * 2; // Duplicar para mayor resolución
      canvas.height = calendarHeight * 2; // Duplicar para mayor resolución
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No se pudo obtener el contexto 2D del canvas.");
      }

      const baseImage = new Image();
      baseImage.crossOrigin = "anonymous";
      baseImage.src = base64Calendar;
      await new Promise((resolve, reject) => {
        baseImage.onload = resolve;
        baseImage.onerror = reject;
      });

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

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
      pdf.save(`Calendario_Eter_Abril_Original.pdf`);
      toast.success("¡Descarga completada!", { id: toastId });
    } catch (error) {
      console.error("Error al generar PDF original:", error);
      toast.error("Error al generar el PDF original. Por favor, intenta de nuevo.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDownload = async (format: "png" | "pdf") => {
    if (!calendarRef.current) {
      toast.error("Error: El calendario no está listo para descargar.");
      return;
    }
    setIsProcessing(true);
    const toastId = toast.loading(`Generando ${format.toUpperCase()} de alta calidad...`);

    try {
      const calendarElement = calendarRef.current;
      const calendarWidth = 500; // Ancho fijo para el calendario
      const calendarHeight = 707; // Alto fijo para el calendario (aspecto 1/1.414 de 500px)

      const canvas = document.createElement("canvas");
      canvas.width = calendarWidth * 2; // Duplicar para mayor resolución
      canvas.height = calendarHeight * 2; // Duplicar para mayor resolución
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No se pudo obtener el contexto 2D del canvas.");
      }

      // Cargar la imagen base del calendario
      const baseImage = new Image();
      baseImage.crossOrigin = "anonymous";
      baseImage.src = base64Calendar || "/assets/calendario_base_abril.png";
      await new Promise((resolve, reject) => {
        baseImage.onload = resolve;
        baseImage.onerror = reject;
      });

      // Dibujar la imagen base en el canvas
      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // Si hay una imagen de usuario, cargarla y dibujarla
      if (image && croppedAreaPixels) {
        const userImage = new Image();
        userImage.crossOrigin = "anonymous";
        userImage.src = image;
        await new Promise((resolve, reject) => {
          userImage.onload = resolve;
          userImage.onerror = reject;
        });

        // Calcular las dimensiones y posición de la imagen de usuario en el calendario
        // Estas proporciones deben coincidir con las del CSS de la vista previa
        const previewWidth = calendarElement.offsetWidth;
        const previewHeight = calendarElement.offsetHeight;

        // Ajustar las coordenadas y dimensiones para el Canvas
        const userImageX = (0.045 * calendarWidth) * 2; // 4.5% left del calendario de 500px, escalado
        const userImageY = (calendarHeight - (0.045 * calendarHeight) - (0.235 * calendarHeight)) * 2; // 4.5% bottom, 23.5% height, escalado
        const userImageWidth = (0.355 * calendarWidth) * 2; // 35.5% width del calendario de 500px, escalado
        const userImageHeight = (0.235 * calendarHeight) * 2; // 23.5% height del calendario de 707px, escalado

        // Radio de borde para rounded-2xl (aproximadamente 16px en un tamaño base, escalado)
        const borderRadius = 16 * 2; 

        // Dibujar la imagen de usuario con bordes redondeados
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(userImageX + borderRadius, userImageY);
        ctx.lineTo(userImageX + userImageWidth - borderRadius, userImageY);
        ctx.quadraticCurveTo(userImageX + userImageWidth, userImageY, userImageX + userImageWidth, userImageY + borderRadius);
        ctx.lineTo(userImageX + userImageWidth, userImageY + userImageHeight - borderRadius);
        ctx.quadraticCurveTo(userImageX + userImageWidth, userImageY + userImageHeight, userImageX + userImageWidth - borderRadius, userImageY + userImageHeight);
        ctx.lineTo(userImageX + borderRadius, userImageY + userImageHeight);
        ctx.quadraticCurveTo(userImageX, userImageY + userImageHeight, userImageX, userImageY + userImageHeight - borderRadius);
        ctx.lineTo(userImageX, userImageY + borderRadius);
        ctx.quadraticCurveTo(userImageX, userImageY, userImageX + borderRadius, userImageY);
        ctx.closePath();
        ctx.clip();

        // Calcular el área de recorte final para dibujar en el canvas
        const croppedX = croppedAreaPixels.x;
        const croppedY = croppedAreaPixels.y;
        const croppedWidth = croppedAreaPixels.width;
        const croppedHeight = croppedAreaPixels.height;

        ctx.drawImage(
          userImage,
          croppedX,
          croppedY,
          croppedWidth,
          croppedHeight,
          userImageX,
          userImageY,
          userImageWidth,
          userImageHeight
        );
        ctx.restore(); // Restaurar el contexto para que los siguientes dibujos no estén recortados
      }

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `Calendario_Eter_Abril_Personalizado.png`;
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
        pdf.save(`Calendario_Eter_Abril_Personalizado.pdf`);
      }
      toast.success("¡Descarga completada!", { id: toastId });
    } catch (error) {
      console.error("Error al generar descarga:", error);
      toast.error("Error al generar el archivo. Por favor, intenta de nuevo.", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 p-4 md:p-8">
      {/* Contenedor principal para el diseño de tres columnas en PC */}
      <div className="md:grid md:grid-cols-3 md:gap-6 lg:gap-10 xl:gap-16">
        {/* Columna 1: Subir y Editar Imagen */}
        <div className="md:col-span-1 space-y-6">
          {/* Sección de Personalización */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4 w-full my-6 md:max-w-none">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Personaliza el tuyo</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          </div>
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
                  Sube tu Foto Favorita
                </h3>
                <p className="text-purple-200/60 font-medium max-w-xs mx-auto">
                  Haz clic o arrastra una imagen para colocarla dentro del calendario de Abril.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-white/20 bg-black shadow-2xl">
                {image && (
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                )}
              </div>

              <Card className="bg-white/10 border-white/20 backdrop-blur-2xl p-6 rounded-[2rem]">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/60">
                      <span>Ajustar Tamaño</span>
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
                      className="rounded-xl bg-green-500 hover:bg-green-600 text-white uppercase font-black text-xs tracking-widest shadow-lg shadow-green-500/20"
                    >
                      <Check className="size-4 mr-2" /> ¡Listo!
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Columna 2: Vista Previa y Botones de Descarga (Personalizado) */}
        <div className="md:col-span-1 space-y-8 mt-10 md:mt-0">
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
                        ¡Tu Calendario está listo!
                    </div>
                </div>

                <div className="flex justify-center">
                    <div 
                        ref={calendarRef}
                        className="relative w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-2xl overflow-hidden"
                        style={{ borderRadius: '0px' }}
                    >
                        <img 
                            src={base64Calendar || "/assets/calendario_base_abril.png"} 
                            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                            alt="Calendario Base"
                            crossOrigin="anonymous"
                        />

                        <div 
                            className="absolute bottom-[4.5%] left-[4.5%] w-[35.5%] h-[23.5%] z-20 bg-white rounded-2xl overflow-hidden shadow-lg"
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
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        onClick={() => generateDownload("png")}
                        disabled={isProcessing}
                        className="h-16 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest shadow-xl transition-all"
                    >
                        <FileDown className="size-5 mr-2" /> Descargar PNG
                    </Button>
                    <Button
                        onClick={() => generateDownload("pdf")}
                        disabled={isProcessing}
                        className="h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 font-black uppercase tracking-widest shadow-xl transition-all"
                    >
                        <Printer className="size-5 mr-2" /> Descargar PDF
                    </Button>
                </div>

                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => setShowEditor(true)}
                        className="text-white/40 hover:text-white uppercase font-black text-[10px] tracking-[0.2em] h-10"
                    >
                        <RotateCcw className="size-3 mr-2" /> Ajustar de nuevo
                    </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Columna 3: Versión Original */}
        <div className="md:col-span-1 space-y-8 mt-10 md:mt-0">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 w-full my-6 md:max-w-none">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">O Descarga la versión original</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <Card className="w-full bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden rounded-3xl">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                    <FileDown className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Versión Original</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Sin personalizar</p>
                  </div>
                </div>
                {/* Vista previa de la imagen base */}
                <div className="relative w-full max-w-[200px] aspect-[1/1.414] bg-white shadow-lg rounded-lg overflow-hidden">
                  <img 
                    src={base64Calendar || "/assets/calendario_base_abril.png"} 
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Calendario Base Vista Previa"
                    crossOrigin="anonymous"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={downloadOriginalPdf}
                  disabled={isProcessing}
                  className="rounded-xl border-white/20 text-white hover:bg-white/10 h-10 px-4 text-xs font-black uppercase tracking-widest"
                >
                  Descargar PDF Original
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
