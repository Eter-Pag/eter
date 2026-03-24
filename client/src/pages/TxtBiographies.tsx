import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Music, Award, BookOpen, Heart, Maximize2, Sparkles, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function TxtBiographies() {
  const [, navigate] = useLocation();

  const members = [
    {
      id: "yeonjun",
      stageName: "Yeonjun",
      realName: "Choi Yeon-jun",
      position: "Rapero Principal, Bailarín Principal, Vocalista",
      birthday: "13 de septiembre de 1999",
      birthplace: "Seongbuk-gu, Seúl, Corea del Sur",
      mbti: "ENFP",
      image: "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/TXT-The-Name-Chapter-FREEFALL-3rd-Full-Album-Concept-Photos-documents-1_13.jpg?v=1733320183",
      color: "bg-red-500",
      fullBio: {
        preDebut: "Yeonjun fue aprendiz en Big Hit Entertainment durante 5 años. Es conocido como el 'Legendary Trainee' de Big Hit y fue el primer miembro en ser revelado.",
        soloCareer: "Ha participado en desfiles de moda para marcas como Concept Korea y ha sido modelo para la revista Dazed Korea. Es conocido por su estilo único y su influencia en la moda.",
        achievements: "Considerado el '4th Gen It Boy'. Ha sido MC especial en programas musicales y es muy popular en redes sociales.",
        curiosities: "Le encanta bailar y es muy bueno en eso. Es el miembro más antiguo del grupo y el 'mood maker'."
      }
    },
    {
      id: "soobin",
      stageName: "Soobin",
      realName: "Choi Soo-bin",
      position: "Líder, Vocalista, Rapero",
      birthday: "5 de diciembre de 2000",
      birthplace: "Ansan, Gyeonggi, Corea del Sur",
      mbti: "ISFJ",
      image: "https://www.nme.com/wp-content/uploads/2024/11/txt-soobin-hiatus-announcement-health-concerns-2024.jpg",
      color: "bg-blue-500",
      fullBio: {
        preDebut: "Soobin fue el segundo miembro en ser revelado. Es conocido por su personalidad tímida pero encantadora y su voz suave.",
        soloCareer: "Fue MC de Music Bank junto a Arin de Oh My Girl, ganando mucha popularidad por su química. Ha participado en OSTs de dramas.",
        achievements: "Líder de TXT, guiando al grupo a través de su rápido ascenso a la fama. Es reconocido por su estabilidad vocal y su presencia en el escenario.",
        curiosities: "Le encanta el pan y es conocido por ser un 'amante de la comida'. Tiene un erizo de mascota llamado Odi."
      }
    },
    {
      id: "beomgyu",
      stageName: "Beomgyu",
      realName: "Choi Beom-gyu",
      position: "Vocalista, Bailarín, Rapero, Centro, Visual",
      birthday: "13 de marzo de 2001",
      birthplace: "Daegu, Corea del Sur",
      mbti: "ENFJ",
      image: "https://www.papermag.com/media-library/image.jpg?id=27279240&width=2000&height=1500&coordinates=0%2C801%2C0%2C1879",
      color: "bg-green-500",
      fullBio: {
        preDebut: "Beomgyu fue el quinto y último miembro en ser revelado. Fue reclutado en Daegu y tuvo que viajar a Seúl para entrenar. Es conocido por su energía y su personalidad brillante.",
        soloCareer: "Ha participado en la producción de canciones de TXT, mostrando su talento como compositor. Es un gran guitarrista.",
        achievements: "Es el 'mood maker' del grupo y siempre trae alegría. Reconocido por su carisma en el escenario y su habilidad para interactuar con los fans.",
        curiosities: "Le encanta la fotografía y es muy bueno tomando fotos. Tiene un apodo de 'BAMgyu' por su energía."
      }
    },
    {
      id: "taehyun",
      stageName: "Taehyun",
      realName: "Kang Tae-hyun",
      position: "Vocalista",
      birthday: "5 de febrero de 2002",
      birthplace: "Gangnam-gu, Seúl, Corea del Sur",
      mbti: "ESTP",
      image: "https://legacy.kpopping.com/eb/3/250823-TXT-TAEHYUN-at-World-Tour-ACT-TOMORROW-in-SEOUL-D2-documents-1.jpeg",
      color: "bg-purple-500",
      fullBio: {
        preDebut: "Taehyun fue el cuarto miembro en ser revelado. Fue un modelo infantil y apareció en varios anuncios antes de unirse a Big Hit.",
        soloCareer: "Es conocido por su voz potente y estable, siendo uno de los vocalistas principales del grupo. Ha participado en la composición de letras.",
        achievements: "Reconocido por su madurez y su pensamiento lógico. Es el 'cerebro' del grupo y siempre ofrece consejos útiles.",
        curiosities: "Le encanta el boxeo y es muy bueno en los deportes. Es un gran fan de BTS y de la magia."
      }
    },
    {
      id: "hueningkai",
      stageName: "Huening Kai",
      realName: "Kai Kamal Huening",
      position: "Vocalista, Bailarín, Rapero, Maknae",
      birthday: "14 de agosto de 2002",
      birthplace: "Honolulu, Hawái, EE.UU.",
      mbti: "ENFP",
      image: "https://www.allkpop.com/upload/2024/11/content/020355/web_data/allkpop_1730535368_20241102-hueningkai.jpg",
      color: "bg-yellow-500",
      fullBio: {
        preDebut: "Huening Kai es el primer idol extranjero en debutar bajo Big Hit Entertainment. Es de ascendencia coreana, alemana y brasileña. Fue el tercer miembro en ser revelado.",
        soloCareer: "Ha participado en la composición de canciones para TXT. Es conocido por su habilidad para tocar varios instrumentos musicales como el piano y la guitarra.",
        achievements: "Es el 'maknae' (miembro más joven) del grupo y es muy querido por los fans. Reconocido por su talento musical y su personalidad alegre.",
        curiosities: "Tiene dos hermanas, una de las cuales es la idol Bahiyyih de Kep1er. Le encanta comer y es muy bueno en los juegos."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">TXT: Biografía Completa</h1>
          </div>
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none px-3 py-1">
            5 Estrellas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://4kwallpapers.com/images/wallpapers/tomorrow-x-together-3840x2160-23184.jpg"
          alt="TXT Group"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">TXT</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Tomorrow X Together, el grupo que te invita a soñar y a explorar un mundo de fantasía y crecimiento.
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
