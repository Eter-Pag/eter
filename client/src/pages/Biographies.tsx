import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music, Users } from "lucide-react";

export default function Biographies() {
  const [, navigate] = useLocation();

  const artists = [
    {
      id: 1,
      name: "BTS",
      group: "Grupo de 7 miembros",
      description: "Bangtan Sonyeondan, conocidos como BTS, es un grupo surcoreano de música pop que revolucionó la industria musical global.",
      image: "https://www.billboard.com/wp-content/uploads/2026/03/bts-netflix-trailer-2026-billboard-1800.jpg?w=1024",
      debut: "2013",
      members: 7,
      path: "/biografias/bts"
    },
    {
      id: 2,
      name: "BLACKPINK",
      group: "Grupo de 4 miembros",
      description: "BLACKPINK es un grupo femenino surcoreano que se ha convertido en un fenómeno global con su música y estilo único.",
      image: "https://4kwallpapers.com/images/wallpapers/blackpink-lisa-jisoo-jennie-rose-k-pop-singers-korean-2560x1440-8881.jpg",
      debut: "2016",
      members: 4,
      path: "/biografias/blackpink"
    },
    {
      id: 3,
      name: "STRAY KIDS",
      group: "Grupo de 8 miembros",
      description: "STRAY KIDS es un grupo masculino surcoreano conocido por su talento en danza, canto y producción musical.",
      image: "https://i.pinimg.com/originals/cf/f2/c8/cff2c874b3b35b3a599bafc5e3416240.jpg",
      debut: "2018",
      members: 8,
      path: "/biografias/straykids"
    },
    {
      id: 4,
      name: "TWICE",
      group: "Grupo de 9 miembros",
      description: "TWICE es un grupo femenino surcoreano que ha ganado múltiples premios internacionales y millones de seguidores.",
      image: "https://www.nme.com/wp-content/uploads/2025/07/twice-this-is-for-interview-credit-jyp-entertainment-image1.jpeg",
      debut: "2015",
      members: 9,
      path: "/biografias/twice"
    },
    {
      id: 5,
      name: "NewJeans",
      group: "Grupo de 5 miembros",
      description: "NewJeans es el grupo femenino más nuevo de HYBE, conocido por su concepto fresco y moderno.",
      image: "https://wallpaperaccess.com/full/8626014.jpg",
      debut: "2022",
      members: 5,
      path: "/biografias/newjeans"
    },
    {
      id: 6,
      name: "IVE",
      group: "Grupo de 6 miembros",
      description: "IVE es un grupo femenino surcoreano que ha ganado popularidad rápidamente con sus éxitos musicales.",
      image: "https://4kwallpapers.com/images/wallpapers/ive-k-pop-an-yujin-2560x1440-23394.jpg",
      debut: "2021",
      members: 6,
      path: "/biografias/ive"
    },
    {
      id: 7,
      name: "TXT",
      group: "Grupo de 5 miembros",
      description: "TOMORROW X TOGETHER es un grupo masculino surcoreano conocido por sus narrativas mágicas y crecimiento artístico.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      debut: "2019",
      members: 5,
      path: "/biografias/txt"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <span className="font-bold text-sm tracking-tight">Biografías</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="size-3" />
            Volver
          </Button>
        </div>
      </header>

      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Artistas K-POP</h1>
          <p className="text-muted-foreground">
            Conoce más sobre tus grupos y artistas favoritos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card
              key={artist.id}
              className="bg-white/60 backdrop-blur-xl border-border/50 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />

                {/* Debut badge */}
                <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Debut {artist.debut}
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{artist.name}</h3>
                  <p className="text-sm text-muted-foreground">{artist.group}</p>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{artist.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 bg-purple-50 p-2 rounded-lg">
                    <Users className="size-4 text-purple-600" />
                    <span className="font-bold">{artist.members} miembros</span>
                  </div>
                  <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
                    <Music className="size-4 text-pink-600" />
                    <span className="font-bold">Activo</span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate(artist.path)}
                >
                  Ver Biografía Completa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
