import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, Info, Music, Award, BookOpen, Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BtsBiographies() {
  const [, navigate] = useLocation();

  const members = [
    {
      id: "rm",
      stageName: "RM",
      realName: "Kim Nam-joon",
      position: "Líder, Rapero Principal",
      birthday: "12 de Septiembre, 1994",
      birthplace: "Ilsan, Gyeonggi-do, Corea del Sur",
      mbti: "ENTP",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
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
      <section className="relative h-[45vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&q=80"
          alt="BTS Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">BTS</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            La historia de siete jóvenes que cambiaron el mundo a través de la música, el amor propio y la perseverancia.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-24">
          {members.map((member) => (
            <section key={member.id} className="scroll-mt-24">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left: Image and Basic Info */}
                <div className="w-full lg:w-1/3 sticky lg:top-24">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                    <img
                      src={member.image}
                      alt={member.stageName}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 opacity-30 ${member.color}`} />
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-white">
                      <h3 className="text-4xl font-black mb-1">{member.stageName}</h3>
                      <p className="text-purple-300 font-bold tracking-widest uppercase text-sm">{member.position}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="p-2 bg-purple-100 rounded-lg"><Calendar className="size-5 text-purple-600" /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Nacimiento</p>
                        <p className="text-sm font-bold text-slate-700">{member.birthday}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="p-2 bg-blue-100 rounded-lg"><MapPin className="size-5 text-blue-600" /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Origen</p>
                        <p className="text-sm font-bold text-slate-700">{member.birthplace}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <div className="p-2 bg-amber-100 rounded-lg"><Star className="size-5 text-amber-600" /></div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Personalidad MBTI</p>
                        <p className="text-sm font-bold text-slate-700">{member.mbti}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Detailed Tabs */}
                <div className="w-full lg:w-2/3">
                  <Tabs defaultValue="bio" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-200/50 rounded-2xl mb-8">
                      <TabsTrigger value="bio" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <BookOpen className="size-4 mr-2" /> Biografía
                      </TabsTrigger>
                      <TabsTrigger value="solo" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Music className="size-4 mr-2" /> Carrera Solo
                      </TabsTrigger>
                      <TabsTrigger value="achievements" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Award className="size-4 mr-2" /> Logros
                      </TabsTrigger>
                      <TabsTrigger value="extra" className="rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Heart className="size-4 mr-2" /> Curiosidades
                      </TabsTrigger>
                    </TabsList>

                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 min-h-[400px]">
                      <TabsContent value="bio" className="mt-0 space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-8 w-1.5 bg-purple-600 rounded-full" />
                          <h4 className="text-2xl font-bold text-slate-900">Trayectoria y Origen</h4>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                          {member.fullBio.preDebut}
                        </p>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                          <Shield className="size-6 text-purple-600 mt-1 shrink-0" />
                          <div>
                            <h5 className="font-bold text-slate-900 mb-1">Estado del Servicio Militar</h5>
                            <p className="text-slate-600">{member.fullBio.military}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="solo" className="mt-0 space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                          <h4 className="text-2xl font-bold text-slate-900">Carrera como Solista</h4>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                          {member.fullBio.soloCareer}
                        </p>
                      </TabsContent>

                      <TabsContent value="achievements" className="mt-0 space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-8 w-1.5 bg-amber-500 rounded-full" />
                          <h4 className="text-2xl font-bold text-slate-900">Logros e Impacto</h4>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                          {member.fullBio.achievements}
                        </p>
                      </TabsContent>

                      <TabsContent value="extra" className="mt-0 space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-8 w-1.5 bg-pink-500 rounded-full" />
                          <h4 className="text-2xl font-bold text-slate-900">Curiosidades y Personalidad</h4>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed">
                          {member.fullBio.curiosities}
                        </p>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </div>
              <div className="mt-24 h-px bg-slate-200 w-full" />
            </section>
          ))}
        </div>

        {/* Final Group Section */}
        <section className="mt-12 bg-gradient-to-br from-purple-900 to-slate-900 rounded-[3rem] p-10 md:p-20 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight">BTS: El Legado de la Eternidad</h3>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              Desde su debut en 2013, BTS ha demostrado que la música no tiene fronteras, idiomas ni límites. A través de su mensaje de "Love Yourself", han salvado vidas y unido a millones de personas bajo un mismo nombre: ARMY.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="text-white border-white/20 px-4 py-2 text-lg">#BTS</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-4 py-2 text-lg">#ARMY</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-4 py-2 text-lg">#KPOP_LEGENDS</Badge>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-slate-200 text-center">
        <div className="container px-4">
          <p className="font-bold text-slate-900 mb-2">ETER K-POP MX</p>
          <p className="text-slate-400 text-sm">© 2026 - Biografías Oficiales de BTS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
