import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, ChevronDown, Music, Award, BookOpen, Heart, Shield, Images } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";

export default function BtsBiographies() {
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
    },
  ];

  const galleryImages = [
    "https://media.gq.com.mx/photos/6146620f682afc1f2f9a50fe/16:9/w_2560%2Cc_limit/GettyImages-1196915689%2520(1).jpg",
    "https://media.glamour.mx/photos/68470e7f3a63b341f062a46d/16:9/w_2560%2Cc_limit/BTS%2520portada.jpg",
    "https://media.gq.com.mx/photos/698e16c03d0ffacb6a5d5914/16:9/w_1280,c_limit/BTS_para_portada_GQ_2026_01.jpg",
    "https://media.glamour.mx/photos/6190995af5ed039ceea85e2f/master/w_1600%2Cc_limit/233736.jpg",
    "https://www.jornada.com.mx/ndjsimg/images/jornada/jornadaimg/cuando-se-estrena-bts-the-return-esto-se-sabe-del-nuevo-documental-de-netflix/cuando-se-estrena-bts-the-return-esto-se-sabe-del-nuevo-documental-de-netflix_e5e09480-654d-4502-acd8-d4c3e8e28d67_medialjnimgndimage=fullsize",
    "https://wallpapers.com/images/featured/sesion-de-fotos-de-bts-n4kol3ixqv5wjqgs.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwQ25U7IoC1eTdbh6Aeve0AJHpw5chVnklcg&s",
    "https://wallpapers.com/images/hd/bts-cute-pictures-y98h6l8rt67xexbl.jpg",
    "https://media.gq.com.mx/photos/698e099ab310a58bba01809b/master/w_1600%2Cc_limit/BTS_para_portada_GQ_2026_13.jpg",
    "https://ca-times.brightspotcdn.com/dims4/default/a9047bb/2147483647/strip/true/crop/3315x2296+0+0/resize/1200x831!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F9c%2F7e%2F04f056354c19888ba613f1f10cfe%2Fcf23698f3598465181748b7e77ff9038",
    "https://album.mediaset.es/eimg/2026/03/20/los-siete-miembros-de-bts-en-la-portada-oficial-de-su-nuevo-album-arirang-16-9-aspect-ratio-default_da39-2.jpg",
    "https://wallpapers.com/images/featured/bts-utd6rlso6dvav5az.jpg",
    "https://cloudfront-us-east-1.images.arcpublishing.com/infobae/V4IFVN6S7NDPRD7DFFGX7ZTEDQ.png",
    "https://www.dondeir.com/wp-content/uploads/2026/02/bts-cinepolis-transmision-en-vivo-conciertos-seul-y-tokio-preventa-y-boletos-funciones-en-cine.jpg",
    "https://media.cnn.com/api/v1/images/stellar/prod/bts-20250702093506572.jpeg?c=original",
    "https://lumiere-a.akamaihd.net/v1/images/bts_10e2829a.jpeg?region=0,409,4096,2304",
    "https://www.infobae.com/resizer/v2/TNUROGJ4ERBERHJWZC4IWSJ6OM.png?auth=1ccb20592e7cf74565144387d6de86689e9c698ffe40ef4fe7b8c97b8406d708&smart=true&width=1200&height=900&quality=85",
    "https://cdn.milenio.com/uploads/media/2020/07/22/grupo-debuto-junio-instagram-bts.jpg",
    "https://www.dondeir.com/wp-content/uploads/2022/07/the-most-beautiful-moment-to-party-fiesta-de-bts-en-la-cdmx.jpg",
    "https://static.wikia.nocookie.net/bighit-family/images/d/de/BTS_-_Fake_Love-Airplane_Pt.2_-_01.png/revision/latest?cb=20190203205918&path-prefix=es",
    "https://publicidadymercados.com/wp-content/uploads/2024/02/BTS-Set-the-Pace-for-ARMYs-Drool-Over-Sizzling-Photos-of-RM.jpg",
    "https://media.vogue.mx/photos/60e4c7c83a0166093ab3cacb/2:3/w_2560%2Cc_limit/BTS-grupo-K-Pop.jpg",
    "https://www.laxmasmusica.com/uploads/newsarticle/c63a7b36eeea44adb94b2f28afb47b71/BTS_anuncia_show_en_Corea_del_Sur_y_se_podr_SRTbEmZ.jpg",
    "https://media.gq.com.mx/photos/6966d1f926895c3cd18985b5/16:9/w_1280,c_limit/Integrantes_de_BTS%20(1).jpg",
    "https://f.radio-grpp.io/2022/02/10/211521_1215616.jpg?imgdimension=look",
    "https://los40.com.co/resizer/v2/AH5FVCME7FEEXDMUZIQGK3SBUA.jpg?auth=3d2c295c0cb3102d2bd1bf4132b129d16fb1e27900cb1444cf84df122e63d0fc&quality=70&width=1200&height=544&focal=1500,940",
    "https://www.laxmasmusica.com/uploads/newsarticle/53b6f9d562a0485cb057f3bd2ea9bbe9/BTS.jpg",
    "https://www.generacionuniversitaria.com.mx/wp-content/uploads/2026/01/BTS-2.jpg",
    "https://marieclaire.com.mx/wp-content/uploads/2025/09/bts-cancion-oficial-mundial-2026-2-1024x546.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTclT0N_P6YCHaoUr8SInkhyBW52f17K6gCuA&s",
    "https://m.media-amazon.com/images/S/pv-target-images/92ee2f8ca6e0519978d09db0ce68487895b7f0e7f82fecc1276f9181f67a9ecc._SX1080_FMjpg_.jpg",
    "https://www.actitudfem.com/media/files/bts-quienes-son-red.jpg",
    "https://www.telehit.com/_next/image?url=https%3A%2F%2Fst1.uvnimg.com%2F9d%2Fc4%2Fed7c9329d881bf5bae61b486023f%2Fbts-antes-de-ser-famosos.jpg&w=1280&q=75",
    "https://static-live.nmas.com.mx/nmas-news/2026-01/bts-regreso-musica-disco-gira-mundial.jpg",
    "https://media.admagazine.com/photos/6213fd5e18153088f4f949d7/master/pass/BTS.jpg",
    "https://imgmedia.larepublica.pe/1000x590/larepublica/original/2022/05/06/6275aed2a3df7610fa4c9f9e.webp"
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
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80"
          alt="BTS Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">BTS</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Siete artistas excepcionales que cambiaron la historia de la música global con su mensaje de amor propio y perseverancia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-6xl mx-auto">
        <div className="space-y-16">
          {/* Members Grid */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-8 w-1.5 bg-purple-600 rounded-full" />
              <h3 className="text-2xl font-bold text-slate-900">Integrantes</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </section>

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
                              <p className="text-purple-300 font-bold tracking-widest uppercase text-xs">{member.position}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Calendar className="size-4 text-purple-600 shrink-0" />
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
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Shield className="size-4 text-emerald-600 shrink-0" />
                              <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Servicio Militar</p>
                                <p className="text-xs font-bold text-slate-700">{member.military}</p>
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

                            <div className="text-slate-700 text-sm md:text-base leading-relaxed">
                              <TabsContent value="bio" className="space-y-4">
                                <p className="font-medium text-purple-600 italic">Antes del debut:</p>
                                <p>{member.fullBio.preDebut}</p>
                              </TabsContent>
                              <TabsContent value="solo" className="space-y-4">
                                <p className="font-medium text-purple-600 italic">Carrera en solitario:</p>
                                <p>{member.fullBio.soloCareer}</p>
                              </TabsContent>
                              <TabsContent value="achievements" className="space-y-4">
                                <p className="font-medium text-purple-600 italic">Hitos destacados:</p>
                                <p>{member.fullBio.achievements}</p>
                              </TabsContent>
                              <TabsContent value="extra" className="space-y-4">
                                <p className="font-medium text-purple-600 italic">Curiosidades:</p>
                                <p>{member.fullBio.curiosities}</p>
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

          {/* Photo Gallery Section */}
          <section className="pt-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-purple-600 rounded-full" />
                <h3 className="text-2xl font-bold text-slate-900">Galería de Fotos</h3>
              </div>
              <Badge variant="outline" className="border-purple-200 text-purple-600">
                {galleryImages.length} Imágenes
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((url, index) => (
                <div 
                  key={index} 
                  className="relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer"
                >
                  <img
                    src={url}
                    alt={`BTS Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Images className="text-white size-8" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="py-20 text-center bg-slate-100/50 border-t border-slate-200">
        <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Born to be legends</p>
        <h4 className="text-3xl font-black text-slate-900 mt-2">BTS x ARMY</h4>
      </footer>
    </div>
  );
}
