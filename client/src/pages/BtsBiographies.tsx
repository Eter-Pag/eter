import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Calendar, 
  MapPin, 
  Star, 
  Music, 
  Trophy, 
  Info, 
  X,
  Sparkles,
  Heart,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const members = [
  {
    id: "rm",
    name: "RM",
    realName: "Kim Nam-joon",
    position: "Rapero Líder, Productor, Líder",
    birth: "12 de septiembre de 1994",
    origin: "Seúl, Corea del Sur",
    mbti: "INTJ",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    bio: "Líder de BTS y mente creativa detrás de muchos conceptos del grupo. Es conocido por su inteligencia, profundidad lírica y visión artística.",
    curiosities: "Habla inglés, japonés y coreano con fluidez. Es un gran coleccionista de arte contemporáneo.",
    soloCareer: "Mixtapes 'RM' (2015), 'Mono' (2018). Álbum solista 'Indigo' (2022).",
    achievements: "Embajador global de UNICEF. Reconocido como uno de los raperos más influyentes del K-Pop."
  },
  {
    id: "jin",
    name: "Jin",
    realName: "Kim Seok-jin",
    position: "Vocalista Líder, Visual",
    birth: "4 de diciembre de 1992",
    origin: "Anyang, Gyeonggi, Corea del Sur",
    mbti: "ISFJ",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    bio: "El mayor de BTS, conocido por su voz dulce y su belleza clásica. Es el 'visual' del grupo y un pilar emocional para los miembros.",
    curiosities: "Es muy bueno cocinando. Tiene un gato llamado Jjangu. Completó su servicio militar en 2024.",
    soloCareer: "Sencillo 'The Astronaut' (2022). Álbum solista 'Happy' (2024).",
    achievements: "Embajador de Gucci. Reconocido por su carisma en programas de variedades."
  },
  {
    id: "suga",
    name: "SUGA",
    realName: "Min Yoon-gi",
    position: "Rapero Principal, Productor",
    birth: "9 de marzo de 1993",
    origin: "Daegu, Corea del Sur",
    mbti: "ISFP",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    bio: "Productor talentoso y rapero técnico de BTS. Es conocido por su estilo único y su contribución significativa a la producción musical del grupo.",
    curiosities: "Tiene un gato llamado Holly. Es un apasionado de los videojuegos. Completó su servicio militar en 2023.",
    soloCareer: "Mixtapes 'Agust D' (2016), 'D-2' (2020). Álbum 'D-Day' (2023).",
    achievements: "Productor acreditado en múltiples canciones de BTS. Embajador de Louis Vuitton."
  },
  {
    id: "jhope",
    name: "J-Hope",
    realName: "Jung Ho-seok",
    position: "Bailarín Líder, Rapero, Vocalista",
    birth: "18 de febrero de 1994",
    origin: "Gwangju, Corea del Sur",
    mbti: "ENFP",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop",
    bio: "Conocido como el 'Sol' de BTS por su personalidad radiante y energía inagotable. Es el bailarín principal y una fuente de inspiración para el grupo.",
    curiosities: "Es muy cercano a todos los miembros. Le encanta bailar y hacer ejercicio. Completó su servicio militar en 2023.",
    soloCareer: "Mixtape 'Hope World' (2018). Álbum solista 'Jack in the Box' (2022).",
    achievements: "Embajador de Prada. Reconocido por su técnica de baile excepcional."
  },
  {
    id: "jimin",
    name: "Jimin",
    realName: "Park Ji-min",
    position: "Vocalista Principal, Bailarín Principal",
    birth: "13 de octubre de 1995",
    origin: "Busan, Corea del Sur",
    mbti: "ENFP",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    bio: "Vocalista y bailarín excepcional, conocido por su flexibilidad, control corporal y presencia escénica magnética.",
    curiosities: "Es muy perfeccionista con sus coreografías. Tiene un gato llamado Meonji. Está en servicio militar actualmente.",
    soloCareer: "Sencillo 'With You' (2023). Álbum solista 'FACE' (2023).",
    achievements: "Embajador global de Dior y Calvin Klein. Récord de vistas en Spotify para solista de K-pop."
  },
  {
    id: "v",
    name: "V",
    realName: "Kim Tae-hyung",
    position: "Vocalista Principal, Visual",
    birth: "30 de diciembre de 1995",
    origin: "Daegu, Corea del Sur",
    mbti: "ENFP",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1000&auto=format&fit=crop",
    bio: "Conocido por su voz única y profunda, así como por sus visuales impactantes. Es un artista versátil con talento para la actuación.",
    curiosities: "Es muy cercano a Jungkook. Le encanta la fotografía y el arte. Está en servicio militar actualmente.",
    soloCareer: "Sencillo 'Singularity' (2018). Álbum solista 'Layover' (2023).",
    achievements: "Embajador global de Celine. Protagonista del drama 'Hwarang'."
  },
  {
    id: "jungkook",
    name: "Jungkook",
    realName: "Jeon Jung-kook",
    position: "Vocalista Principal, Bailarín, Rapero",
    birth: "1 de septiembre de 1997",
    origin: "Busan, Corea del Sur",
    mbti: "ISFP",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop",
    bio: "El miembro más joven de BTS, conocido como el 'Golden Maknae' por su versatilidad excepcional en canto, baile y rap.",
    curiosities: "Es muy cercano a V. Tiene un gato llamado Bam. Es un apasionado de los videojuegos y el fitness.",
    soloCareer: "Sencillo 'Euphoria' (2018). Álbum solista 'GOLDEN' (2023).",
    achievements: "Embajador global de Calvin Klein y Prada. Reconocido como uno de los artistas más versátiles de su generación."
  }
];

