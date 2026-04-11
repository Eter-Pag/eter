import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { InteractivePhotocard } from "@/components/InteractivePhotocard";
import { PhotocardModal } from "@/components/PhotocardModal";
import { useLocation } from "wouter";

export default function PhotocardsGallery() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotocard, setSelectedPhotocard] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const { data: photocards = [] } = trpc.photocards.list.useQuery();
  const { data: correctPassword } = trpc.subscribers.getPassword.useQuery();
  const adminPassword = "panochonas12";

  // Verificar autorización al cargar (basado en sessionStorage para no pedirla siempre en la misma sesión)
  useEffect(() => {
    const auth = sessionStorage.getItem("vip_authorized");
    if (auth === "true") {
      setIsAuthorized(true);
    } else {
      // Si no está autorizado, redirigir a suscriptores
      navigate("/suscriptores");
    }
  }, [navigate]);

  const filteredPhotocards = photocards.filter(
    (pc) =>
      searchQuery === "" ||
      pc.folio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.characterName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
      {/* Fondo decorativo punteado */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header sticky */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20 p-4">
        <div className="container flex items-center justify-between max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/suscriptores")}
            className="gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Zona VIP
          </Button>
          <h1 className="font-black text-lg flex items-center gap-2 text-white drop-shadow-lg">
            <ImageIcon className="h-5 w-5 text-blue-400" />
            Galería de Photocards
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container py-8 px-4 relative z-10 max-w-6xl">
        {/* Título y buscador */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-10"
        >
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-2 text-white">
              Colección <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Completa</span>
            </h1>
            <p className="text-white/60 font-medium">
              Explora todas nuestras photocards exclusivas para suscriptores.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-20" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <Input
                placeholder="Busca por nombre o folio..."
                className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl focus:bg-white/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Grid de Photocards */}
        <div className="relative">
          {/* Glow decorativo */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl opacity-50 pointer-events-none" />

          {filteredPhotocards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredPhotocards.map((pc, index) => (
                <motion.div
                  key={pc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ y: -10 }}
                  className="flex flex-col gap-3"
                >
                  <div
                    className="relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/10 hover:border-blue-400/50 transition-all duration-500 group cursor-pointer"
                    style={{ aspectRatio: "2/3" }}
                    onClick={() => {
                      setSelectedPhotocard(pc);
                      setIsModalOpen(true);
                    }}
                  >
                    <InteractivePhotocard
                      imageUrl={pc.imageUrl}
                      characterName={pc.characterName}
                      shineType={pc.shineType}
                      showName={false}
                      opacity={pc.opacity ?? 0.5}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100">
                        <Sparkles className="size-12 text-white drop-shadow-2xl" />
                      </div>
                    </div>
                  </div>

                  <div className="px-2 space-y-2">
                    <div className="space-y-0.5">
                      <h3 className="font-black text-white text-sm uppercase tracking-tight truncate">
                        {pc.folio}
                      </h3>
                      <p className="text-white/40 text-xs font-medium truncate">
                        {pc.characterName}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedPhotocard(pc);
                        setIsModalOpen(true);
                      }}
                      className="w-full h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Ver Detalle ✨
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
              <ImageIcon className="size-16 text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white/40">No se encontraron resultados</h3>
              <p className="text-white/20 text-sm">Prueba con otro nombre o folio</p>
            </div>
          )}
        </div>
      </main>

      {/* Photocard Modal */}
      <PhotocardModal
        isOpen={isModalOpen}
        photocard={selectedPhotocard}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPhotocard(null);
        }}
      />
    </div>
  );
}
