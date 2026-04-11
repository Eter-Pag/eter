import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Unlock,
  Download,
  Search,
  Facebook,
  Sparkles,
  Star,
  Calendar,
  Award,
  Image as ImageIcon,
  ArrowLeft,
  Crown,
  Gift,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { InteractivePhotocard } from "@/components/InteractivePhotocard";
import { PhotocardModal } from "@/components/PhotocardModal";
import { useLocation } from "wouter";

export default function Subscribers() {
  const [, navigate] = useLocation();
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhotocard, setSelectedPhotocard] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: correctPassword } = trpc.subscribers.getPassword.useQuery();
  const { data: photocards = [] } = trpc.photocards.list.useQuery();
  const facebookSubscribeLink = "https://www.facebook.com/61585362107747/subscribe/";
  const adminPassword = "panochonas12";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === correctPassword || passwordInput === adminPassword) {
      setIsAuthorized(true);
      toast.success("¡Acceso concedido, ARMY!");
    } else {
      toast.error("Contraseña incorrecta. Revisa el grupo de suscriptores.");
      setPasswordInput("");
    }
  };

  const vipBenefits = [
    {
      id: 1,
      title: "Diplomas de Colección",
      description: "Diseños exclusivos con folio personalizado cada mes.",
      icon: Award,
      status: "Disponible",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 2,
      title: "Calendario Premium",
      description: "Versión extendida con fechas importantes del fandom.",
      icon: Calendar,
      status: "Disponible",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 3,
      title: "Photocards Digitales",
      description: "Set de 7 photocards exclusivas en alta resolución.",
      icon: ImageIcon,
      status: "Próximamente",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const filteredPhotocards = photocards.filter(
    (pc) =>
      searchQuery === "" ||
      pc.folio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.characterName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={() => navigate("/")}
            className="gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="font-black text-lg flex items-center gap-2 text-white drop-shadow-lg">
            <Crown className="h-5 w-5 text-yellow-400" />
            Zona VIP Eter
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container py-8 px-4 relative z-10 max-w-6xl">
        {/* Hero badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20">
            <Star className="size-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-black uppercase tracking-widest text-white">
              Contenido Exclusivo para Suscriptores
            </span>
            <Star className="size-4 text-yellow-400 fill-yellow-400" />
          </div>
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
              Beneficios
            </span>{" "}
            <span className="text-white">Exclusivos</span>
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto font-medium text-base md:text-lg">
            Esta sección es solo para nuestra familia de suscriptores en
            Facebook. Aquí encontrarás contenido personalizado y descargas que
            nadie más tiene.
          </p>
        </motion.div>

        {/* ── PANTALLA DE ACCESO (no autorizado) ── */}
        <AnimatePresence mode="wait">
          {!isAuthorized ? (
            <motion.div
              key="lock"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />

                <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden">
                  <CardHeader className="pb-4 border-b border-white/10 text-center pt-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      className="size-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50"
                    >
                      <Lock className="size-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter text-white">
                      Contenido Protegido
                    </CardTitle>
                    <p className="text-white/60 text-sm mt-1">
                      Ingresa la contraseña mensual que publicamos en Facebook.
                    </p>
                  </CardHeader>

                  <CardContent className="p-8 pt-6">
                    <form onSubmit={handleVerify} className="space-y-4">
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="Contraseña VIP"
                          className="rounded-2xl h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 pl-12 focus:bg-white/20 focus:border-white/40 transition-all"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                      </div>

                      <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-base shadow-lg shadow-purple-500/40 transition-all uppercase tracking-widest">
                        Desbloquear Acceso
                      </Button>

                      <div className="pt-4 space-y-3 border-t border-white/10">
                        <p className="text-xs text-white/50 text-center font-medium">
                          ¿Aún no eres suscriptor?
                        </p>
                        <a
                          href={facebookSubscribeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/30"
                        >
                          <Facebook className="size-5" />
                          Suscribirse en Facebook
                        </a>
                        <a
                          href={facebookSubscribeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-xs font-bold text-purple-300 hover:text-purple-200 pt-1"
                        >
                          Obtén tu contraseña y beneficios exclusivos
                          <ChevronRight className="size-3" />
                        </a>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            /* ── CONTENIDO VIP (autorizado) ── */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Bienvenida */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 max-w-sm mx-auto"
              >
                <Unlock className="size-5 text-green-400" />
                <span className="text-white font-black uppercase tracking-widest text-sm">
                  ¡Acceso VIP Activo!
                </span>
                <Sparkles className="size-5 text-yellow-400" />
              </motion.div>

              {/* ── SECCIÓN: Buscador de Folios ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                    Buscador de Folios
                  </h2>
                </div>

                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-20" />

                  <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <p className="text-white/70 text-sm font-medium shrink-0">
                          Busca tu nombre para encontrar tu descarga personalizada.
                        </p>
                        <div className="relative w-full">
                          <Search className="absolute left-4 top-3.5 h-4 w-4 text-white/60" />
                          <Input
                            placeholder="Escribe tu nombre o folio..."
                            className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-xl focus:bg-white/20 focus:border-white/40 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* ── SECCIÓN: Photocards Holográficas ── */}
              {photocards.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-pink-400 rounded-full" />
                    <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                      <Sparkles className="size-5 text-yellow-400" />
                      Photocards Holográficas
                    </h2>
                  </div>

                  <p className="text-white/60 text-sm mb-5 font-medium">
                    Colecciona nuestras photocards exclusivas. ¡Mueve el ratón o
                    desliza en móvil para ver el efecto holográfico!
                  </p>

                  <div className="relative">
                    {/* Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-20" />

                    <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden">
                      <CardContent className="p-6">
                        {filteredPhotocards.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filteredPhotocards.map((pc) => (
                              <motion.div
                                key={pc.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col gap-2"
                              >
                                <div
                                  className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 hover:border-purple-400/70 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 cursor-pointer group"
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
                                  {/* Overlay hover */}
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-2xl">
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                      <Sparkles className="size-8 text-white drop-shadow-lg" />
                                    </div>
                                  </div>
                                </div>

                                {/* Info y botón */}
                                <div className="space-y-2">
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-white truncate">
                                      {pc.folio}
                                    </p>
                                    <p className="text-xs text-white/50 truncate">
                                      {pc.characterName}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setSelectedPhotocard(pc);
                                      setIsModalOpen(true);
                                    }}
                                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-purple-500/40"
                                  >
                                    Ver Completa ✨
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-white/40 text-sm">
                              No se encontraron photocards con ese nombre.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* ── SECCIÓN: Beneficios VIP ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-indigo-400 rounded-full" />
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white flex items-center gap-2">
                    <Gift className="size-5 text-pink-400" />
                    Beneficios Exclusivos
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {vipBenefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + index * 0.08 }}
                      whileHover={{ y: -5 }}
                      className="relative group"
                    >
                      {/* Glow */}
                      <div
                        className={`absolute -inset-0.5 bg-gradient-to-r ${benefit.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500`}
                      />

                      <Card className="relative bg-white/10 border-2 border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden h-full">
                        <div
                          className={`h-1 bg-gradient-to-r ${benefit.color}`}
                        />
                        <CardContent className="p-6">
                          <div
                            className={`size-12 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 text-white shadow-lg`}
                          >
                            <benefit.icon className="size-6" />
                          </div>

                          <Badge
                            className={`mb-3 border-none font-bold uppercase text-[10px] tracking-widest ${
                              benefit.status === "Disponible"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-white/10 text-white/50 border border-white/20"
                            }`}
                          >
                            {benefit.status}
                          </Badge>

                          <h3 className="text-lg font-black uppercase tracking-tighter mb-2 text-white">
                            {benefit.title}
                          </h3>
                          <p className="text-white/60 text-sm leading-relaxed mb-6">
                            {benefit.description}
                          </p>

                          <Button
                            variant={
                              benefit.status === "Disponible"
                                ? "default"
                                : "secondary"
                            }
                            disabled={benefit.status !== "Disponible"}
                            className={`w-full rounded-xl font-bold uppercase tracking-widest gap-2 ${
                              benefit.status === "Disponible"
                                ? `bg-gradient-to-r ${benefit.color} hover:opacity-90 text-white border-none shadow-lg`
                                : "bg-white/10 text-white/40 border border-white/10"
                            }`}
                          >
                            {benefit.status === "Disponible" ? (
                              <>
                                <Download className="size-4" /> Descargar
                              </>
                            ) : (
                              "Muy pronto"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ── SECCIÓN: CTA ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative">
                  {/* Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />

                  <Card className="relative bg-gradient-to-br from-purple-900/80 via-pink-900/60 to-indigo-900/80 border-2 border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden">
                    <CardContent className="p-8 md:p-10 text-center relative">
                      <div className="absolute top-4 right-6 opacity-10">
                        <Sparkles className="size-28 text-white" />
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl mb-4"
                      >
                        👑
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-black uppercase italic mb-3 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                        ¿Quieres más exclusividad?
                      </h2>
                      <p className="text-purple-200 mb-8 max-w-xl mx-auto font-medium text-sm md:text-base">
                        Cada mes renovamos los diseños. Si dejas de ser
                        suscriptor, perderás el acceso a las nuevas colecciones.
                        ¡No te quedes fuera!
                      </p>
                      <a
                        href={facebookSubscribeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl shadow-yellow-500/30 transition-all">
                          <Facebook className="size-5 mr-2" />
                          Invitar a una ARMY
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
