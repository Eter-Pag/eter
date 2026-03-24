import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Music, Award, BookOpen, Heart, Maximize2, Sparkles, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function IveBiographies() {
  const [, navigate] = useLocation();

  const members = [
    {
      id: "yujin",
      stageName: "Yujin",
      realName: "An Yu-jin",
      position: "Líder, Vocalista Principal",
      birthday: "1 de septiembre de 2003",
      birthplace: "Daejeon, Corea del Sur",
      mbti: "ISTP",
      image: "https://i.redd.it/yujin-at-kcon-la-2025-d1-250802-v0-go3ta2tbaihf1.jpg?width=1602&format=pjpg&auto=webp&s=e39dcb06ad73f9fcd576178e399d7fc7d433b66a",
      color: "bg-red-300",
      fullBio: {
        preDebut: "Ex-integrante de IZ*ONE. Conocida por su versatilidad, carisma y liderazgo.",
        soloCareer: "Embajadora de Fendi y protagonista del programa de variedades 'Earth Arcade'.",
        achievements: "Llevó a IVE a ganar múltiples Daesangs (Grandes Premios) en su primer año.",
        curiosities: "Es muy atlética y buena en los deportes. Habla inglés y japonés básico."
      }
    },
    {
      id: "gaeul",
      stageName: "Gaeul",
      realName: "Kim Ga-eul",
      position: "Rapera Principal, Bailarina",
      birthday: "24 de septiembre de 2002",
      birthplace: "Incheon, Corea del Sur",
      mbti: "ISTJ",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/59/Ive_Gaeul_at_Seoul_Fashion_Week%2C_1_September_2025_03_%28cropped%29.png",
      color: "bg-blue-300",
      fullBio: {
        preDebut: "Fue reclutada por JYP y luego por Starship. Es la integrante con el período de entrenamiento más largo.",
        soloCareer: "Ha participado en la escritura de raps para varias canciones de IVE, como 'Royal' y 'Kitsch'.",
        achievements: "Reconocida por su presencia escénica y su rap estable.",
        curiosities: "Su nombre significa 'otoño' en coreano. Es la miembro mayor del grupo."
      }
    },
    {
      id: "rei",
      stageName: "Rei",
      realName: "Naoi Rei",
      position: "Rapera, Vocalista",
      birthday: "3 de febrero de 2004",
      birthplace: "Nagoya, Japón",
      mbti: "INFJ",
      image: "https://i.pinimg.com/736x/8a/b1/74/8ab17486dd8d83efb9ac1bdfec52e64f.jpg",
      color: "bg-green-300",
      fullBio: {
        preDebut: "Primera artista japonesa en debutar bajo Starship Entertainment. Conocida por su estilo único.",
        soloCareer: "Musa de la marca de cosméticos Bonajour y ha colaborado en la escritura de sus propios raps.",
        achievements: "Reconocida por su tono de rap distintivo y su creatividad.",
        curiosities: "Le encanta dibujar y decorar. Sus fans la llaman 'Kim Rei' por lo bien que habla coreano."
      }
    },
    {
      id: "wonyoung",
      stageName: "Wonyoung",
      realName: "Jang Won-young",
      position: "Vocalista, Visual",
      birthday: "31 de agosto de 2004",
      birthplace: "Seúl, Corea del Sur",
      mbti: "E???",
      image: "https://i.pinimg.com/736x/6f/2f/0f/6f2f0f7b0ec69af6490d4b740784e6a8.jpg",
      color: "bg-pink-300",
      fullBio: {
        preDebut: "Ex-integrante y centro de IZ*ONE. Un icono de la moda y una de las ídolos más populares.",
        soloCareer: "Embajadora global de Miu Miu e Innisfree. MC recurrente en eventos importantes.",
        achievements: "Ganadora del primer lugar en el programa de supervivencia Produce 48 a los 13 años.",
        curiosities: "Habla inglés con fluidez. Es conocida como la 'It Girl' de Corea por su influencia."
      }
    },
    {
      id: "liz",
      stageName: "Liz",
      realName: "Kim Ji-won",
      position: "Vocalista Principal",
      birthday: "21 de noviembre de 2004",
      birthplace: "Jeju, Corea del Sur",
      mbti: "INFP",
      image: "https://i.redd.it/ive-liz-has-been-announced-as-the-new-face-of-korean-casual-v0-fhupqnjszppf1.jpg?width=1080&format=pjpg&auto=webp&s=98bd3a7b1840ebdde20d0d61b52c6f0a1d336f03",
      color: "bg-cyan-300",
      fullBio: {
        preDebut: "Conocida por su potente voz y sus adorables hoyuelos. Apareció en el MV 'This Christmas' de Taeyeon.",
        soloCareer: "Ha demostrado su capacidad vocal en múltiples covers y presentaciones especiales.",
        achievements: "Elogiada constantemente por su técnica vocal estable y su emotividad al cantar.",
        curiosities: "Es una persona tímida y tranquila. Le encantan los gatos y tiene una personalidad dulce."
      }
    },
    {
      id: "leeseo",
      stageName: "Leeseo",
      realName: "Lee Hyun-seo",
      position: "Vocalista, Maknae",
      birthday: "21 de febrero de 2007",
      birthplace: "Seúl, Corea del Sur",
      mbti: "ENFP",
      image: "https://i.pinimg.com/736x/9e/f2/1b/9ef21b780c6703757de41d688c18b9a0.jpg",
      color: "bg-yellow-300",
      fullBio: {
        preDebut: "Fue modelo infantil para SM Entertainment antes de unirse a Starship. Es la miembro más joven.",
        soloCareer: "Ha sido MC especial para Inkigayo y ha participado en varios programas de variedades.",
        achievements: "Conocida por su energía fresca y su personalidad brillante, es la 'mood-maker' del grupo.",
        curiosities: "Entrenó durante 2 años. Le encanta la canción 'Lion Heart' de Girls' Generation."
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/biografias")}
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">IVE: Biografía Completa</h1>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-none px-3 py-1">
            6 Leyendas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://4kwallpapers.com/images/wallpapers/ive-k-pop-an-yujin-2560x1440-23394.jpg"
          alt="IVE Group"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">IVE</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Seis artistas excepcionales que brillan con su talento, confianza y la determinación de conquistar el mundo de la música.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="cursor-pointer"
                >
                  <Card className="group overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-white">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.stageName}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 opacity-20 ${member.color}`} />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{member.position}</p>
                        <h4 className="text-2xl font-black tracking-tight">{member.stageName}</h4>
                        <p className="text-white/80 text-sm font-medium">{member.realName}</p>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                          <Maximize2 className="size-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </DialogTrigger>

              <DialogContent className="max-w-4xl bg-white border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                <div className="flex flex-col md:flex-row h-[90vh] md:h-[80vh]">
                  {/* Image Sidebar */}
                  <div className="w-full md:w-2/5 relative h-64 md:h-full">
                    <img 
                      src={member.image} 
                      alt={member.stageName}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-8 left-8">
                      <h2 className="text-5xl font-black text-white tracking-tighter mb-2">{member.stageName}</h2>
                      <p className="text-white/90 text-xl font-bold">{member.realName}</p>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-white">
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Calendar className="size-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Nacimiento</span>
                          </div>
                          <p className="font-bold text-slate-900">{member.birthday}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <MapPin className="size-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Origen</span>
                          </div>
                          <p className="font-bold text-slate-900 truncate">{member.birthplace}</p>
                        </div>
                      </div>

                      <Tabs defaultValue="historia" className="w-full">
                        <TabsList className="w-full bg-slate-100 p-1 rounded-2xl h-12">
                          <TabsTrigger value="historia" className="flex-1 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Historia</TabsTrigger>
                          <TabsTrigger value="logros" className="flex-1 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Logros</TabsTrigger>
                          <TabsTrigger value="curiosidades" className="flex-1 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Extra</TabsTrigger>
                        </TabsList>
                        
                        <div className="mt-8 space-y-6">
                          <TabsContent value="historia" className="space-y-6 m-0">
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-widest text-xs">
                                <Music className="size-4 text-purple-500" /> Pre-Debut
                              </h4>
                              <p className="text-slate-600 leading-relaxed">{member.fullBio.preDebut}</p>
                            </div>
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-widest text-xs">
                                <Star className="size-4 text-amber-500" /> Carrera Solista
                              </h4>
                              <p className="text-slate-600 leading-relaxed">{member.fullBio.soloCareer}</p>
                            </div>
                          </TabsContent>

                          <TabsContent value="logros" className="space-y-6 m-0">
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-widest text-xs">
                                <Award className="size-4 text-blue-500" /> Logros Destacados
                              </h4>
                              <p className="text-slate-600 leading-relaxed">{member.fullBio.achievements}</p>
                            </div>
                          </TabsContent>

                          <TabsContent value="curiosidades" className="space-y-6 m-0">
                            <div className="space-y-3">
                              <h4 className="flex items-center gap-2 font-black text-slate-900 uppercase tracking-widest text-xs">
                                <Heart className="size-4 text-pink-500" /> Curiosidades
                              </h4>
                              <p className="text-slate-600 leading-relaxed">{member.fullBio.curiosities}</p>
                            </div>
                            <div className="flex items-center justify-center gap-4 pt-4">
                              <Sparkles className="size-6 text-purple-500" />
                              <div className="h-px w-12 bg-slate-100" />
                              <Heart className="size-6 text-pink-500 fill-current" />
                              <div className="h-px w-12 bg-slate-100" />
                              <Globe className="size-6 text-blue-500" />
                            </div>
                          </TabsContent>
                        </div>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-center mt-20">
        <div className="container px-4">
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-4">Eter K-Pop MX</p>
          <p className="text-white/20 text-xs max-w-md mx-auto">
            Información actualizada a marzo de 2026. Todas las imágenes pertenecen a sus respectivos dueños.
          </p>
        </div>
      </footer>
    </div>
  );
}
