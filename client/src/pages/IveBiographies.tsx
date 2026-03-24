import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, ChevronDown, Music, Award, BookOpen, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";

export default function IveBiographies() {
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
      id: "yujin",
      name: "Yujin",
      realName: "An Yu-jin",
      position: "Líder, Vocalista Principal",
      birth: "1 de septiembre de 2003",
      origin: "Daejeon, Corea del Sur",
      mbti: "ISTP",
      image: "https://i.redd.it/yujin-at-kcon-la-2025-d1-250802-v0-go3ta2tbaihf1.jpg?width=1602&format=pjpg&auto=webp&s=e39dcb06ad73f9fcd576178e399d7fc7d433b66a",
      color: "bg-red-300",
      fullBio: {
        preDebut: "Ex-integrante de IZ*ONE. Conocida por su versatilidad, carisma y liderazgo.",
        soloCareer: "Embajadora de Fendi y protagonista del programa de variedades 'Earth Arcade'.",
        achievements: "Llevó a IVE a ganar múltiples Daesangs (Grandes Premios) en su primer año.",
        curiosities: "Es muy atlética y buena en los deportes. Habla inglés y japonés básico."
      }
    },
    {
      id: "gaeul",
      name: "Gaeul",
      realName: "Kim Ga-eul",
      position: "Rapera Principal, Bailarina",
      birth: "24 de septiembre de 2002",
      origin: "Incheon, Corea del Sur",
      mbti: "ISTJ",
      image: "https://i.pinimg.com/564x/a1/42/6c/a1426c551f0a5d79949789025582d152.jpg",
      color: "bg-blue-300",
      fullBio: {
        preDebut: "Fue reclutada por JYP y luego por Starship. Es la integrante con el período de entrenamiento más largo.",
        soloCareer: "Ha participado en la escritura de raps para varias canciones de IVE, como 'Royal' y 'Kitsch'.",
        achievements: "Reconocida por su presencia escénica y su rap estable.",
        curiosities: "Su nombre significa 'otoño' en coreano. Es la miembro mayor del grupo."
      }
    },
    {
      id: "rei",
      name: "Rei",
      realName: "Naoi Rei",
      position: "Rapera, Vocalista",
      birth: "3 de febrero de 2004",
      origin: "Nagoya, Japón",
      mbti: "INFJ",
      image: "https://i.pinimg.com/736x/8a/b1/74/8ab17486dd8d83efb9ac1bdfec52e64f.jpg",
      color: "bg-green-300",
      fullBio: {
        preDebut: "Primera artista japonesa en debutar bajo Starship Entertainment. Conocida por su estilo único.",
        soloCareer: "Musa de la marca de cosméticos Bonajour y ha colaborado en la escritura de sus propios raps.",
        achievements: "Reconocida por su tono de rap distintivo y su creatividad.",
        curiosities: "Le encanta dibujar y decorar. Sus fans la llaman 'Kim Rei' por lo bien que habla coreano."
      }
    },
    {
      id: "wonyoung",
      name: "Wonyoung",
      realName: "Jang Won-young",
      position: "Vocalista, Visual",
      birth: "31 de agosto de 2004",
      origin: "Seúl, Corea del Sur",
      mbti: "E???",
      image: "https://i.pinimg.com/736x/6f/2f/0f/6f2f0f7b0ec69af6490d4b740784e6a8.jpg",
      color: "bg-pink-300",
      fullBio: {
        preDebut: "Ex-integrante y centro de IZ*ONE. Un icono de la moda y una de las ídolos más populares.",
        soloCareer: "Embajadora global de Miu Miu e Innisfree. MC recurrente en eventos importantes.",
        achievements: "Ganadora del primer lugar en el programa de supervivencia Produce 48 a los 13 años.",
        curiosities: "Habla inglés con fluidez. Es conocida como la 'It Girl' de Corea por su influencia."
      }
    },
    {
      id: "liz",
      name: "Liz",
      realName: "Kim Ji-won",
      position: "Vocalista Principal",
      birth: "21 de noviembre de 2004",
      origin: "Jeju, Corea del Sur",
      mbti: "INFP",
      image: "https://cdn.kbizoom.com/media/2025/12/03021234/7et8pb8udm4pitz9t8qm1ykcdyjgdvvywoukvloses4-liz-ive-transformation-scaled.jpeg",
      color: "bg-cyan-300",
      fullBio: {
        preDebut: "Conocida por su potente voz y sus adorables hoyuelos. Apareció en el MV 'This Christmas' de Taeyeon.",
        soloCareer: "Ha demostrado su capacidad vocal en múltiples covers y presentaciones especiales.",
        achievements: "Elogiada constantemente por su técnica vocal estable y su emotividad al cantar.",
        curiosities: "Es una persona tímida y tranquila. Le encantan los gatos y tiene una personalidad dulce."
      }
    },
    {
      id: "leeseo",
      name: "Leeseo",
      realName: "Lee Hyun-seo",
      position: "Vocalista, Maknae",
      birth: "21 de febrero de 2007",
      origin: "Seúl, Corea del Sur",
      mbti: "ENFP",
      image: "https://i.pinimg.com/564x/47/36/38/4736387a2572e35b5a278d155dc64547.jpg",
      color: "bg-yellow-300",
      fullBio: {
        preDebut: "Fue modelo infantil para SM Entertainment antes de unirse a Starship. Es la miembro más joven.",
        soloCareer: "Ha sido MC especial para Inkigayo y ha participado en varios programas de variedades.",
        achievements: "Conocida por su energía fresca y su personalidad brillante, es la 'mood-maker' del grupo.",
        curiosities: "Entrenó durante 2 años. Le encanta la canción 'Lion Heart' de Girls' Generation."
      }
    }
  ];

  const toggleMember = (memberId: string) => {
    setExpandedMemberId(expandedMemberId === memberId ? null : memberId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/biografias")} className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">IVE: Biografía Completa</h1>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-none px-3 py-1">
            6 Leyendas
          </Badge>
        </div>
      </header>

      <section className="relative h-[45vh] md:h-[60vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&q=80" alt="IVE Group" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">IVE</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Seis artistas excepcionales que brillan con su talento, confianza y la determinación de conquistar el mundo de la música.
          </p>
        </div>
      </section>

      <main className="container py-16 px-4 max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {members.map((member) => (
              <Card key={member.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white" onClick={() => toggleMember(member.id)}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                  <div className={`absolute inset-0 opacity-20 ${member.color}`} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{member.position}</p>
                    <h4 className="text-xl font-black">{member.name}</h4>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronDown className={`size-5 text-slate-900 transition-transform ${expandedMemberId === member.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {expandedMemberId && (
            <div ref={bioContainerRef} className="animate-in fade-in slide-in-from-top-4 duration-500">
              <Card className="border-none shadow-2xl bg-white overflow-hidden">
                <CardContent className="p-0">
                  {members.filter((m) => m.id === expandedMemberId).map((member) => (
                    <div key={member.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 md:p-12">
                      <div className="lg:col-span-1">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] mb-6">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                          <div className={`absolute inset-0 opacity-30 ${member.color}`} />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                            <h3 className="text-3xl font-black mb-1">{member.name}</h3>
                            <p className="text-purple-300 font-bold tracking-widest uppercase text-xs">{member.position}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Calendar className="size-4 text-purple-600 shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400 font-bold uppercase">Nacimiento</p>
                              <p className="text-xs font-bold text-slate-700">{member.birth}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <MapPin className="size-4 text-blue-600 shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400 font-bold uppercase">Origen</p>
                              <p className="text-xs font-bold text-slate-700">{member.origin}</p>
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
                      <div className="lg:col-span-2">
                        <Tabs defaultValue="bio" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 rounded-xl mb-6">
                            <TabsTrigger value="bio" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"><BookOpen className="size-3 md:size-4 mr-1" /> Bio</TabsTrigger>
                            <TabsTrigger value="solo" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"><Music className="size-3 md:size-4 mr-1" /> Solo</TabsTrigger>
                            <TabsTrigger value="achievements" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"><Award className="size-3 md:size-4 mr-1" /> Logros</TabsTrigger>
                            <TabsTrigger value="extra" className="rounded-lg py-2 text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"><Heart className="size-3 md:size-4 mr-1" /> Extra</TabsTrigger>
                          </TabsList>
                          <div className="text-slate-700 text-sm md:text-base leading-relaxed">
                            <TabsContent value="bio"><p>{member.fullBio.preDebut}</p></TabsContent>
                            <TabsContent value="solo"><p>{member.fullBio.soloCareer}</p></TabsContent>
                            <TabsContent value="achievements"><p>{member.fullBio.achievements}</p></TabsContent>
                            <TabsContent value="extra"><p>{member.fullBio.curiosities}</p></TabsContent>
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
      </main>
    </div>
  );
}
