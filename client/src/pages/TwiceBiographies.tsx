import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Music, Award, BookOpen, Heart, Maximize2, Sparkles, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function TwiceBiographies() {
  const [, navigate] = useLocation();

  const members = [
    {
      id: "nayeon",
      stageName: "Nayeon",
      realName: "Im Na-yeon",
      position: "Vocalista Líder, Bailarina Líder, Centro",
      birthday: "22 de septiembre de 1995",
      birthplace: "Seúl, Corea del Sur",
      mbti: "ISTP",
      image: "https://i.pinimg.com/736x/8a/8d/6d/8a8d6d8a8d6d8a8d6d8a8d6d8a8d6d8a.jpg",
      color: "bg-sky-300",
      fullBio: {
        preDebut: "Nayeon audicionó secretamente para JYP en 2010 y fue aceptada. Fue la primera integrante de TWICE en ser anunciada. Antes de su debut, apareció en varios anuncios y en el drama 'Dream High 2'.",
        soloCareer: "Fue la primera integrante de TWICE en debutar como solista con el mini álbum 'IM NAYEON' en 2022, que incluyó el éxito viral 'POP!'. En 2024 lanzó su segundo mini álbum 'NA'.",
        achievements: "Es conocida como la 'Nation's Center' de Corea. Su debut solista rompió récords en Billboard 200 para una solista de K-pop en su momento.",
        curiosities: "Le encanta la comida dulce. Es conocida por su 'sonrisa de conejo'. Es muy cercana a Jisoo y Jennie de BLACKPINK."
      }
    },
    {
      id: "jeongyeon",
      stageName: "Jeongyeon",
      realName: "Yoo Jeong-yeon",
      position: "Vocalista Líder",
      birthday: "1 de noviembre de 1996",
      birthplace: "Suwon, Corea del Sur",
      mbti: "ISFJ",
      image: "https://i.pinimg.com/736x/7b/7b/7b/7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b7b.jpg",
      color: "bg-yellow-200",
      fullBio: {
        preDebut: "Jeongyeon se unió a JYP el mismo día que Nayeon. Su hermana mayor es la famosa actriz Gong Seung-yeon. Es conocida por su voz estable y su carisma.",
        soloCareer: "Ha participado en la escritura de letras para varias canciones de TWICE. En 2024, ha estado muy activa en programas de variedades y sesiones de fotos de moda.",
        achievements: "Reconocida por su valentía al hablar sobre la salud mental, inspirando a miles de fans en todo el mundo.",
        curiosities: "Le encanta limpiar y organizar. Sabe tocar el saxofón. Es una gran amante de los animales y hace mucho voluntariado en refugios."
      }
    },
    {
      id: "momo",
      stageName: "Momo",
      realName: "Hirai Momo",
      position: "Bailarina Principal, Sub-Vocalista, Sub-Rapera",
      birthday: "9 de noviembre de 1996",
      birthplace: "Kyotanabe, Kioto, Japón",
      mbti: "INFP",
      image: "https://i.pinimg.com/736x/9c/9c/9c/9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c9c.jpg",
      color: "bg-pink-300",
      fullBio: {
        preDebut: "Momo fue descubierta por JYP a través de un video de baile en YouTube. Fue eliminada en el programa 'SIXTEEN' pero J.Y. Park la trajo de vuelta en el episodio final por su increíble habilidad de baile.",
        soloCareer: "Es la embajadora global de marcas como Miu Miu y Onitsuka Tiger. En 2023 debutó en la sub-unidad MISAMO en Japón.",
        achievements: "Considerada una de las mejores bailarinas de la historia del K-pop. Sus videos de baile tienen millones de vistas.",
        curiosities: "Le encanta comer, especialmente el jokbal (patas de cerdo). Su nombre significa 'melocotón' en japonés."
      }
    },
    {
      id: "sana",
      stageName: "Sana",
      realName: "Minatozaki Sana",
      position: "Sub-Vocalista",
      birthday: "29 de diciembre de 1996",
      birthplace: "Tennoji-ku, Osaka, Japón",
      mbti: "ENFP",
      image: "https://i.pinimg.com/736x/4d/4d/4d/4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d.jpg",
      color: "bg-purple-300",
      fullBio: {
        preDebut: "Sana fue reclutada mientras estaba de compras con sus amigas en Japón. Se mudó a Corea en 2012. Se hizo viral antes del debut por su personalidad brillante en 'SIXTEEN'.",
        soloCareer: "Embajadora global de Prada y Graff. Debutó en la sub-unidad MISAMO en 2023. Es una de las idols extranjeras más queridas en Corea.",
        achievements: "Su frase 'Shy Shy Shy' en la canción 'Cheer Up' se convirtió en uno de los memes más grandes de la historia del K-pop.",
        curiosities: "Es conocida por ser muy cariñosa y torpe. Le encanta el perfume y colecciona muchos."
      }
    },
    {
      id: "jihyo",
      stageName: "Jihyo",
      realName: "Park Ji-hyo",
      position: "Líder, Vocalista Principal",
      birthday: "1 de febrero de 1997",
      birthplace: "Guri, Gyeonggi-do, Corea del Sur",
      mbti: "ESFP",
      image: "https://i.pinimg.com/736x/5e/5e/5e/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e.jpg",
      color: "bg-orange-300",
      fullBio: {
        preDebut: "Jihyo fue aprendiz en JYP durante 10 años, entrenando con miembros de Wonder Girls y 2PM. Su dedicación y liderazgo son legendarios.",
        soloCareer: "Debutó como solista en 2023 con el mini álbum 'ZONE' y el tema principal 'Killin' Me Good'. Es conocida por su potente voz y presencia escénica.",
        achievements: "Líder de TWICE durante casi una década, guiando al grupo a ser uno de los más exitosos de todos los tiempos.",
        curiosities: "Le encanta el surf y el gimnasio. Es conocida por sus ojos grandes y expresivos. Su nombre real era Park Ji-soo."
      }
    },
    {
      id: "mina",
      stageName: "Mina",
      realName: "Myoui Mina",
      position: "Bailarina Principal, Sub-Vocalista",
      birthday: "24 de marzo de 1997",
      birthplace: "San Antonio, Texas, EE.UU. (Criada en Kobe, Japón)",
      mbti: "ISFP",
      image: "https://i.pinimg.com/736x/6f/6f/6f/6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f.jpg",
      color: "bg-teal-200",
      fullBio: {
        preDebut: "Mina estudió ballet durante 11 años antes de unirse a JYP. Fue reclutada mientras compraba con su madre. Tuvo el periodo de entrenamiento más corto entre las miembros coreanas/japonesas.",
        soloCareer: "Embajadora global de SK-II y Fendi. Debutó en la sub-unidad MISAMO en 2023. Es conocida por su elegancia y aura 'royal'.",
        achievements: "Reconocida por su técnica de baile elegante y su voz suave. Es un icono de la moda y la sofisticación.",
        curiosities: "Le encantan los videojuegos y armar Legos. Es conocida como la 'Black Swan' de TWICE."
      }
    },
    {
      id: "dahyun",
      stageName: "Dahyun",
      realName: "Kim Da-hyun",
      position: "Rapera Líder, Sub-Vocalista",
      birthday: "28 de mayo de 1998",
      birthplace: "Seongnam, Gyeonggi-do, Corea del Sur",
      mbti: "ISFJ",
      image: "https://i.pinimg.com/736x/2a/2a/2a/2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a.jpg",
      color: "bg-white",
      fullBio: {
        preDebut: "Dahyun se hizo viral antes del debut por su 'baile del águila' en la iglesia. Es conocida por su piel extremadamente blanca y su personalidad divertida.",
        soloCareer: "En 2024, debutó como actriz en la película 'You Are the Apple of My Eye'. Es embajadora global de Michael Kors.",
        achievements: "Es la 'reina de los programas de variedades' por su ingenio y capacidad para encontrar cámaras en cualquier lugar.",
        curiosities: "Sabe tocar el piano muy bien. Le encanta el chocolate. Su apodo es 'Dubu' (Tofu) por su piel blanca y suave."
      }
    },
    {
      id: "chaeyoung",
      stageName: "Chaeyoung",
      realName: "Son Chae-young",
      position: "Rapera Principal, Sub-Vocalista",
      birthday: "23 de abril de 1999",
      birthplace: "Seúl, Corea del Sur",
      mbti: "INFP",
      image: "https://i.pinimg.com/736x/3c/3c/3c/3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c.jpg",
      color: "bg-red-400",
      fullBio: {
        preDebut: "Chaeyoung se unió a JYP en 2012. Es una artista completa que ama dibujar y escribir poesía. Es conocida por su estilo único y artístico.",
        soloCareer: "Embajadora de Etro. Ha diseñado portadas de álbumes y mercancía para TWICE. Es conocida por sus tatuajes y su estilo vanguardista.",
        achievements: "Una de las raperas más creativas del K-pop, participando activamente en la composición de sus versos.",
        curiosities: "Le encanta el dibujo y la pintura. Es la miembro más baja junto a Dahyun. Le gusta mucho la música indie."
      }
    },
    {
      id: "tzuyu",
      stageName: "Tzuyu",
      realName: "Chou Tzu-yu",
      position: "Bailarina Líder, Sub-Vocalista, Visual, Maknae",
      birthday: "14 de junio de 1999",
      birthplace: "Tainan, Taiwán",
      mbti: "ISFP",
      image: "https://i.pinimg.com/736x/1f/1f/1f/1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f.jpg",
      color: "bg-blue-300",
      fullBio: {
        preDebut: "Tzuyu fue descubierta por cazatalentos en Taiwán y se mudó a Corea en 2012. Fue añadida a TWICE en el último momento por votación del público en 'SIXTEEN'.",
        soloCareer: "Debutó como solista en septiembre de 2024 con el mini álbum 'abouTZU'. Es embajadora de marcas como Pond's y Parly.",
        achievements: "Nombrada 'El rostro más hermoso del mundo' en 2019. Es un icono visual global y muy querida por su personalidad humilde.",
        curiosities: "Le encantan los perros. Es conocida por su postura perfecta y su altura. Es la 'maknae' (menor) del grupo."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">TWICE: Biografía Completa</h1>
          </div>
          <Badge className="bg-pink-500 hover:bg-pink-600 text-white border-none px-3 py-1">
            9 Estrellas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://www.nme.com/wp-content/uploads/2025/07/twice-this-is-for-interview-credit-jyp-entertainment-image1.jpeg"
          alt="TWICE Group"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl uppercase">TWICE</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Nueve artistas que han conquistado el mundo con su energía, talento y la promesa de hacerte sentir especial.
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
                                <Music className="size-4 text-pink-500" /> Pre-Debut
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
                                <Heart className="size-4 text-red-500" /> Curiosidades
                              </h4>
                              <p className="text-slate-600 leading-relaxed">{member.fullBio.curiosities}</p>
                            </div>
                            <div className="flex items-center justify-center gap-4 pt-4">
                              <Sparkles className="size-6 text-pink-500" />
                              <div className="h-px w-12 bg-slate-100" />
                              <Heart className="size-6 text-red-500 fill-current" />
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