export default function BtsBiographies() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  const toggleMember = (id: string) => {
    setSelectedMember(selectedMember === id ? null : id);
  };

  useEffect(() => {
    if (selectedMember && bioRef.current) {
      setTimeout(() => {
        bioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [selectedMember]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-white"
          >
            BTS
          </motion.h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Los 7 Bangtan Boys que revolucionaron el mundo. Haz clic en cualquier integrante para descubrir su historia completa.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-16">
          {members.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => toggleMember(member.id)}
            >
              <Card 
                className={`overflow-hidden border-2 transition-all duration-300 ${
                  selectedMember === member.id 
                    ? 'border-purple-500 ring-4 ring-purple-500/40 shadow-lg shadow-purple-500/50' 
                    : 'border-zinc-800 hover:border-purple-600'
                } bg-zinc-900/50 backdrop-blur-sm`}
              >
                <div className="relative aspect-square">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  </div>
                </div>
                <div className="p-2 flex justify-center bg-black/60">
                  <Button 
                    className={`text-xs font-bold px-3 py-1 transition-all ${
                      selectedMember === member.id
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-600/60 hover:bg-purple-600 text-white'
                    }`}
                    size="sm"
                  >
                    {selectedMember === member.id ? "VIENDO" : "VER BIO"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Biography Content (Split View) */}
        <AnimatePresence mode="wait">
          {selectedMember && (
            <motion.div
              ref={bioRef}
              key={selectedMember}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-12"
            >
              {members.filter(m => m.id === selectedMember).map((member) => (
                <Card key={member.id} className="bg-gradient-to-br from-zinc-900/90 to-black border-purple-500/50 backdrop-blur-md shadow-2xl shadow-purple-500/20 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Left Column: Image & Quick Info */}
                      <div className="lg:w-2/5 bg-black/60 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-purple-500/20">
                        <div className="relative rounded-2xl overflow-hidden border-4 border-purple-500/50 shadow-purple-500/20 shadow-2xl">
                          <img src={member.image} alt={member.name} className="w-full aspect-square object-cover" />
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-purple-600 text-white px-3 py-1 text-sm font-bold">
                              {member.mbti}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-purple-600/10 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                            <User className="text-purple-400 w-5 h-5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-zinc-400 uppercase font-bold">Nombre Real</p>
                              <p className="font-medium text-sm truncate">{member.realName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-600/10 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                            <Calendar className="text-purple-400 w-5 h-5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-zinc-400 uppercase font-bold">Nacimiento</p>
                              <p className="font-medium text-sm">{member.birth}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-purple-600/10 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-colors">
                            <MapPin className="text-purple-400 w-5 h-5 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-zinc-400 uppercase font-bold">Origen</p>
                              <p className="font-medium text-sm">{member.origin}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Detailed Tabs */}
                      <div className="lg:w-3/5 p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                              {member.name} <Sparkles className="text-purple-400 w-7 h-7" />
                            </h2>
                            <p className="text-purple-400 font-medium text-base">{member.position}</p>
                          </div>
                          <Button 
                            onClick={() => setSelectedMember(null)}
                            variant="ghost" 
                            size="sm"
                            className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>

                        <Tabs defaultValue="bio" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 bg-black/50 p-1 rounded-xl border border-purple-500/30 mb-6">
                            <TabsTrigger value="bio" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm">Bio</TabsTrigger>
                            <TabsTrigger value="solo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm">Solo</TabsTrigger>
                            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm">Logros</TabsTrigger>
                            <TabsTrigger value="facts" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs sm:text-sm">Curiosidades</TabsTrigger>
                          </TabsList>
                          
                          <div className="min-h-[250px]">
                            <TabsContent value="bio" className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                              <div className="flex items-start gap-4">
                                <Info className="text-purple-400 w-6 h-6 mt-1 flex-shrink-0" />
                                <p className="text-zinc-300 leading-relaxed">{member.bio}</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="solo" className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                              <div className="flex items-start gap-4">
                                <Music className="text-purple-400 w-6 h-6 mt-1 flex-shrink-0" />
                                <p className="text-zinc-300 leading-relaxed">{member.soloCareer}</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="achievements" className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                              <div className="flex items-start gap-4">
                                <Trophy className="text-purple-400 w-6 h-6 mt-1 flex-shrink-0" />
                                <p className="text-zinc-300 leading-relaxed">{member.achievements}</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="facts" className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                              <div className="flex items-start gap-4">
                                <Heart className="text-purple-400 w-6 h-6 mt-1 flex-shrink-0" />
                                <p className="text-zinc-300 leading-relaxed">{member.curiosities}</p>
                              </div>
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
