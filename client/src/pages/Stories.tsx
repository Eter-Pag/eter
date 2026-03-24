import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Send, Heart, MessageCircle, Sparkles, Globe, ChevronDown, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Stories() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storiesRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data: stories, isLoading } = trpc.stories.list.useQuery();
  
  const submitMutation = trpc.stories.submit.useMutation({
    onSuccess: () => {
      toast.success("¡Tu historia ha sido enviada y traducida!");
      setName("");
      setContent("");
      utils.stories.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Error al enviar la historia");
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    if (content.length < 10) {
      toast.error("La historia debe tener al menos 10 caracteres");
      return;
    }
    setIsSubmitting(true);
    submitMutation.mutate({ name, content });
  };

  const scrollToStories = () => {
    storiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Colores aleatorios para las tarjetas
  const cardColors = [
    "from-purple-50 to-pink-50 border-purple-100",
    "from-blue-50 to-indigo-50 border-blue-100",
    "from-pink-50 to-rose-50 border-pink-100",
    "from-amber-50 to-orange-50 border-amber-100",
    "from-emerald-50 to-teal-50 border-emerald-100",
    "from-violet-50 to-fuchsia-50 border-violet-100"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full hover:bg-slate-50"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Cuéntanos tu Historia</h1>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-3 py-1">
            Muro de Ilusiones
          </Badge>
        </div>
      </header>

      <main className="container py-12 px-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold"
          >
            <Sparkles className="size-4" />
            Un espacio para soñar juntos
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            ¿Qué significa el <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">K-POP</span> para ti?
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Escribe tu historia, tus sueños o un mensaje para tus idols. 
            Lo traduciremos al coreano con la esperanza de que algún día llegue a ellos. 🇰🇷✨
          </p>

          {/* Botón de Salto */}
          <Button
            variant="outline"
            onClick={scrollToStories}
            className="rounded-full border-purple-200 text-purple-600 hover:bg-purple-50 gap-2 font-bold px-6 h-12 transition-all hover:translate-y-1"
          >
            <ChevronDown className="size-5 animate-bounce" />
            Ir directamente a leer las historias
          </Button>
        </div>

        {/* Form Section */}
        <div className="max-w-3xl mx-auto mb-24">
          <Card className="bg-white border border-slate-100 shadow-2xl overflow-hidden rounded-[2.5rem]">
            <div className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-800 uppercase tracking-widest ml-1">Tu Nombre o Apodo</label>
                  <Input
                    placeholder="Ej. Army de Corazón"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-50 border-slate-100 focus:ring-purple-500 h-14 rounded-2xl text-lg px-6"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-slate-800 uppercase tracking-widest ml-1">Tu Historia</label>
                  <Textarea
                    placeholder="Cuéntanos cómo el K-POP cambió tu vida, tu momento favorito o un mensaje especial..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-slate-50 border-slate-100 focus:ring-purple-500 min-h-[180px] rounded-2xl text-lg p-6 resize-none"
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black text-xl rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="size-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Traduciendo...
                    </div>
                  ) : (
                    <>
                      <Send className="size-6" />
                      Enviar mi Historia a Corea
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stories Wall Section */}
        <div ref={storiesRef} className="pt-12 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 flex items-center justify-center gap-4">
              <MessageCircle className="size-8 md:size-12 text-pink-500" />
              Muro de Ilusiones
            </h3>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 text-sm font-bold">
                {stories?.length || 0} historias compartidas
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-72 bg-slate-50 animate-pulse rounded-[2rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {stories?.map((story, index) => {
                  const colorClass = cardColors[index % cardColors.length];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: (index % 8) * 0.05 }}
                      layout
                    >
                      <Card className={`h-full border-2 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col bg-gradient-to-br ${colorClass} group hover:-translate-y-2`}>
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black shadow-sm group-hover:rotate-12 transition-transform">
                              {story.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 truncate text-sm uppercase tracking-tight">{story.nombre}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {new Date(story.fecha).toLocaleDateString('es-MX', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4 flex-grow">
                            <p className="text-slate-700 text-sm leading-relaxed font-medium italic line-clamp-3">
                              "{story.historia_es}"
                            </p>
                            
                            <div className="pt-4 border-t border-white/50">
                              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <Globe className="size-3" />
                                Coreano
                              </div>
                              <p className="text-slate-900 font-bold text-xs leading-relaxed font-kr line-clamp-2">
                                {story.historia_ko}
                              </p>
                            </div>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  className="w-full mt-2 h-8 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-purple-600 hover:bg-white/50 rounded-xl gap-2"
                                >
                                  <Maximize2 className="size-3" />
                                  Leer historia completa
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-2xl border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                                <div className={`h-3 bg-gradient-to-r ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`} />
                                <div className="p-8 md:p-12 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                  <div className="flex items-center gap-4">
                                    <div className="size-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl shadow-sm">
                                      {story.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                        {story.nombre}
                                      </DialogTitle>
                                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(story.fecha).toLocaleDateString('es-MX', { 
                                          day: 'numeric', 
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-8">
                                    <div className="relative">
                                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-purple-100 rounded-full" />
                                      <p className="text-slate-700 text-lg leading-relaxed font-medium italic pl-4">
                                        "{story.historia_es}"
                                      </p>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                      <div className="flex items-center gap-2 text-xs font-black text-purple-500 uppercase tracking-widest mb-4">
                                        <Globe className="size-4" />
                                        Traducción al Coreano
                                      </div>
                                      <p className="text-slate-900 font-bold text-xl leading-relaxed font-kr bg-slate-50 p-6 rounded-3xl">
                                        {story.historia_ko}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-center gap-4 pt-4">
                                    <Heart className="size-6 text-pink-500 fill-current" />
                                    <Sparkles className="size-6 text-purple-500" />
                                    <Heart className="size-6 text-pink-500 fill-current" />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <div className="mt-6 flex items-center justify-between text-slate-300 group-hover:text-pink-400 transition-colors">
                            <Heart className="size-4 fill-current" />
                            <div className="h-px flex-grow mx-3 bg-white/50" />
                            <Sparkles className="size-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && stories?.length === 0 && (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-4 border-dashed border-white shadow-inner">
              <Heart className="size-16 text-slate-200 mx-auto mb-6 animate-pulse" />
              <p className="text-slate-400 font-black text-xl uppercase tracking-widest">El muro está esperando tu luz</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 text-center mt-32">
        <div className="container px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-1 mb-6 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="size-3" />
            Eter K-Pop MX
          </div>
          <p className="text-white/40 text-sm italic max-w-md mx-auto">
            "Porque los sueños no tienen fronteras ni idiomas. Tu historia merece ser escuchada en todo el mundo."
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .font-kr { font-family: 'Noto Sans KR', sans-serif; }
      `}} />
    </div>
  );
}
