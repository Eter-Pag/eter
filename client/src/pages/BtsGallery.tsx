import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Download, Share2, ZoomIn, Heart, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function BtsGallery() {
  const [, navigate] = useLocation();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Manejo de Hash para navegación por atrás en móviles
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [selectedPhoto]);

  const openPhoto = (photo: string) => {
    setSelectedPhoto(photo);
    window.location.hash = `photo-${encodeURIComponent(photo.substring(0, 10))}`;
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  const { data: photosData, isLoading } = trpc.galleries.list.useQuery({ group: "bts" });
  const photos = photosData || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-purple-600 fill-purple-600" />
            <span className="font-bold text-sm tracking-tight">Galería BTS</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/galerias")}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="size-3" />
            Volver
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img 
          src="https://www.billboard.com/wp-content/uploads/2026/03/bts-netflix-trailer-2026-billboard-1800.jpg?w=1024"
          alt="BTS Banner"
          className="w-full h-full object-cover object-top"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container">
            <div className="inline-flex items-center gap-2 bg-purple-600 text-white rounded-full px-4 py-1 text-xs font-bold mb-3">
              <Sparkles className="size-3" />
              COLECCIÓN ESPECIAL
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">BTS</h1>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl mt-2 drop-shadow-md">
              Explora los momentos más icónicos y las mejores sesiones fotográficas de los reyes del K-Pop.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl md:rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {photos.map((photo: any, index: number) => (
              <div 
                key={index}
                className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden group cursor-zoom-in border-2 border-slate-100 hover:border-purple-400 transition-all shadow-sm hover:shadow-xl"
                onClick={() => openPhoto(photo.url)}
              >
                <img 
                  src={photo.url} 
                  alt={`BTS Photo ${index + 1}`}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
                    <ZoomIn className="text-white size-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Detail Modal */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && closePhoto()}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none shadow-none overflow-hidden flex items-center justify-center rounded-none md:rounded-3xl">
          <div className="relative w-full h-full flex items-center justify-center p-4 min-h-[60vh]">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closePhoto}
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            >
              <X className="size-6" />
            </Button>
            
            <img 
              src={selectedPhoto || ""} 
              alt="Full view"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl rounded-lg"
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              <Button variant="secondary" size="sm" className="rounded-full gap-2 bg-white/10 text-white hover:bg-white/20 border-none backdrop-blur-md px-6">
                <Download className="size-4" />
                Descargar
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full gap-2 bg-white/10 text-white hover:bg-white/20 border-none backdrop-blur-md px-6">
                <Share2 className="size-4" />
                Compartir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
