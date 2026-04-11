import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { InteractivePhotocard } from './InteractivePhotocard';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
      const response = await fetch(photocard.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${photocard.folio}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('¡Photocard descargada!');
    } catch (error) {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
            >
              <X className="size-6 text-slate-900" />
            </button>

            {/* Photocard Container */}
            <div className="aspect-[2/3] overflow-hidden">
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
            <div className="p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white">
              <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900">{photocard.folio}</p>
                <p className="text-xs text-slate-500">{photocard.characterName}</p>
              </div>

              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl gap-2 h-12"
              >
                <Download className="size-5" />
                {isDownloading ? 'Descargando...' : 'Descargar'}
              </Button>

              <p className="text-xs text-slate-400 text-center">
                Mueve el dedo para ver el efecto holográfico completo
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
