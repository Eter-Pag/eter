import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Music, Award, BookOpen, Heart, Maximize2, Sparkles, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function BtsBiographies() {
  const [, navigate] = useLocation();
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setOpenMemberId(hash);
      } else {
        setOpenMemberId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleOpenChange = (open: boolean, id: string) => {
    if (open) {
      window.location.hash = id;
    } else {
      window.history.pushState(null, "", window.location.pathname);
      setOpenMemberId(null);
    }
  };

  const members = [
    {
      id: "rm",
      stageName: "RM",
      realName: "Kim Nam-joon",
      position: "Líder, Rapero Principal",
      birthday: "12 de Septiembre, 1994",
      birthplace: "Ilsan, Gyeonggi-do, Corea del Sur",
      mbti: "ENTP",
      image: "https://wallpapercat.com/w/full/8/0/1/1506738-2160x3840-samsung-4k-rm-bts-background-image.jpg",
      color: "bg-blue-600",
      fullBio: {
        preDebut: "RM comenzó como rapero underground bajo el nombre 'Runch Randa'. Fue parte del grupo Dae Nam Hyup y colaboró con Zico antes de unirse a Big Hit. Fue el primer miembro de BTS, reclutado por su impresionante habilidad lírica y un IQ de 148.",
        soloCareer: "Lanzó su primer mixtape 'RM' en 2015, seguido por el aclamado 'mono.' en 2018, que alcanzó el #1 en iTunes en 121 países. Su debut oficial como solista fue con 'Indigo' (2022), un álbum que explora su identidad como artista y humano. En 2024 lanzó 'Right Place, Wrong Person'.",
        achievements: "Es el artista coreano más joven con más créditos en la KOMCA (más de 200 canciones). Ha dado tres discursos ante la ONU y es un gran promotor del arte coreano, donando millones a museos y fundaciones.",
        curiosities: "Aprendió inglés viendo la serie 'Friends'. Es conocido por su torpeza física (apodado 'Dios de la Destrucción'), pero su mente es una de las más brillantes de la industria. Ama la naturaleza y el 'Namjooning' (pasear por museos y parques).",
        military: "Inició su servicio militar en diciembre de 2023 y se espera su regreso para junio de 2025."
      }
    },
    {
      id: "jin",
      stageName: "Jin",
      realName: "Kim Seok-jin",
      position: "Sub-Vocalista, Visual",
      birthday: "4 de Diciembre, 1992",
      birthplace: "Anyang, Gyeonggi-do, Corea del Sur",
      mbti: "INTP",
      image: "https://image.starnewskorea.com/21/2026/03/2026031407241350590_1.jpg",
      color: "bg-pink-500",
      fullBio: {
        preDebut: "Jin fue descubierto por un agente de Big Hit mientras bajaba de un autobús por su increíble apariencia. En ese momento estudiaba actuación en la Universidad Konkuk y no tenía experiencia previa en canto o baile, lo que hace su progreso aún más admirable.",
        soloCareer: "Sus solos en BTS como 'Awake', 'Epiphany' y 'Moon' son himnos de amor propio. Debutó oficialmente con 'The Astronaut' (2022), un regalo para ARMY co-escrito con Coldplay. En 2024 lanzó su álbum 'Happy', explorando sonidos rock y pop-punk.",
        achievements: "Conocido como 'Worldwide Handsome'. Ha sido elogiado por críticos vocales por su 'voz de plata' y su técnica estable. Es un exitoso empresario, dueño de un restaurante japonés junto a su hermano.",
        curiosities: "Es famoso por sus 'dad jokes' (chistes de papá) y sus besos voladores. Es un gamer apasionado (especialmente de MapleStory). Su risa de 'limpiavidrios' es icónica entre los fans.",
        military: "Fue el primer miembro en completar su servicio militar, regresando triunfalmente en junio de 2024."
      }
    },
    {
      id: "suga",
      stageName: "SUGA / Agust D",
      realName: "Min Yoon-gi",
      position: "Rapero Líder",
      birthday: "9 de Marzo, 1993",
      birthplace: "Buk-gu, Daegu, Corea del Sur",
      mbti: "ISTP",
      image: "https://e0.pxfuel.com/wallpapers/73/102/desktop-wallpaper-bts-suga-bts-suga-min.jpg",
      color: "bg-slate-800",
      fullBio: {
        preDebut: "Comenzó como rapero y productor underground en Daegu bajo el nombre 'Gloss'. Pasó por muchas dificultades económicas antes del debut, llegando a elegir entre comer o pagar el autobús. Se unió a Big Hit originalmente como productor.",
        soloCareer: "Bajo su alias Agust D, lanzó los mixtapes 'Agust D' (2016) y 'D-2' (2020). Su trilogía culminó con el álbum oficial 'D-DAY' (2023), seguido de una exitosa gira mundial en solitario, siendo el primer miembro de BTS en realizar un tour mundial solo.",
        achievements: "Productor de élite que ha trabajado con artistas como IU, PSY, Halsey y Epik High. Ganador de múltiples premios 'Hot Trend' por su producción. Es miembro pleno de la KOMCA.",
        curiosities: "Dice que en su próxima vida quiere ser una piedra para no tener que moverse. Es un experto en baloncesto. Sus letras son famosas por abordar crudamente la salud mental y las presiones sociales.",
        military: "Inició su servicio como agente de servicio social en septiembre de 2023 debido a una cirugía previa en el hombro."
      }
    },
    {
      id: "j-hope",
      stageName: "J-Hope",
      realName: "Jung Ho-seok",
      position: "Bailarín Principal, Rapero",
      birthday: "18 de Febrero, 1994",
      birthplace: "Gwangju, Corea del Sur",
      mbti: "INFJ",
      image: "https://bangtannow.com/wp-content/uploads/2025/02/Jung-Hoseok-575x1024.jpg",
      color: "bg-green-600",
      fullBio: {
        preDebut: "Era un bailarín callejero muy famoso en Gwangju con el grupo 'Neuron'. Ganó varios concursos nacionales de baile antes de unirse a Big Hit. Casi deja el grupo antes del debut, pero RM convenció a la empresa de que BTS necesitaba a J-Hope.",
        soloCareer: "Lanzó su mixtape 'Hope World' en 2018. Fue el primer miembro en debutar oficialmente con un álbum de estudio, 'Jack In The Box' (2022), mostrando un lado más oscuro y conceptual. En 2024 lanzó el proyecto documental y álbum 'HOPE ON THE STREET VOL.1'.",
        achievements: "Primer artista coreano en encabezar el festival Lollapalooza como acto principal. Es considerado uno de los mejores bailarines de la historia del K-Pop, dirigiendo personalmente los ensayos de BTS.",
        curiosities: "Su nombre artístico viene de su deseo de ser la esperanza de los fans. Es extremadamente ordenado y limpio. Tiene un miedo increíble a las montañas rusas y a los insectos.",
        military: "Completó su servicio militar en octubre de 2024, siendo el segundo miembro en regresar."
      }
    },
    {
      id: "jimin",
      stageName: "Jimin",
      realName: "Park Ji-min",
      position: "Bailarín Principal, Vocalista Líder",
      birthday: "13 de Octubre, 1995",
      birthplace: "Busan, Corea del Sur",
      mbti: "ESTP",
      image: "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/Bildschirmfoto_2025-06-02_um_12.49.36.png?v=1748861467",
      color: "bg-amber-500",
      fullBio: {
        preDebut: "Fue el estudiante estrella de danza contemporánea en la Escuela Secundaria de Artes de Busan. Fue el último miembro en unirse a BTS, entrenando solo por 6 meses antes del debut debido a su talento natural y ética de trabajo extrema.",
        soloCareer: "Sus canciones 'Lie', 'Serendipity' y 'Filter' rompieron récords en streaming. Debutó oficialmente con 'FACE' (2023), logrando que su single 'Like Crazy' fuera el primero de un solista coreano en llegar al #1 del Billboard Hot 100. En 2024 lanzó 'MUSE'.",
        achievements: "Ha sido #1 en el ranking de reputación de marca de idols masculinos por más de 35 meses consecutivos. Es conocido por su estilo de baile que mezcla hip-hop con danza moderna.",
        curiosities: "Es el miembro más bajo del grupo y a menudo bromean sobre el tamaño de sus manos. Es extremadamente cariñoso y siempre cuida de los demás miembros cuando están tristes.",
        military: "Inició su servicio militar en diciembre de 2023 junto a Jungkook."
      }
    },
    {
      id: "v",
      stageName: "V",
      realName: "Kim Tae-hyung",
      position: "Sub-Vocalista, Visual",
      birthday: "30 de Diciembre, 1995",
      birthplace: "Daegu, Corea del Sur",
      mbti: "INFP",
      image: "https://w0.peakpx.com/wallpaper/547/254/HD-wallpaper-v-bts-kim-taehyung.jpg",
      color: "bg-purple-600",
      fullBio: {
        preDebut: "Acompañó a un amigo a una audición solo por apoyo, pero los agentes le pidieron que audicionara también y fue el único que pasó ese día. Fue mantenido como el 'miembro secreto' de BTS hasta el último momento para generar misterio.",
        soloCareer: "Famoso por su voz barítona profunda. Lanzó temas como 'Scenery' y 'Winter Bear'. Su álbum debut 'Layover' (2023) fusiona jazz, R&B y soul, reflejando sus gustos personales. En 2024 lanzó el single digital 'FRI(END)S'.",
        achievements: "Ha ganado múltiples títulos como 'El rostro más hermoso del mundo'. Debutó como actor en el drama 'Hwarang'. Es un ícono de la moda global y embajador de Celine y Cartier.",
        curiosities: "Ama el jazz, la fotografía y el arte clásico (especialmente Van Gogh). Inventó la frase 'I Purple You' (Borahae), que se convirtió en el símbolo de la unión entre BTS y ARMY.",
        military: "Se unió a las fuerzas especiales de la Policía Militar en diciembre de 2023."
      }
    },
    {
      id: "jungkook",
      stageName: "Jungkook",
      realName: "Jeon Jung-kook",
      position: "Vocalista Principal, Centro, Maknae",
      birthday: "1 de Septiembre, 1997",
      birthplace: "Busan, Corea del Sur",
      mbti: "ISFP",
      image: "https://w0.peakpx.com/wallpaper/125/717/HD-wallpaper-jungkook-bts-jungkook-jk-gl.jpg",
      color: "bg-red-600",
      fullBio: {
        preDebut: "Participó en el programa 'Superstar K' y, aunque no ganó, recibió ofertas de 7 agencias diferentes. Eligió Big Hit después de ver a RM rapear, pensando que era 'genial'. Fue enviado a Los Ángeles antes del debut para perfeccionar su baile.",
        soloCareer: "El 'Golden Maknae' rompió internet con 'Seven' (2023), que debutó en el #1 de Billboard. Su álbum 'GOLDEN' consolidó su estatus como estrella pop global, colaborando con artistas como Jack Harlow, Latto y Usher.",
        achievements: "Primer artista coreano en actuar en la ceremonia de apertura de una Copa del Mundo (Qatar 2022). Posee múltiples récords Guinness por su éxito masivo en Spotify y Billboard.",
        curiosities: "Es cinturón negro en Taekwondo. Le encanta dibujar, editar videos (G.C.F) y los deportes. Es conocido por ser extremadamente competitivo y por aprender cualquier habilidad casi instantáneamente.",
        military: "Inició su servicio militar en diciembre de 2023 junto a Jimin."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">BTS: Biografía Completa</h1>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-none px-3 py-1">
            7 Leyendas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://www.billboard.com/wp-content/uploads/2026/03/bts-netflix-trailer-2026-billboard-1800.jpg?w=1024"
          alt="BTS Group"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl uppercase">BTS</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Los íconos globales que redefinieron la música y el amor propio, conectando a millones de personas en todo el mundo.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Dialog 
              key={member.id} 
              open={openMemberId === member.id} 
              onOpenChange={(open) => handleOpenChange(open, member.id)}
            >
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
