import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InteractivePhotocardProps {
  imageUrl: string;
  characterName: string;
  shineType?: 'stars' | 'hearts' | 'rainbow' | 'holographic' | 'diamond' | 'crystal';
  showName?: boolean;
  folio?: string;
  onTouchMove?: (rotation: { x: number; y: number }) => void;
}

export const InteractivePhotocard: React.FC<InteractivePhotocardProps> = ({
  imageUrl,
  characterName,
  shineType = 'holographic' as 'stars' | 'hearts' | 'rainbow' | 'holographic' | 'diamond' | 'crystal',
  showName = true,
  folio = '',
  onTouchMove,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shinePosition, setShinePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calcular rotación (máximo 15 grados)
    const rotateY = ((mouseX - centerX) / centerX) * 15;
    const rotateX = ((centerY - mouseY) / centerY) * 15;

    setRotation({ x: rotateX, y: rotateY });

    // Calcular posición del brillo
    const shineX = (mouseX / rect.width) * 100;
    const shineY = (mouseY / rect.height) * 100;
    setShinePosition({ x: shineX, y: shineY });

    onTouchMove?.({ x: rotateX, y: rotateY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const touchX = e.touches[0].clientX - rect.left;
    const touchY = e.touches[0].clientY - rect.top;

    // Calcular rotación (máximo 15 grados)
    const rotateY = ((touchX - centerX) / centerX) * 15;
    const rotateX = ((centerY - touchY) / centerY) * 15;

    setRotation({ x: rotateX, y: rotateY });

    // Calcular posición del brillo
    const shineX = (touchX / rect.width) * 100;
    const shineY = (touchY / rect.height) * 100;
    setShinePosition({ x: shineX, y: shineY });

    onTouchMove?.({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setShinePosition({ x: 50, y: 50 });
  };

  useEffect(() => {
    // Ensure shineType is valid
    const validTypes: string[] = ['stars', 'hearts', 'rainbow', 'holographic', 'diamond', 'crystal'];
    if (!validTypes.includes(shineType)) {
      // Type validation
    }
  }, [shineType]);

  const getShinePattern = () => {
    switch (shineType) {
      case 'stars':
        return 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 255, 255, 0.3) 0%, rgba(255, 215, 0, 0.15) 20%, transparent 60%)';
      case 'hearts':
        return 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 192, 203, 0.25) 0%, rgba(255, 105, 180, 0.1) 30%, transparent 70%)';
      case 'rainbow':
        return 'conic-gradient(from 0deg at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 100, 100, 0.15), rgba(255, 200, 100, 0.12), rgba(100, 255, 100, 0.12), rgba(100, 200, 255, 0.12), rgba(150, 100, 255, 0.15), rgba(255, 100, 200, 0.15), rgba(255, 100, 100, 0.15))';
      case 'diamond':
        return 'radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255, 255, 255, 0.35) 0%, rgba(200, 220, 255, 0.15) 15%, transparent 40%)';
      case 'crystal':
        return 'linear-gradient(45deg, transparent 30%, rgba(200, 230, 255, 0.2) 50%, transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(200, 230, 255, 0.15) 50%, transparent 70%)';
      case 'holographic':
      default:
        return 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(147, 112, 219, 0.12) 25%, rgba(0, 255, 255, 0.12) 50%, rgba(255, 192, 203, 0.12) 75%, rgba(255, 255, 255, 0.25) 100%)';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className="perspective cursor-grab active:cursor-grabbing"
      style={{
        '--shine-x': `${shinePosition.x}%`,
        '--shine-y': `${shinePosition.y}%`,
      } as React.CSSProperties}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
        className="relative w-full h-full"
      >
        {/* Photocard Container */}
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            aspectRatio: '2 / 3',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Base Image */}
          <img
            src={imageUrl}
            alt={characterName}
            className="w-full h-full object-cover"
          />

          {/* Shine Effect Layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: getShinePattern(),
              mixBlendMode: 'screen',
              opacity: 0.5,
            }}
          />

          {/* Holographic Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
              mixBlendMode: 'overlay',
              animation: 'shimmer 3s infinite',
            }}
          />

          {/* Character Name Badge */}
          {showName && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-black text-center uppercase tracking-widest text-sm">
                {characterName}
              </p>
            </div>
          )}

          {/* Folio Badge (always visible) */}
          {folio && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-white font-bold text-xs tracking-widest">{folio}</p>
            </div>
          )}

          {/* Border Glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 20px rgba(147, 112, 219, 0.3), 0 0 30px rgba(147, 112, 219, 0.2)`,
            }}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
