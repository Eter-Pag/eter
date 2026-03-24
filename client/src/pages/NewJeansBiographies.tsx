import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Star, ChevronDown, Music, Award, BookOpen, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useRef, useEffect } from "react";

export default function NewJeansBiographies() {
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
      id: "minji",
      stageName: "Minji",
      realName: "Kim Min-ji",
      position: "Líder, Vocalista, Bailarina",
      birthday: "7 de mayo de 2004",
      birthplace: "Chuncheon, Gangwon, Corea del Sur",
      mbti: "ESTJ",
      image: "https://i.pinimg.com/736x/05/7b/ee/057bee2994b408a891aba549858c07a2.jpg",
      color: "bg-blue-400",
      fullBio: {
        preDebut: "Minji fue aprendiz de Source Music y apareció en el video musical 'Permission to Dance' de BTS antes de su debut. Es conocida por su belleza clásica coreana y su papel como la 'hermana mayor' del grupo.",
        soloCareer: "Es embajadora global de Chanel (Moda, Relojería y Belleza). Ha participado en numerosas sesiones de fotos para revistas de alto perfil como Vogue y Elle.",
        achievements: "Ha encabezado las listas de reputación de marca de idols individuales múltiples veces. Es reconocida por su fluidez en inglés y su carisma natural.",
        curiosities: "Le encanta el color azul y las estaciones frías. Es muy organizada y le gusta planificar todo con antelación."
      }
    },
    {
      id: "hanni",
      stageName: "Hanni",
      realName: "Hanni Pham / Pham Ngoc Han",
      position: "Vocalista, Bailarina",
      birthday: "6 de octubre de 2004",
      birthplace: "Melbourne, Australia",
      mbti: "INFP",
      image: "https://www.nme.com/wp-content/uploads/2024/10/newjeans-hanni-audit-101024.jpg",
      color: "bg-pink-400",
      fullBio: {
        preDebut: "Hanni es de ascendencia vietnamita pero nació y creció en Australia. También apareció en el MV 'Permission to Dance' de BTS. Es la primera idol vietnamita bajo HYBE.",
        soloCareer: "Es embajadora global de Gucci y Armani Beauty. Ha co-escrito letras para canciones de NewJeans como 'Hype Boy' y 'ASAP'.",
        achievements: "Reconocida por su tono vocal único y su versatilidad en el baile. Es una de las idols extranjeras más influyentes de la actualidad.",
        curiosities: "Habla fluido vietnamita, inglés y coreano. Le encanta ver películas y es fan de las comedias románticas."
      }
    },
    {
      id: "danielle",
      stageName: "Danielle",
      realName: "Danielle Marsh / Mo Ji-hye",
      position: "Vocalista, Bailarina",
      birthday: "11 de abril de 2005",
      birthplace: "Newcastle, Nueva Gales del Sur, Australia",
      mbti: "ENFP",
      image: "https://nolae.es/cdn/shop/articles/danielle-newjeans-profil-584290.jpg?v=1737393834&width=1920",
      color: "bg-yellow-400",
      fullBio: {
        preDebut: "Danielle es de ascendencia coreana-australiana. De niña, apareció en varios programas de televisión coreanos como 'Rainbow Kindergarten'.",
        soloCareer: "Prestó su voz para el doblaje coreano de Ariel en la película 'La Sirenita' (2023) y cantó el tema principal. Es embajadora global de Burberry y YSL Beauty.",
        achievements: "Elogiada por su talento vocal y su capacidad para transmitir emociones. Su participación en Disney fue un hito para su carrera.",
        curiosities: "Le encanta surfear y dibujar. Es conocida por su personalidad brillante y 'soleada' que siempre anima al grupo."
      }
    },
    {
      id: "haerin",
      stageName: "Haerin",
      realName: "Kang Hae-rin",
      position: "Vocalista, Bailarina",
      birthday: "15 de mayo de 2006",
      birthplace: "Seúl, Corea del Sur",
      mbti: "ISTP",
      image: "https://i.pinimg.com/736x/43/5b/c7/435bc74cf04af112e472f6c7f1e628be.jpg",
      color: "bg-green-400",
      fullBio: {
        preDebut: "Haerin practicaba pansori (música tradicional coreana) antes de convertirse en aprendiz. Es conocida por sus rasgos faciales que recuerdan a un gato.",
        soloCareer: "Es embajadora global de Dior (Joyas, Moda y Belleza). Es un ícono de estilo para la Generación Z.",
        achievements: "Sus visuales únicos y su precisión en el baile la han hecho destacar rápidamente. Es una de las idols más buscadas en internet.",
        curiosities: "Le gusta aprender cosas nuevas y es muy curiosa. Es conocida por ser un poco reservada pero muy divertida con sus compañeras."
      }
    },
    {
      id: "hyein",
      stageName: "Hyein",
      realName: "Lee Hye-in",
      position: "Vocalista, Bailarina, Maknae",
      birthday: "21 de abril de 2008",
      birthplace: "Incheon, Corea del Sur",
      mbti: "INFP",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Hyein_of_NewJeans%2C_July_26%2C_2024.png",
      color: "bg-purple-400",
      fullBio: {
        preDebut: "Hyein fue modelo infantil y miembro del grupo infantil U.SSO Girl. También apareció en contenidos de YouTube antes de unirse a ADOR.",
        soloCareer: "Es la embajadora global más joven de Louis Vuitton. Ha demostrado una madurez increíble para su edad en la industria de la moda.",
        achievements: "A pesar de ser la menor, tiene una voz potente y una presencia escénica imponente. Es considerada una 'prodigio' del K-pop.",
        curiosities: "Es una gran fan de BTS. Le gusta tomar fotos y caminar mientras escucha música. Es muy alta para su edad."
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
            <h1 className="font-bold text-xl tracking-tight text-slate-900">NewJeans: Biografía Completa</h1>
          </div>
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none px-3 py-1">
            5 Conejos
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80"
          alt="NewJeans Group"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">NewJeans</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            La frescura y el estilo retro que han revolucionaron la industria musical con su concepto innovador y auténtico.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-16 px-4 max-w-6xl mx-auto">
        <div className="space-y-6">
          {/* Grid de Miembros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
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
                              <p className="text-blue-300 font-bold tracking-widest uppercase text-xs">{member.position}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <Calendar className="size-4 text-blue-600 shrink-0" />
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
                                  <div className="h-6 w-1 bg-blue-600 rounded-full" />
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
        <section className="mt-16 bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-10 md:p-16 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">NewJeans: We Are NewJeans</h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Desde su debut sorpresa en 2022, NewJeans ha cambiado las reglas del juego. Como un par de jeans nuevos que quieres usar todos los días, su música es atemporal y esencial para esta nueva era.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#NewJeans</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#Bunnies</Badge>
              <Badge variant="outline" className="text-white border-white/20 px-3 py-1 text-sm">#Ditto</Badge>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center">
        <div className="container px-4">
          <p className="font-bold text-slate-900 mb-2">ETER K-POP MX</p>
          <p className="text-slate-400 text-sm">© 2026 - Biografías Oficiales de NewJeans. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
