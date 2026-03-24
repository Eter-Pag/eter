import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Music, Award, BookOpen, Heart, Maximize2, Sparkles, Globe } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function BlackpinkBiographies() {
  const [, navigate] = useLocation();

  const members = [
    {
      id: "jisoo",
      stageName: "Jisoo",
      realName: "Kim Ji-soo",
      position: "Vocalista Líder, Visual",
      birthday: "3 de enero de 1995",
      birthplace: "Gunpo, Corea del Sur",
      mbti: "ISTP",
      image: "https://media.vogue.mx/photos/67619978e08ea9c0d0a14146/2:3/w_2560%2Cc_limit/jisoo-blackpink.jpg",
      color: "bg-pink-600",
      fullBio: {
        preDebut: "En 2011, Kim Ji-soo se unió a YG Entertainment como aprendiz a los 16 años, entrenando durante cinco años. En 2012, fue presentada a través del teaser 'Who’s That Girl?'. Antes de su debut, hizo un cameo en el drama 'The Producers' (2015) y apareció en numerosos anuncios para marcas como Samsonite, LG Electronics y Nikon, consolidándose como una de las aprendices más reconocidas de la agencia.",
        soloCareer: "El 31 de marzo de 2023, Jisoo debutó como solista con su álbum sencillo 'ME', cuyo tema principal 'Flower' fue un éxito global. En 2025, lanzó su primer mini álbum 'AMORTAGE'. Como actriz, protagonizó 'Snowdrop' (2021-22) y participó en la serie 'Newtopia' (2025). En 2024, fundó su propia agencia, BLISSOO, para gestionar sus actividades individuales.",
        achievements: "Ha ganado múltiples premios de actuación, incluyendo Mejor Actriz Coreana en los Seoul International Drama Awards. En 2026, hizo historia al recibir el 'Madame Figaro Rising Star Award' en el Cannes International Series Festival. Musicalmente, 'Flower' le otorgó el premio a Mejor Artista Femenina en los MAMA 2023 y un Bonsang en los Golden Disc Awards.",
        curiosities: "Es la actriz coreana más seguida en Instagram. Ha sido nombrada la 'Mujer Más Hermosa del Mundo' por la revista Nubia durante tres años consecutivos (2022-2024). Tiene un perro llamado Dalgom y es conocida por su personalidad '4D' y su amor por Pikachu. Es embajadora global de Dior y Cartier."
      }
    },
    {
      id: "jennie",
      stageName: "Jennie",
      realName: "Kim Jennie",
      position: "Rapera Principal, Vocalista",
      birthday: "16 de enero de 1996",
      birthplace: "Seúl, Corea del Sur",
      mbti: "INFJ",
      image: "https://i.pinimg.com/736x/bc/4b/91/bc4b9126c2ddf932415450dbf62b62de.jpg",
      color: "bg-slate-900",
      fullBio: {
        preDebut: "Nacida en Seúl, Jennie vivió y estudió en Auckland, Nueva Zelanda, durante cinco años antes de regresar a Corea en 2010. Se unió a YG Entertainment ese mismo año y entrenó durante casi seis años. Fue la primera integrante de BLACKPINK en ser revelada y colaboró pre-debut con artistas como G-Dragon en 'Black' y Lee Hi en 'Special'.",
        soloCareer: "Fue la primera integrante en debutar como solista con el sencillo 'SOLO' en 2018, que rompió récords en YouTube y listas coreanas. En 2023, lanzó 'You & Me' y debutó como actriz en la serie de HBO 'The Idol' bajo el nombre Jennie Ruby Jane. En noviembre de 2023, fundó su propia agencia, ODD ATELIER (OA).",
        achievements: "Es conocida como la 'Human Chanel' por su largo vínculo con la marca. Ha encabezado las listas de reputación de marca de idols femeninas en numerosas ocasiones. Fue la primera solista femenina de K-pop en alcanzar los mil millones de vistas con un video musical ('SOLO').",
        curiosities: "Habla fluido coreano, inglés y japonés. Tiene dos perros llamados Kai y Kuma. Es una apasionada de la fotografía y tiene una cuenta secundaria en Instagram (@lesyeuxdenini) dedicada a sus fotos. Es embajadora global de Chanel, Calvin Klein y Gentle Monster."
      }
    },
    {
      id: "rose",
      stageName: "Rosé",
      realName: "Roseanne Park",
      position: "Vocalista Principal, Bailarina Líder",
      birthday: "11 de febrero de 1997",
      birthplace: "Auckland, Nueva Zelanda",
      mbti: "ENFP",
      image: "https://media.vogue.mx/photos/636926bf74730ec3e4402100/master/pass/rose%CC%81-blackpink-vestido-negro-lacma-.jpg",
      color: "bg-rose-400",
      fullBio: {
        preDebut: "Nacida en Nueva Zelanda y criada en Melbourne, Australia, Rosé audicionó para YG en 2012 tras quedar en primer lugar entre 700 participantes. Se mudó a Corea sola a los 15 años para comenzar su entrenamiento. Fue la última integrante en ser revelada y colaboró pre-debut en la canción 'Without You' de G-Dragon.",
        soloCareer: "Debutó como solista en marzo de 2021 con el álbum sencillo '-R-', que incluye los éxitos 'On The Ground' y 'Gone'. En 2024, firmó con THEBLACKLABEL para sus actividades individuales y lanzó el éxito global 'APT.' junto a Bruno Mars, que dominó las listas mundiales.",
        achievements: "Posee dos récords Guinness mundiales: por ser la primera artista en alcanzar el número uno en una lista global de Billboard como solista y como parte de un grupo, y por el video musical de K-pop más visto en 24 horas por un solista. Es embajadora global de Saint Laurent y Tiffany & Co.",
        curiosities: "Es zurda y toca la guitarra y el piano con maestría. Tiene un perro adoptado llamado Hank que tiene su propia cuenta de Instagram. Es conocida por su tono de voz único y 'mieloso'. Le encanta el estofado de kimchi y dibujar en su tiempo libre."
      }
    },
    {
      id: "lisa",
      stageName: "Lisa",
      realName: "Lalisa Manobal",
      position: "Bailarina Principal, Rapera Líder",
      birthday: "27 de marzo de 1997",
      birthplace: "Buriram, Tailandia",
      mbti: "ESFJ",
      image: "https://images-prod.anothermag.com/1050/azure/another-prod/460/3/463138.jpg",
      color: "bg-yellow-500",
      fullBio: {
        preDebut: "Lisa fue la única persona aceptada en las audiciones de YG en Tailandia en 2010. Se mudó a Corea en 2011 sin hablar el idioma, convirtiéndose en la primera artista no coreana de la agencia. Antes de BLACKPINK, fue parte del grupo de baile 'We Zaa Cool' junto a BamBam de GOT7.",
        soloCareer: "Debutó como solista en septiembre de 2021 con 'LALISA', seguido del éxito viral 'MONEY'. En 2024, fundó su propia agencia, LLOUD, y lanzó sencillos como 'ROCKSTAR', 'NEW WOMAN' (con Rosalía) y 'Moonlit Floor'. También debutó como actriz en la tercera temporada de 'The White Lotus'.",
        achievements: "Es la idol de K-pop más seguida en Instagram (más de 100 millones). Ha ganado múltiples premios MTV Video Music Awards y MTV Europe Music Awards como Mejor K-Pop. En 2023, fue incluida en el Salón de la Fama de los Récords Guinness por sus masivos logros en streaming.",
        curiosities: "Habla tailandés, coreano, inglés y japonés. Tiene cinco gatos (Leo, Luca, Lily, Louis, Lego) y un perro (Love), conocidos como la 'L Family'. Es embajadora global de Celine, Bulgari y Louis Vuitton. Es considerada una de las mejores bailarinas de su generación."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">BLACKPINK: Biografía Completa</h1>
          </div>
          <Badge className="bg-pink-600 hover:bg-pink-700 text-white border-none px-3 py-1">
            4 Reinas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://4kwallpapers.com/images/wallpapers/blackpink-lisa-jisoo-jennie-rose-k-pop-singers-korean-2560x1440-8881.jpg"
          alt="BLACKPINK Group"
          className="w-full h-full object-cover object-top md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">BLACKPINK</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            El grupo femenino más grande del mundo que ha redefinido el poder y el estilo en la música global.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{member.position}</p>
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
