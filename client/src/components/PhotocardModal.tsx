import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { InteractivePhotocard } from './InteractivePhotocard';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { trpc } from '../lib/trpc';

interface PhotocardModalProps {
  isOpen: boolean;
  photocard: {
    id: string;
    imageUrl: string;
    characterName: string;
    shineType: 'stars' | 'hearts' | 'rainbow' | 'holographic' | 'diamond' | 'crystal';
    folio: string;
    opacity: number;
  } | null;
  onClose: () => void;
}

export const PhotocardModal: React.FC<PhotocardModalProps> = ({
  isOpen,
  photocard,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!photocard) return;

    try {
      setIsDownloading(true);
      
      // Intentar primero con el proxy del servidor
      try {
        const result = await trpc.photocards.download.mutate({
          imageUrl: photocard.imageUrl,
          folio: photocard.folio,
        });

        if (result.success && result.data) {
          const binaryString = atob(result.data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: result.mimeType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = result.filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success('¡Photocard descargada!');
          return;
        }
      } catch (proxyError) {
        console.warn('Proxy download failed, trying fallback method:', proxyError);
      }

      // MÉTODO DE RESPALDO: Usar Canvas para "dibujar" la imagen (útil si el proxy falla)
      const img = new Image();
      img.crossOrigin = "anonymous"; // Intentar saltar CORS
      img.src = photocard.imageUrl;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${photocard.folio}.png`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
              toast.success('¡Photocard descargada (vía canvas)!');
            } else {
              toast.error('Error al generar la imagen');
            }
          }, 'image/png');
        }
      };

      img.onerror = () => {
        // Si todo falla, intentar abrir en pestaña nueva como último recurso
        window.open(photocard.imageUrl, '_blank');
        toast.info('La descarga automática falló, abriendo imagen en pestaña nueva.');
      };

    } catch (error) {
      console.error('Final download error:', error);
      toast.error('Error al descargar la photocard');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && photocard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm md:max-w-md bg-gradient-to-b from-slate-100 to-slate-50 rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
            >
              <X className="size-6 text-slate-900" />
            </button>

            {/* Photocard Container - Looks like a real card */}
            <div 
              className="w-full max-w-xs aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-white"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              <InteractivePhotocard
                imageUrl={photocard.imageUrl}
                characterName={photocard.characterName}
                shineType={photocard.shineType}
                showName={false}
                folio={photocard.folio}
                opacity={photocard.opacity}
              />
            </div>

            {/* Info and Download Section */}
            <div className="w-full mt-8 space-y-4">
              <div className="space-y-1 text-center">
                <p className="text-sm font-black text-slate-900 tracking-wider">{photocard.folio}</p>
                <p className="text-xs text-slate-500 font-medium">{photocard.characterName}</p>
              </div>

              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl gap-2 h-12 shadow-lg shadow-purple-200 transition-all"
              >
                <Download className="size-5" />
                {isDownloading ? 'Descargando...' : 'Descargar Photocard'}
              </Button>

              <p className="text-xs text-slate-400 text-center italic">
                Mueve el dedo para ver el efecto holográfico completo ✨
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
