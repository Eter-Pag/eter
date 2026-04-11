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
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { InteractivePhotocard } from "@/components/InteractivePhotocard";

export default function Subscribers() {
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: correctPassword } = trpc.subscribers.getPassword.useQuery();
  const { data: photocards = [] } = trpc.photocards.list.useQuery();
  const facebookSubscribeLink = "https://www.facebook.com/61585362107747/subscribe/";

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
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
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: 2,
      title: "Calendario Premium",
      description: "Versión extendida con fechas importantes del fandom.",
      icon: Calendar,
      status: "Disponible",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 3,
      title: "Photocards Digitales",
      description: "Set de 7 photocards exclusivas en alta resolución.",
      icon: ImageIcon,
      status: "Próximamente",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="container max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6"
          >
            <Star className="size-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Zona VIP Eter</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase italic px-2">
            Beneficios <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Exclusivos</span>
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto font-medium">
            Esta sección es solo para nuestra familia de suscriptores en Facebook. 
            Aquí encontrarás contenido personalizado y descargas que nadie más tiene.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl -mt-6 px-4">
        {!isAuthorized ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-white pt-8 pb-4 text-center">
                <div className="size-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="size-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Contenido Protegido</CardTitle>
                <p className="text-slate-500 text-sm">Ingresa la contraseña mensual que publicamos en Facebook.</p>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Contraseña VIP"
                      className="rounded-2xl h-14 bg-slate-50 border-slate-200 pl-12 focus:ring-purple-500"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  </div>
                  <Button className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all">
                    Desbloquear Acceso
                  </Button>
                  <div className="pt-6 space-y-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 text-center font-medium">¿Aún no eres suscriptor?</p>
                    <a 
                      href={facebookSubscribeLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-200"
                    >
                      <Facebook className="size-5" />
                      Suscribirse en Facebook
                    </a>
                    <a 
                      href={facebookSubscribeLink}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 pt-2"
                    >
                      Obtén tu contraseña y beneficios exclusivos →
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 justify-center md:justify-start">
                    <Unlock className="size-6 text-green-500" />
                    Buscador de Folios
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">Busca tu nombre para encontrar tu descarga personalizada.</p>
                </div>
                <div className="relative w-full md:w-96">
                  <Input
                    placeholder="Escribe tu nombre..."
                    className="rounded-2xl h-12 bg-slate-50 border-slate-200 pl-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                </div>
              </div>
            </motion.div>

            {/* Photocards Gallery */}
            {photocards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Sparkles className="size-8 text-purple-600" />
                    Photocards Holográficas
                  </h2>
                  <p className="text-slate-600 font-medium">Colecciona nuestras photocards exclusivas. ¡Mueve el ratón o desliza en móvil para ver el efecto holográfico!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {photocards.map((pc) => (
                    <motion.div
                      key={pc.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      style={{ aspectRatio: '2/3' }}
                    >
                      <InteractivePhotocard
                        imageUrl={pc.imageUrl}
                        characterName={pc.characterName}
                        shineType={pc.shineType}
                        showName={pc.showName !== false}
                        folio={pc.folio}
                        opacity={pc.opacity ?? 0.5}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {vipBenefits.map((benefit) => (
                <motion.div
                  key={benefit.id}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <Card className="h-full border-none shadow-lg rounded-[2rem] overflow-hidden bg-white">
                    <div className={`h-2 bg-gradient-to-r ${benefit.color}`} />
                    <CardContent className="p-8">
                      <div className={`size-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                        <benefit.icon className="size-7" />
                      </div>
                      <Badge className="mb-4 bg-slate-100 text-slate-600 border-none font-bold uppercase text-[10px] tracking-widest">
                        {benefit.status}
                      </Badge>
                      <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{benefit.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-8">
                        {benefit.description}
                      </p>
                      <Button 
                        variant={benefit.status === "Disponible" ? "default" : "secondary"}
                        disabled={benefit.status !== "Disponible"}
                        className="w-full rounded-xl font-bold uppercase tracking-widest gap-2"
                      >
                        {benefit.status === "Disponible" ? (
                          <><Download className="size-4" /> Descargar</>
                        ) : (
                          "Muy pronto"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Teaser for non-subs (Even though authorized, showing what's coming) */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-[3rem] p-10 text-white text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="size-32" />
              </div>
              <h2 className="text-3xl font-black uppercase italic mb-4">¿Quieres más exclusividad?</h2>
              <p className="text-purple-100 mb-8 max-w-xl mx-auto font-medium">
                Cada mes renovamos los diseños. Si dejas de ser suscriptor, perderás el acceso a las nuevas colecciones. ¡No te quedes fuera!
              </p>
              <a 
                href={facebookSubscribeLink}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-white text-purple-600 hover:bg-purple-50 rounded-2xl px-10 h-14 font-black uppercase tracking-widest shadow-xl">
                  Invitar a una ARMY
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
