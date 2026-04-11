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
