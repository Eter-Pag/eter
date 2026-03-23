import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, ChevronDown, Music, Award, BookOpen, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";

export default function StrayKidsBiographies() {
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
      id: "bangchan",
      stageName: "Bang Chan",
      realName: "Christopher Bang",
      position: "Líder, Productor, Vocalista, Rapero",
      birthday: "3 de octubre de 1997",
      birthplace: "Seúl, Corea del Sur (Criado en Sídney, Australia)",
      mbti: "ENFJ",
      image: "https://www.musicmundial.com/wp-content/uploads/2025/01/Bang-Chan-de-Stray-Kids-tuvo-que-cancelar-sus-actividades-debido-a-problemas-de-salud.jpg",
      color: "bg-slate-800",
      fullBio: {
        preDebut: "Bang Chan se unió a JYP Entertainment en 2010 tras una audición en Australia y entrenó durante siete años. Durante este tiempo, formó el trío de hip-hop 3RACHA junto a Changbin y Han. Fue el encargado de seleccionar personalmente a los integrantes de Stray Kids, lo que demuestra su papel fundamental en la creación del grupo.",
        soloCareer: "Como líder de 3RACHA (CB97), ha producido casi toda la discografía de Stray Kids. Aunque no tiene un álbum solista formal, su trabajo como productor es reconocido en toda la industria. Ha colaborado en pistas especiales y es uno de los idols con más créditos en la KOMCA.",
        achievements: "Ha liderado a Stray Kids a alcanzar múltiples números 1 en el Billboard 200. Es respetado por su ética de trabajo y su capacidad para cuidar de sus miembros. Ha roto récords de streaming con canciones autoproducidas como 'God's Menu' y 'S-Class'.",
        curiosities: "Habla fluido inglés, coreano, japonés y un poco de chino. Tiene un perro llamado Berry. Es conocido por sus transmisiones en vivo 'Chan's Room' donde conectaba profundamente con los fans. Puede rotar su mano 360 grados."
      }
    },
    {
      id: "leeknow",
      stageName: "Lee Know",
      realName: "Lee Min-ho",
      position: "Bailarín Principal, Vocalista",
      birthday: "25 de octubre de 1998",
      birthplace: "Gimpo, Corea del Sur",
      mbti: "ISFP",
      image: "https://i.pinimg.com/originals/51/7d/a4/517da4f787fa3e7565be22f98274a69a.jpg",
      color: "bg-orange-600",
      fullBio: {
        preDebut: "Antes de unirse a JYP, Lee Know fue bailarín de respaldo para BTS durante su gira 'Wings', lo que le dio una valiosa experiencia en escenarios masivos. Entrenó solo por un año antes de debutar, siendo uno de los periodos más cortos en el grupo debido a su increíble talento natural para el baile.",
        soloCareer: "Es el líder de la unidad de baile 'Dance Racha'. Ha participado en coreografías del grupo y ha tenido presentaciones especiales de baile en solitario en conciertos. En 2025, fue nombrado embajador global de Gucci.",
        achievements: "Reconocido como uno de los mejores bailarines de la cuarta generación del K-pop. Ha sido MC de programas musicales como 'Music Core'. Su técnica de baile es elogiada por su precisión y fuerza.",
        curiosities: "Tiene tres gatos: Sooni, Doongi y Dori. Es ambidiestro y tiene una personalidad única a menudo descrita como '4D'. Tiene miedo a las alturas pero es un experto en artes marciales."
      }
    },
    {
      id: "changbin",
      stageName: "Changbin",
      realName: "Seo Chang-bin",
      position: "Rapero Principal, Productor",
      birthday: "11 de agosto de 1999",
      birthplace: "Yongin, Corea del Sur",
      mbti: "ESTP",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Changbin_of_Stray_Kids_at_the_40th_Golden_Disc_Awards%2C_January_10%2C_2026_%281%29.png",
      color: "bg-slate-900",
      fullBio: {
        preDebut: "Changbin comenzó su camino en el rap desde joven y se unió a JYP tras impresionar con su poderosa voz y lírica. Es miembro fundador de 3RACHA (SPEARB), donde desarrolló sus habilidades de composición y producción antes del debut oficial del grupo.",
        soloCareer: "Ha lanzado numerosas pistas en solitario a través de 'SKZ-RECORD' y 'SKZ-PLAYER'. Es un productor prolífico que ha trabajado en éxitos como 'Thunderous'. En 2023, colaboró con Samsung para la campaña 'Fly High'.",
        achievements: "Es considerado uno de los raperos más rápidos y técnicos del K-pop actual. Posee más de 100 canciones registradas a su nombre en la KOMCA. Su estilo de rap 'oscuro' y potente es la firma sonora de Stray Kids.",
        curiosities: "Le encanta coleccionar peluches, especialmente su Munchlax llamado Gyu. Es conocido por su físico atlético y su amor por el gimnasio. A pesar de su imagen ruda en el escenario, es uno de los miembros más divertidos y cariñosos."
      }
    },
    {
      id: "hyunjin",
      stageName: "Hyunjin",
      realName: "Hwang Hyun-jin",
      position: "Bailarín Principal, Rapero, Visual",
      birthday: "20 de marzo de 2000",
      birthplace: "Seúl, Corea del Sur",
      mbti: "INFP",
      image: "https://i.pinimg.com/736x/3b/b7/da/3bb7da4dd47a062e9488bd25e02142f5.jpg",
      color: "bg-slate-700",
      fullBio: {
        preDebut: "Hyunjin fue reclutado por JYP mientras estaba de compras con su madre. Aunque inicialmente fue elogiado solo por su visual, trabajó incansablemente para convertirse en uno de los mejores bailarines de la agencia, ganándose el respeto de sus compañeros y entrenadores.",
        soloCareer: "Ha lanzado coreografías originales y canciones como 'Red Lights' (con Bang Chan). En 2023, se convirtió en el primer embajador global coreano de la casa de moda de lujo Versace. Es un apasionado de la pintura y el arte.",
        achievements: "Sus 'fancams' de baile son de las más vistas en la industria. Ha sido elogiado por Donatella Versace por su carisma y estilo. Es una figura clave en la moda y el arte dentro del K-pop.",
        curiosities: "Tiene un perro llamado Kkami. Vivió brevemente en Las Vegas cuando era niño y usaba el nombre Sam. Es conocido por su expresividad dramática en el escenario y su amor por la lectura y el dibujo."
      }
    },
    {
      id: "han",
      stageName: "Han",
      realName: "Han Ji-sung",
      position: "Rapero Principal, Vocalista Líder, Productor",
      birthday: "14 de septiembre de 2000",
      birthplace: "Incheon, Corea del Sur (Criado en Malasia)",
      mbti: "ISTP",
      image: "https://i.pinimg.com/736x/5c/17/21/5c1721f0ce4dfabf68c7b7dc4cbb2e15.jpg",
      color: "bg-blue-900",
      fullBio: {
        preDebut: "Han vivió y estudió en Malasia antes de regresar a Corea para perseguir su sueño musical. Se unió a JYP y rápidamente se convirtió en parte de 3RACHA (J.ONE). Es conocido como un 'ace' (as) por su capacidad de destacar en rap, canto y baile simultáneamente.",
        soloCareer: "Ha compuesto y producido numerosas canciones sentimentales para el grupo como 'Sunshine' y 'Winter Falls'. Sus lanzamientos individuales en SKZ-RECORD muestran su versatilidad como vocalista de rock y pop.",
        achievements: "Es uno de los productores más jóvenes con más créditos en la KOMCA. Su habilidad para el rap de estilo libre es legendaria. Ha sido fundamental en definir el sonido lírico y melódico de Stray Kids.",
        curiosities: "Le encanta el cheesecake y ver películas mientras come. Tiene tripofobia (miedo a los patrones de agujeros pequeños). Es apodado 'Ardilla' por sus mejillas y su forma de comer. Habla fluido inglés."
      }
    },
    {
      id: "felix",
      stageName: "Felix",
      realName: "Felix Lee / Lee Yong-bok",
      position: "Bailarín Principal, Rapero Líder",
      birthday: "15 de septiembre de 2000",
      birthplace: "Sídney, Australia",
      mbti: "ESFJ",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/20230930_Felix.jpg/1280px-20230930_Felix.jpg",
      color: "bg-indigo-500",
      fullBio: {
        preDebut: "Nacido y criado en Australia, Felix se mudó a Corea en 2017 tras ser reclutado por JYP. A pesar de las dificultades iniciales con el idioma coreano, su voz profunda y su carisma lo hicieron destacar. Fue eliminado brevemente durante el programa 'Stray Kids' pero regresó por demanda popular y talento.",
        soloCareer: "Es un ícono de la moda global, siendo embajador de la casa Louis Vuitton. Ha participado en numerosos desfiles de moda en París y es conocido por su estilo andrógino y vanguardista.",
        achievements: "Su voz ultra-grave en canciones como 'God's Menu' se volvió viral mundialmente. Es conocido por su labor filantrópica, siendo el miembro más joven del Club de Honores de UNICEF tras donar grandes sumas para ayudar a niños.",
        curiosities: "Es cinturón negro en Taekwondo y ha ganado muchas medallas. Le encanta hornear brownies para los miembros y el personal. Sus pecas naturales son una de sus características más queridas por los fans."
      }
    },
    {
      id: "seungmin",
      stageName: "Seungmin",
      realName: "Kim Seung-min",
      position: "Vocalista Principal",
      birthday: "22 de septiembre de 2000",
      birthplace: "Seúl, Corea del Sur",
      mbti: "ISFJ",
      image: "https://e0.pxfuel.com/wallpapers/790/26/desktop-wallpaper-seungmin-stray-kids-seungmin-kim-seungmin.jpg",
      color: "bg-blue-400",
      fullBio: {
        preDebut: "Seungmin se unió a JYP en 2017 tras quedar en segundo lugar en la 13ª Audición Abierta de la agencia. Es conocido por su disciplina extrema y su dedicación a mejorar su técnica vocal, manteniendo diarios de entrenamiento detallados desde sus días de aprendiz.",
        soloCareer: "Ha lanzado varios OST para dramas coreanos populares como 'Hometown Cha-Cha-Cha' ('Here Always'). Es el líder de la unidad 'Vocal Racha' y ha demostrado su talento en programas como 'King of Mask Singer'.",
        achievements: "Reconocido por su voz clara, estable y emocional. Ha sido MC de programas como 'After School Club'. Su crecimiento vocal constante lo ha posicionado como uno de los mejores vocalistas de su generación.",
        curiosities: "Habla fluido inglés ya que vivió en Los Ángeles por unos meses durante la primaria. Es un gran fan del béisbol. Es conocido por su personalidad pulcra y por ser el 'cachorro' del grupo por su apariencia tierna."
      }
    },
    {
      id: "in",
      stageName: "I.N",
      realName: "Yang Jeong-in",
      position: "Vocalista, Maknae",
      birthday: "8 de febrero de 2001",
      birthplace: "Busan, Corea del Sur",
      mbti: "INFJ",
      image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/I.N_of_Stray_Kids%2C_March_2%2C_2025.png",
      color: "bg-yellow-600",
      fullBio: {
        preDebut: "I.N comenzó como modelo infantil antes de interesarse por la música. Se unió a JYP y entrenó durante dos años. Durante el programa de supervivencia, trabajó duro para superar las críticas y demostrar su valor como vocalista, ganándose el corazón de todos con su sonrisa.",
        soloCareer: "Ha explorado géneros como el Trot (música tradicional coreana) y ha lanzado canciones en solitario que muestran su tono vocal único. En 2024, ha estado muy activo en eventos de moda internacional, asistiendo a desfiles de Alexander McQueen.",
        achievements: "Es el amado 'maknae' (menor) del grupo. Ha demostrado una gran versatilidad al adaptarse a conceptos oscuros y brillantes. Su mejora vocal desde el debut ha sido una de las más notables en el grupo.",
        curiosities: "Usó brackets durante mucho tiempo, lo que se convirtió en su marca registrada inicial. Sabe tocar el piano. Es apodado 'Zorro del Desierto' por sus rasgos faciales. Le encanta la moda y es considerado uno de los miembros con mejor estilo al vestir."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Stray Kids: Biografía Completa</h1>
          </div>
          <Badge className="bg-slate-900 hover:bg-slate-800 text-white border-none px-3 py-1">
            8 Estrellas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80"
          alt="Stray Kids Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">Stray Kids</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Los líderes de la nueva generación que crean su propio camino a través de música autoproducida y energía inigualable.
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
                              <p className="text-slate-300 font-bold tracking-widest uppercase text-xs">{member.position}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Calendar className="size-4 text-slate-600 shrink-0" />
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
                                  <div className="h-6 w-1 bg-slate-900 rounded-full" />
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
        <section className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Stray Kids: Everywhere All Around The World</h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Desde su debut en 2018, Stray Kids ha demostrado que no tienen miedo de experimentar y romper las reglas. Con su lema "Step Out", invitan a todos a salir de lo ordinario y unirse a su viaje musical único.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#StrayKids</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#STAY</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#SKZ_PRODUCERS</Badge>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="container px-4">
          <p className="font-bold text-slate-900 mb-2">ETER K-POP MX</p>
          <p className="text-slate-400 text-sm">© 2026 - Biografías Oficiales de Stray Kids. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
