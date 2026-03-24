import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Heart, Sparkles, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function StoriesWall() {
  const [, navigate] = useLocation();
  const { data: stories, isLoading } = trpc.stories.list.useQuery();

  // Mostrar solo las 3 más recientes para la página principal
  const recentStories = stories?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="py-20 bg-slate-50/50">
        <div className="container px-4">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si no hay historias, mostramos un mensaje invitando a crear la primera
  if (recentStories.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
        <div className="container px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold">
              <Sparkles className="size-4" />
              Muro de Ilusiones
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Sueños que cruzan fronteras
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Aún no hay historias en nuestro muro. ¡Sé la primera persona en enviar un mensaje a Corea!
            </p>
            <Button 
              onClick={() => navigate("/historias")}
              className="h-14 px-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 gap-3"
            >
              Escribir mi historia
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold"
          >
            <Sparkles className="size-4" />
            Muro de Ilusiones
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Sueños que cruzan fronteras
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Lee las historias de nuestra comunidad, traducidas al coreano con la esperanza de que algún día lleguen a sus destinos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {recentStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden h-full flex flex-col group">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-200 group-hover:rotate-6 transition-transform">
                      {story.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{story.name}</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Fan de Corazón</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6 flex-grow">
                    <p className="text-slate-600 leading-relaxed italic text-base">
                      "{story.content.length > 150 ? story.content.substring(0, 150) + '...' : story.content}"
                    </p>
                    
                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-widest mb-3">
                        <Globe className="size-3" />
                        Traducción al Coreano
                      </div>
                      <p className="text-slate-800 font-medium text-sm leading-relaxed font-kr line-clamp-3">
                        {story.contentKo}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between text-slate-200 group-hover:text-pink-200 transition-colors">
                    <Heart className="size-5 fill-current" />
                    <div className="h-px flex-grow mx-4 bg-slate-100" />
                    <Sparkles className="size-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate("/historias")}
            className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 gap-3"
          >
            Ver todas las historias
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .font-kr { font-family: 'Noto Sans KR', sans-serif; }
      `}} />
    </section>
  );
}
