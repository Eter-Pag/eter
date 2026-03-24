import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, ChevronDown, Music, Award, BookOpen, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";

export default function BlackpinkBiographies() {
  const [, navigate] = useLocation();
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const bioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expandedMemberId && bioContainerRef.current) {
      setTimeout(() => {
        bioContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [expandedMemberId]);

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
      image: "https://static.wikia.nocookie.net/blackpink-pobre/images/2/28/Jennie1.jpg/revision/latest?cb=20190622202439&path-prefix=es",
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

  const toggleMember = (memberId: string) => {
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId);
  };

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
          className="w-full h-full object-cover"
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
        <div className="space-y-6">
          {/* Grid de Miembros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {members.map((member) => (
              <Card
                key={member.id}
                className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                onClick={() => toggleMember(member.id)}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.stageName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 opacity-20 ${member.color}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{member.position}</p>
                    <h4 className="text-xl font-black">{member.stageName}</h4>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronDown className={`size-5 text-slate-900 transition-transform ${expandedMemberId === member.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Expanded Biography Section */}
          {expandedMemberId && (
            <div ref={bioContainerRef} className="animate-in fade-in slide-in-from-top-4 duration-500">
              <Card className="border-none shadow-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                  {members
                    .filter((m) => m.id === expandedMemberId)
                    .map((member) => (
                      <div key={member.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
                        {/* Left: Image and Basic Info */}
                        <div className="lg:col-span-1">
                          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] mb-6">
                            <img
                              src={member.image}
                              alt={member.stageName}
                              className="w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 opacity-30 ${member.color}`} />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                              <h3 className="text-3xl font-black mb-1">{member.stageName}</h3>
                              <p className="text-pink-300 font-bold tracking-widest uppercase text-xs">{member.position}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Calendar className="size-4 text-pink-600 shrink-0" />
                              <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Nacimiento</p>
                                <p className="text-xs font-bold text-slate-700">{member.birthday}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <MapPin className="size-4 text-blue-600 shrink-0" />
                              <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Origen</p>
                                <p className="text-xs font-bold text-slate-700">{member.birthplace}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Star className="size-4 text-amber-600 shrink-0" />
                              <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">MBTI</p>
                                <p className="text-xs font-bold text-slate-700">{member.mbti}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Tabs */}
                        <div className="lg:col-span-2">
                          <Tabs defaultValue="bio" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 rounded-xl mb-6">
                              <TabsTrigger value="bio" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <BookOpen className="size-3 md:size-4 mr-1" /> Bio
                              </TabsTrigger>
                              <TabsTrigger value="solo" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Music className="size-3 md:size-4 mr-1" /> Solo
                              </TabsTrigger>
                              <TabsTrigger value="achievements" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Award className="size-3 md:size-4 mr-1" /> Logros
                              </TabsTrigger>
                              <TabsTrigger value="extra" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <Heart className="size-3 md:size-4 mr-1" /> Extra
                              </TabsTrigger>
                            </TabsList>

                            <div className="space-y-6 min-h-[350px]">
                              <TabsContent value="bio" className="mt-0 space-y-4 animate-in fade-in duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="h-6 w-1 bg-pink-600 rounded-full" />
                                  <h4 className="text-lg font-bold text-slate-900">Trayectoria y Origen</h4>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                  {member.fullBio.preDebut}
                                </p>
                              </TabsContent>

                              <TabsContent value="solo" className="mt-0 space-y-4 animate-in fade-in duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="h-6 w-1 bg-blue-600 rounded-full" />
                                  <h4 className="text-lg font-bold text-slate-900">Carrera Solista</h4>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                  {member.fullBio.soloCareer}
                                </p>
                              </TabsContent>

                              <TabsContent value="achievements" className="mt-0 space-y-4 animate-in fade-in duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="h-6 w-1 bg-amber-500 rounded-full" />
                                  <h4 className="text-lg font-bold text-slate-900">Logros e Impacto</h4>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                  {member.fullBio.achievements}
                                </p>
                              </TabsContent>

                              <TabsContent value="extra" className="mt-0 space-y-4 animate-in fade-in duration-500">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="h-6 w-1 bg-pink-500 rounded-full" />
                                  <h4 className="text-lg font-bold text-slate-900">Curiosidades</h4>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                  {member.fullBio.curiosities}
                                </p>
                              </TabsContent>
                            </div>
                          </Tabs>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Final Group Section */}
        <section className="mt-16 bg-gradient-to-br from-pink-900 to-slate-900 rounded-3xl p-10 md:p-16 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">BLACKPINK: In Your Area</h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Desde su debut en 2016, BLACKPINK ha roto barreras y establecido nuevos estándares para los grupos femeninos a nivel mundial. Con su concepto "Black" y "Pink", combinan la fuerza y el talento con la elegancia y el carisma.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#BLACKPINK</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#BLINK</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#THE_ALBUM</Badge>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="container px-4">
          <p className="font-bold text-slate-900 mb-2">ETER K-POP MX</p>
          <p className="text-slate-400 text-sm">© 2026 - Biografías Oficiales de BLACKPINK. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
