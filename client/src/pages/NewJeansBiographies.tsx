import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Music, Award, BookOpen, Heart, Maximize2, Sparkles, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function NewJeansBiographies() {
  const [, navigate] = useLocation();

  const members = [
    {
      id: "minji",
      stageName: "Minji",
      realName: "Kim Min-ji",
      position: "Líder, Vocalista, Bailarina",
      birthday: "7 de mayo de 2004",
      birthplace: "Chuncheon, Gangwon, Corea del Sur",
      mbti: "ESTJ",
      image: "https://i.pinimg.com/736x/05/7b/ee/057bee2994b408a891aba549858c07a2.jpg",
      color: "bg-blue-400",
      fullBio: {
        preDebut: "Minji fue aprendiz de Source Music y apareció en el video musical 'Permission to Dance' de BTS antes de su debut. Es conocida por su belleza clásica coreana y su papel como la 'hermana mayor' del grupo.",
        soloCareer: "Es embajadora global de Chanel (Moda, Relojería y Belleza). Ha participado en numerosas sesiones de fotos para revistas de alto perfil como Vogue y Elle.",
        achievements: "Ha encabezado las listas de reputación de marca de idols individuales múltiples veces. Es reconocida por su fluidez en inglés y su carisma natural.",
        curiosities: "Le encanta el color azul y las estaciones frías. Es muy organizada y le gusta planificar todo con antelación."
      }
    },
    {
      id: "hanni",
      stageName: "Hanni",
      realName: "Hanni Pham / Pham Ngoc Han",
      position: "Vocalista, Bailarina",
      birthday: "6 de octubre de 2004",
      birthplace: "Melbourne, Australia",
      mbti: "INFP",
      image: "https://www.nme.com/wp-content/uploads/2024/10/newjeans-hanni-audit-101024.jpg",
      color: "bg-pink-400",
      fullBio: {
        preDebut: "Hanni es de ascendencia vietnamita pero nació y creció en Australia. También apareció en el MV 'Permission to Dance' de BTS. Es la primera idol vietnamita bajo HYBE.",
        soloCareer: "Es embajadora global de Gucci y Armani Beauty. Ha co-escrito letras para canciones de NewJeans como 'Hype Boy' y 'ASAP'.",
        achievements: "Reconocida por su tono vocal único y su versatilidad en el baile. Es una de las idols extranjeras más influyentes de la actualidad.",
        curiosities: "Habla fluido vietnamita, inglés y coreano. Le encanta ver películas y es fan de las comedias románticas."
      }
    },
    {
      id: "danielle",
      stageName: "Danielle",
      realName: "Danielle Marsh / Mo Ji-hye",
      position: "Vocalista, Bailarina",
      birthday: "11 de abril de 2005",
      birthplace: "Newcastle, Nueva Gales del Sur, Australia",
      mbti: "ENFP",
      image: "https://nolae.es/cdn/shop/articles/danielle-newjeans-profil-584290.jpg?v=1737393834&width=1920",
      color: "bg-yellow-400",
      fullBio: {
        preDebut: "Danielle es de ascendencia coreana-australiana. De niña, apareció en varios programas de televisión coreanos como 'Rainbow Kindergarten'.",
        soloCareer: "Prestó su voz para el doblaje coreano de Ariel en la película 'La Sirenita' (2023) y cantó el tema principal. Es embajadora global de Burberry y YSL Beauty.",
        achievements: "Elogiada por su talento vocal y su capacidad para transmitir emociones. Su participación en Disney fue un hito para su carrera.",
        curiosities: "Le encanta surfear y dibujar. Es conocida por su personalidad brillante y 'soleada' que siempre anima al grupo."
      }
    },
    {
      id: "haerin",
      stageName: "Haerin",
      realName: "Kang Hae-rin",
      position: "Vocalista, Bailarina",
      birthday: "15 de mayo de 2006",
      birthplace: "Seúl, Corea del Sur",
      mbti: "ISTP",
      image: "https://i.pinimg.com/736x/43/5b/c7/435bc74cf04af112e472f6c7f1e628be.jpg",
      color: "bg-green-400",
      fullBio: {
        preDebut: "Haerin practicaba pansori (música tradicional coreana) antes de convertirse en aprendiz. Es conocida por sus rasgos faciales que recuerdan a un gato.",
        soloCareer: "Es embajadora global de Dior (Joyas, Moda y Belleza). Es un ícono de estilo para la Generación Z.",
        achievements: "Sus visuales únicos y su precisión en el baile la han hecho destacar rápidamente. Es una de las idols más buscadas en internet.",
        curiosities: "Le gusta aprender cosas nuevas y es muy curiosa. Es conocida por ser un poco reservada pero muy divertida con sus compañeras."
      }
    },
    {
      id: "hyein",
      stageName: "Hyein",
      realName: "Lee Hye-in",
      position: "Vocalista, Bailarina, Maknae",
      birthday: "21 de abril de 2008",
      birthplace: "Incheon, Corea del Sur",
      mbti: "INFP",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Hyein_of_NewJeans%2C_July_26%2C_2024.png",
      color: "bg-purple-400",
      fullBio: {
        preDebut: "Hyein fue modelo infantil y miembro del grupo infantil U.SSO Girl. También apareció en contenidos de YouTube antes de unirse a ADOR.",
        soloCareer: "Es la embajadora global más joven de Louis Vuitton. Ha demostrado una madurez increíble para su edad en la industria de la moda.",
        achievements: "A pesar de ser la menor, tiene una voz potente y una presencia escénica imponente. Es considerada una 'prodigio' del K-pop.",
        curiosities: "Es una gran fan de BTS. Le gusta tomar fotos y caminar mientras escucha música. Es muy alta para su edad."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">NewJeans: Biografía Completa</h1>
          </div>
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none px-3 py-1">
            5 Conejos
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://wallpaperaccess.com/full/8626014.jpg"
          alt="NewJeans Group"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">NewJeans</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            La frescura y el estilo retro que han revolucionaron la industria musical con su concepto innovador y auténtico.
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
                        className="w-full h-full object-cover object-top md:object-center transition-transform duration-700 group-hover:scale-110"
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
                      className="w-full h-full object-cover object-top md:object-center"
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
                                <Music className="size-4 text-blue-500" /> Pre-Debut
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
