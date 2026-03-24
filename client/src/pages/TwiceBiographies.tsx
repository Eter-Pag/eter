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
      image: "https://upload.wikimedia.org/wikipedia/commons/5/55/220701_Nayeon%28%EB%82%98%EC%97%B0%29_of_Twice_MusicBank_Fancam.jpg",
      color: "bg-sky-400",
      fullBio: {
        preDebut: "Nayeon se unió a JYP en 2010 tras una audición secreta. Antes de SIXTEEN, era parte del grupo planeado 6MIX. Es conocida por ser la 'face' de TWICE y por su energía vibrante que define el sonido del grupo.",
        soloCareer: "Fue la primera en debutar como solista con 'IM NAYEON' (2022) y su éxito 'POP!'. En 2024 lanzó su segundo mini álbum 'NA'.",
        achievements: "Primera solista de K-pop en entrar al Top 10 del Billboard 200. Ganadora de múltiples premios a Mejor Artista Femenina.",
        curiosities: "Tiene una cicatriz en la pierna izquierda por un accidente de coche en su infancia. Es muy fan de Oh My Girl."
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
      image: "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/TWICE-Taste-of-Love-10th-Mini-Album-teasers-documents-3.jpg?v=1738749912",
      color: "bg-lime-400",
      fullBio: {
        preDebut: "Jeongyeon audicionó para JYP y SM el mismo día, siendo aceptada en ambas pero eligiendo JYP. Es conocida por su voz estable y su imagen carismática.",
        soloCareer: "Ha participado en OSTs y es muy activa en programas de variedades. Es conocida por su amor por los animales y su trabajo voluntario.",
        achievements: "Ganadora del Female Rookie Award en los SBS Entertainment Awards junto a su hermana, la actriz Gong Seung-yeon.",
        curiosities: "Le encanta limpiar y es la encargada del orden en el dormitorio. Sabe tocar el saxofón."
      }
    },
    {
      id: "momo",
      stageName: "Momo",
      realName: "Hirai Momo",
      position: "Bailarina Principal, Rapera, Vocalista",
      birthday: "9 de noviembre de 1996",
      birthplace: "Kyotanabe, Kioto, Japón",
      mbti: "INFP",
      image: "https://voguesg.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2024/06/20163946/momobeauty-3.jpg",
      color: "bg-pink-400",
      fullBio: {
        preDebut: "Momo fue reclutada por JYP tras ver un video de ella bailando con su hermana. Fue eliminada en SIXTEEN pero J.Y. Park la trajo de vuelta por su increíble habilidad de baile.",
        soloCareer: "Miembro de la subunidad MISAMO. Es embajadora de marcas de lujo como Miu Miu y Onitsuka Tiger.",
        achievements: "Considerada una de las mejores bailarinas de la historia del K-pop. Sus videos de baile tienen millones de vistas.",
        curiosities: "Le encanta comer, especialmente jokbal (manitas de cerdo). Tiene tres perros: Boo, Dobby y Petco."
      }
    },
    {
      id: "sana",
      stageName: "Sana",
      realName: "Minatozaki Sana",
      position: "Vocalista",
      birthday: "29 de diciembre de 1996",
      birthplace: "Tennoji-ku, Osaka, Japón",
      mbti: "ENFP",
      image: "https://cdn.shopify.com/s/files/1/0469/3927/5428/files/250119-SANA-at-Milan-Fashion-Week-for-Prada-FW25-documents-1.jpg?v=1738584857",
      color: "bg-purple-400",
      fullBio: {
        preDebut: "Sana fue reclutada mientras estaba de compras con sus amigas en Japón. Se mudó a Corea en 2012. Se hizo viral por su icónica línea 'Shy Shy Shy' en 'Cheer Up'.",
        soloCareer: "Miembro de MISAMO. Es embajadora global de Prada y Graff. Es una de las idols extranjeras más queridas en Corea.",
        achievements: "Ha encabezado las listas de reputación de marca múltiples veces. Es un ícono de la moda y la belleza.",
        curiosities: "Es hija única. Le gusta coleccionar perfumes y es conocida por su personalidad extremadamente optimista."
      }
    },
    {
      id: "jihyo",
      stageName: "Jihyo",
      realName: "Park Ji-hyo",
      position: "Líder, Vocalista Principal",
      birthday: "1 de febrero de 1997",
      birthplace: "Guri, Gyeonggi, Corea del Sur",
      mbti: "ESFP",
      image: "https://i.pinimg.com/736x/5b/22/72/5b2272f2be079b99c4533a8fd408a308.jpg",
      color: "bg-amber-400",
      fullBio: {
        preDebut: "Jihyo entrenó durante 10 años en JYP antes de debutar. Vio debutar a grupos como Wonder Girls y 2PM mientras ella seguía siendo aprendiz.",
        soloCareer: "Debut como solista en 2023 con el álbum 'ZONE' y el tema 'Killin' Me Good'. Es conocida por su potente voz y presencia escénica.",
        achievements: "Ganadora de premios a Mejor Vocalista. Es respetada como una de las mejores líderes de la industria.",
        curiosities: "Su nombre de nacimiento era Park Ji-soo. Le encanta el surf y el gimnasio. Es ambidiestra."
      }
    },
    {
      id: "mina",
      stageName: "Mina",
      realName: "Myoui Mina",
      position: "Bailarina Principal, Vocalista",
      birthday: "24 de marzo de 1997",
      birthplace: "San Antonio, Texas, EE.UU. (Criada en Kobe, Japón)",
      mbti: "ISFP",
      image: "https://i.redd.it/240419-harpers-bazaar-japan-site-update-twices-mina-and-v0-3jfsz3du9dvc1.jpg?width=980&format=pjpg&auto=webp&s=581058545e7508a4f49fb767a2a52a4dd98c464d",
      color: "bg-teal-400",
      fullBio: {
        preDebut: "Mina estudió ballet durante 11 años antes de unirse a JYP. Fue reclutada mientras compraba con su madre en Osaka. Tuvo el periodo de entrenamiento más corto de TWICE.",
        soloCareer: "Miembro de MISAMO. Es embajadora de SK-II y Fendi. Es conocida por su elegancia natural y su aura 'real'.",
        achievements: "Reconocida por su técnica de baile fluida y elegante. Es una de las visuales más aclamadas del K-pop.",
        curiosities: "Le encantan los videojuegos y tejer. Nació en EE.UU. por lo que tuvo doble nacionalidad hasta los 22 años."
      }
    },
    {
      id: "dahyun",
      stageName: "Dahyun",
      realName: "Kim Da-hyun",
      position: "Rapera Líder, Vocalista",
      birthday: "28 de mayo de 1998",
      birthplace: "Seongnam, Corea del Sur",
      mbti: "ISFJ",
      image: "https://i.pinimg.com/736x/1b/0e/73/1b0e73c1305027599a18f2eb3f904620.jpg",
      color: "bg-white",
      fullBio: {
        preDebut: "Dahyun se hizo viral antes de debutar por su 'baile del águila' en la iglesia. Es conocida por su piel extremadamente blanca y su habilidad para encontrar cámaras.",
        soloCareer: "Debutará como actriz en el remake coreano de 'You Are the Apple of My Eye'. Es embajadora global de Michael Kors.",
        achievements: "Es una de las idols más populares en programas de variedades por su ingenio y carisma.",
        curiosities: "Toca el piano con maestría. Tiene miedo a los animales grandes pero ama a su perro Ari."
      }
    },
    {
      id: "chaeyoung",
      stageName: "Chaeyoung",
      realName: "Son Chae-young",
      position: "Rapera Principal, Vocalista",
      birthday: "23 de abril de 1999",
      birthplace: "Seúl, Corea del Sur",
      mbti: "INFP",
      image: "https://dam.mediacorp.sg/image/upload/s--NQIR5N4y--/c_crop,h_607,w_1080,x_0,y_285/c_fill,g_auto,h_676,w_1200/f_auto,q_auto/v1/mediacorp/cna/image/2025/06/12/twice_chaeyoung_solo_1.jpg?itok=7pSNfdx7",
      color: "bg-red-500",
      fullBio: {
        preDebut: "Chaeyoung se unió a JYP en 2012. Es una artista completa que escribe sus propios raps y diseña arte para los álbumes del grupo.",
        soloCareer: "Es embajadora de Etro. Ha colaborado en proyectos artísticos y es conocida por su estilo indie y alternativo.",
        achievements: "Primera integrante de TWICE en tener créditos de escritura en una canción del grupo. Es un ícono de la autoexpresión.",
        curiosities: "Le encanta dibujar y tiene muchos tatuajes pequeños. Es fan de Justin Bieber y Vincent van Gogh."
      }
    },
    {
      id: "tzuyu",
      stageName: "Tzuyu",
      realName: "Chou Tzuyu",
      position: "Bailarina Líder, Vocalista, Visual, Maknae",
      birthday: "14 de junio de 1999",
      birthplace: "Tainan, Taiwán",
      mbti: "ISFP",
      image: "https://i.redd.it/250109-tzuyu-instagram-update-2024-2025-2-5-25-years-old-26-v0-r8d7e0c2tube1.jpg?width=1440&format=pjpg&auto=webp&s=420f0dca47af5ca3b6e25e7250d0ea0923431956",
      color: "bg-blue-600",
      fullBio: {
        preDebut: "Tzuyu fue descubierta en un taller de danza en Taiwán y se mudó a Corea en 2012. Fue añadida a TWICE por votación del público debido a su inmensa popularidad.",
        soloCareer: "Debut como solista en 2024 con el álbum 'abouTZU'. Es embajadora de marcas como Pond's y Zooc.",
        achievements: "Nombrada la 'Mujer Más Hermosa del Mundo' por TC Candler en 2019. Es un ícono visual global.",
        curiosities: "Le encantan los perros y tiene uno llamado Kaya. Es conocida por su honestidad brutal y su altura."
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
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-white p-6 text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">TWICE</h2>
          <p className="max-w-3xl text-lg md:text-2xl text-slate-200 font-medium leading-relaxed">
            One in a Million! El grupo de la nación que ha conquistado corazones con su energía y talento inigualable.
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
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
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
                      className="w-full h-full object-cover object-center"
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
