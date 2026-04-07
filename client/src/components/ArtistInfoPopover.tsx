import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ArtistInfoPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  extract: string;
  thumbnail?: string;
  loading?: boolean;
  error?: string | null;
  source?: 'wikipedia' | 'google';
  googleSearchUrl?: string;
}

export function ArtistInfoPopover({
  isOpen,
  onClose,
  title,
  extract,
  thumbnail,
  loading = false,
  error = null,
  source = 'wikipedia',
  googleSearchUrl,
}: ArtistInfoPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro de fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal centrado */}
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed z-50 w-full max-w-md bg-gradient-to-br from-white/98 to-slate-50/98 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/60 overflow-hidden top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200/50">
              <div className="flex-1 pr-4">
                <h3 className="font-black text-slate-900 text-lg line-clamp-2">
                  {title}
                </h3>
                {source === 'google' && (
                  <p className="text-xs text-orange-600 font-bold mt-2">
                    📍 Búsqueda en Google
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-slate-200/50 rounded-xl transition-all flex-shrink-0"
              >
                <X className="h-5 w-5 text-slate-600" />
              </motion.button>
            </div>

            {/* Contenido */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="h-8 w-8 text-purple-600" />
                  </motion.div>
                </div>
              ) : error ? (
                <div className="text-sm text-red-600 text-center py-6 font-medium">
                  ⚠️ {error}
                </div>
              ) : (
                <div className="space-y-4">
                  {thumbnail && (
                    <motion.img
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      src={thumbnail}
                      alt={title}
                      className="w-full h-32 object-cover rounded-2xl shadow-lg"
                    />
                  )}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-sm text-slate-700 leading-relaxed"
                  >
                    {extract}
                  </motion.p>
                  
                  {/* Botones de acción */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3 pt-4"
                  >
                    {source === 'wikipedia' ? (
                      <>
                        <a
                          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                            title
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Wikipedia
                        </a>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            title + ' K-Pop'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Google
                        </a>
                      </>
                    ) : (
                      <a
                        href={googleSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Buscar en Google
                      </a>
                    )}
                  </motion.div>

                  {/* Sugerencia de cierre */}
                  <p className="text-xs text-slate-500 text-center pt-2">
                    Presiona <kbd className="px-2 py-1 bg-slate-200 rounded text-slate-700 font-mono">ESC</kbd> para cerrar
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
