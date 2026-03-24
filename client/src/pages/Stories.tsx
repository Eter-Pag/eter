import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Heart, MessageCircle, Sparkles, Globe } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Stories() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">Cuéntanos tu Historia</h1>
          </div>
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-none px-3 py-1">
            Muro de Ilusiones
          </Badge>
        </div>
      </header>

      <main className="container py-12 px-4 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-1.5 mb-6 text-sm font-bold">
            <Sparkles className="size-4" />
            Un espacio para soñar juntos
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            ¿Qué significa el K-POP para ti?
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Escribe tu historia, tus sueños o un mensaje para tus idols. 
            Lo traduciremos al coreano con la esperanza de que algún día llegue a ellos. 🇰🇷✨
          </p>
        </div>

        {/* Form Section */}
        <Card className="bg-white/80 backdrop-blur-xl border-none shadow-2xl mb-16 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tu Nombre o Apodo</label>
                <Input
                  placeholder="Ej. Army de Corazón"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:ring-purple-500 h-12 rounded-xl"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tu Historia</label>
                <Textarea
                  placeholder="Cuéntanos cómo el K-POP cambió tu vida, tu momento favorito o un mensaje especial..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-slate-50 border-slate-200 focus:ring-purple-500 min-h-[150px] rounded-xl resize-none"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traduciendo y enviando...
                  </div>
                ) : (
                  <>
                    <Send className="size-5" />
                    Enviar mi Historia a Corea
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Stories Wall */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <MessageCircle className="size-6 text-purple-600" />
              Muro de Mensajes
            </h3>
            <Badge variant="outline" className="text-slate-400 border-slate-200">
              {stories?.length || 0} historias compartidas
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {stories?.map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                  >
                    <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow rounded-3xl overflow-hidden h-full flex flex-col">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="size-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                            {story.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{story.name}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(story.createdAt).toLocaleDateString('es-MX', { 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 flex-grow">
                          <div className="relative">
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                              "{story.content}"
                            </p>
                          </div>
                          
                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2">
                              <Globe className="size-3" />
                              Traducción al Coreano
                            </div>
                            <p className="text-slate-800 font-medium text-sm leading-relaxed font-kr">
                              {story.contentKo}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between text-slate-300">
                          <Heart className="size-4 hover:text-pink-500 cursor-pointer transition-colors" />
                          <div className="h-px flex-grow mx-4 bg-slate-50" />
                          <Sparkles className="size-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isLoading && stories?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Heart className="size-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Aún no hay historias. ¡Sé el primero en compartir la tuya!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-center mt-20">
        <div className="container px-4">
          <p className="font-bold text-slate-900 mb-2">ETER K-POP MX</p>
          <p className="text-slate-400 text-sm italic">"Porque los sueños no tienen fronteras ni idiomas."</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .font-kr { font-family: 'Noto Sans KR', sans-serif; }
      `}} />
    </div>
  );
}
