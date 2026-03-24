import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, Download, Share2, ZoomIn, Heart, Sparkles, Images } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlackpinkGallery() {
  const [, navigate] = useLocation();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const { data: photosData, isLoading } = trpc.galleries.list.useQuery({ group: "blackpink" });
  const photos = photosData || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Heart className="size-4 text-pink-600 fill-pink-600" />
            <span className="font-bold text-sm tracking-tight">Galería BLACKPINK</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/galerias")} className="gap-1 text-xs">
            <ArrowLeft className="size-3" />
            Volver
          </Button>
        </div>
      </header>

      <div className="relative h-[30vh] md:h-[40vh] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop"
          alt="Blackpink Banner"
          className="w-full h-full object-cover object-top"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container">
            <div className="inline-flex items-center gap-2 bg-pink-600 text-white rounded-full px-4 py-1 text-xs font-bold mb-3">
              <Sparkles className="size-3" />
              COLECCIÓN ESPECIAL
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg uppercase">Blackpink</h1>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl mt-2 drop-shadow-md">
              Explora los visuales más impactantes de las reinas del K-Pop.
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
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {photos.map((photo: any, index: number) => (
              <div key={index} className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden group cursor-zoom-in border-2 border-slate-100 hover:border-pink-400 transition-all shadow-sm hover:shadow-xl" onClick={() => openPhoto(photo.url)}>
                <img src={photo.url} alt={`Blackpink Photo ${index + 1}`} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 select-none pointer-events-none" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
                    <ZoomIn className="text-white size-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Images className="size-16 opacity-20" />
            <p className="font-medium text-lg">Esta galería estará disponible próximamente.</p>
            <Button variant="outline" onClick={() => navigate("/galerias")} className="rounded-full">Explorar otras galerías</Button>
          </div>
        )}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && closePhoto()}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-none shadow-none overflow-hidden flex items-center justify-center rounded-none md:rounded-3xl">
          <div className="relative w-full h-full flex items-center justify-center p-4 min-h-[60vh]">
            <Button variant="ghost" size="icon" onClick={closePhoto} className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full">
              <X className="size-6" />
            </Button>
            <img src={selectedPhoto || ""} alt="Full view" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} className="max-w-full max-h-[85vh] object-contain select-none shadow-2xl rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
