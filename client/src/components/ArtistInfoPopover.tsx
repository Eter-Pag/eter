import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ArtistInfoPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  extract: string;
  thumbnail?: string;
  loading?: boolean;
  error?: string | null;
  position?: { x: number; y: number };
}

export function ArtistInfoPopover({
  isOpen,
  onClose,
  title,
  extract,
  thumbnail,
  loading = false,
  error = null,
  position = { x: 0, y: 0 },
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 w-80 bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-white/50 overflow-hidden"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-12px',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 border-b border-slate-200/50">
            <div className="flex-1">
              <h3 className="font-black text-slate-900 text-sm line-clamp-2">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-slate-200/50 rounded-lg transition-all"
            >
              <X className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-600 text-center py-4">
                {error}
              </div>
            ) : (
              <div className="space-y-3">
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                )}
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-4">
                  {extract}
                </p>
                <a
                  href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
                    title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Ver más en Wikipedia →
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
