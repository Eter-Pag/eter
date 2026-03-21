import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, ChevronDown, Music, Award, BookOpen, Heart, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";

export default function TxtBiographies() {
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
    id: "soobin",
    name: "Soobin",
    realName: "Choi Soo-bin",
    position: "Líder",
    birth: "5 de diciembre de 2000",
    origin: "Ansan, Gyeonggi, Corea del Sur",
    mbti: "ISFP",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",    fullBio: {
      preDebut: "El líder amable y carismático de TXT. Es conocido por su altura impresionante y sus visuales de 'flower boy'.",
      soloCareer: "MC de Music Bank junto a Arin de Oh My Girl (2020-2021).",
      achievements: "Lideró a TXT a ser el primer grupo de cuarta generación en encabezar Lollapalooza.",
      curiosities: "Es un gran fan de la música K-Pop. Le encanta el pan y la leche de almendras."
    }
  },
  {
    id: "yeonjun",
    name: "Yeonjun",
    realName: "Choi Yeon-jun",
    position: "Rapero, Bailarín, Vocalista",
    birth: "13 de septiembre de 1999",
    origin: "Seúl, Corea del Sur",
    mbti: "ENFP",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",    fullBio: {
      preDebut: "Conocido como el '4th Gen It Boy'. Fue el aprendiz número 1 en JYP y BigHit en todas las categorías.",
      soloCareer: "Debut solista con 'GGUM' en 2024. Embajador de Privé Alliance.",
      achievements: "Primer integrante de TXT en debutar oficialmente como solista.",
      curiosities: "Vivió en EE. UU. durante 2 años. Es un apasionado de la moda."
    }
  },
  {
    id: "beomgyu",
    name: "Beomgyu",
    realName: "Choi Beom-gyu",
    position: "Vocalista, Bailarín, Visual",
    birth: "13 de marzo de 2001",
    origin: "Daegu, Corea del Sur",
    mbti: "ISFJ",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1000&auto=format&fit=crop",    fullBio: {
      preDebut: "El creador de ambiente del grupo. Es conocido por su energía inagotable y su habilidad para tocar la guitarra.",
      soloCareer: "Participación activa en la composición y producción de canciones del grupo.",
      achievements: "Reconocido por su carisma en programas de variedades y su presencia escénica.",
      curiosities: "Fue reclutado en su ciudad natal, Daegu. Le gusta mucho la fotografía."
    }
  },
  {
    id: "taehyun",
    name: "Taehyun",
    realName: "Kang Tae-hyun",
    position: "Vocalista Principal",
    birth: "5 de febrero de 2002",
    origin: "Seúl, Corea del Sur",
    mbti: "ESTP",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop",    fullBio: {
      preDebut: "Conocido por su inteligencia y su voz potente y estable. Es uno de los vocalistas más técnicos de su generación.",
      soloCareer: "Colaboraciones vocales y participación en la escritura de letras.",
      achievements: "Elogiado por su madurez y profesionalismo desde el debut.",
      curiosities: "Habla inglés con fluidez. Le gusta la magia y el boxeo."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">TOMORROW X TOGETHER: Biografía Completa</h1>
          </div>
          <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-none px-3 py-1">
            5 Leyendas
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[45vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&q=80"
          alt="TOMORROW X TOGETHER Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">TOMORROW X TOGETHER</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            Cinco jóvenes talentos que escriben el futuro del K-Pop con su creatividad, autenticidad y conexión emocional con sus seguidores.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-6xl mx-auto">
        {/* Members Grid - Accordion Style */}
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
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
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
                                  <div className="h-6 w-1 bg-purple-600 rounded-full" />
                                  <h4 className="text-lg font-bold text-slate-900">Trayectoria y Origen</h4>
                                </div>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                                  {member.fullBio.preDebut}
                                </p>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                                  <Shield className="size-5 text-purple-600 mt-0.5 shrink-0" />
                                  <div>
                                    <h5 className="font-bold text-slate-900 text-sm mb-1">Servicio Militar</h5>
                                    <p className="text-slate-600 text-xs md:text-sm">{member.fullBio.military}</p>
                                  </div>
                                </div>
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
        <section className="mt-16 bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-10 md:p-16 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">TOMORROW X TOGETHER: El Legado del Futuro</h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Desde su debut en 2019, TOMORROW X TOGETHER escribe el futuro del K-Pop con su creatividad, autenticidad y conexión emocional. Han unido a millones de fans bajo un mismo nombre: MOA.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#TXT</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#MOA</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#KPOP_LEGENDS</Badge>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="container px-4">
          <p className="font-bold text-slate-900 mb-2">ETER K-POP MX</p>
          <p className="text-slate-400 text-sm">© 2026 - Biografías Oficiales de TOMORROW X TOGETHER. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
