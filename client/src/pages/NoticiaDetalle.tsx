import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Loader2,
  Share2,
  Globe,
  Newspaper,
} from "lucide-react";

export default function NoticiaDetalle() {
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [copied, setCopied] = useState(false);

  const { data: article, isLoading, isError } = trpc.news.getBySlug.useQuery(
    { slug },
    { enabled: !!slug, retry: 1, refetchOnWindowFocus: false }
  );

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: article?.title || "Noticia", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (date: any) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Fecha no disponible";
      return d.toLocaleDateString("es-ES", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch { return "Fecha no disponible"; }
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-emerald-400" />
          <p className="text-white/60 font-medium">Cargando noticia...</p>
        </div>
      </div>
    );
  }

  // ─── Error / No encontrado ─────────────────────────────────────────────────
  if (isError || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-black text-white mb-2">Noticia no encontrada</h2>
          <p className="text-white/60 mb-8">
            No encontramos esta noticia. Puede que haya sido eliminada o que el enlace sea incorrecto.
          </p>
          <Button
            onClick={() => navigate("/noticias")}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
          >
            <ArrowLeft className="size-4 mr-2" />
            Ver todas las noticias
          </Button>
        </div>
      </div>
    );
  }

  const paragraphs = stripHtml(article.content)
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900 pb-24">
      {/* Fondo decorativo */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20 p-4">
        <div className="container flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/noticias")}
            className="gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            Noticias
          </Button>
          <span className="text-white/70 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Newspaper className="size-4 text-emerald-400" />
            K-POP NEWS
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2 text-white hover:bg-white/20"
          >
            <Share2 className="size-4" />
            {copied ? "¡Copiado!" : "Compartir"}
          </Button>
        </div>
      </header>

      <main className="container py-10 px-4 relative z-10 max-w-4xl mx-auto">

        {/* ─── Hero imagen ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {article.image && (
            <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-8 relative shadow-2xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </div>
          )}

          {/* Fuente + Fecha */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-emerald-500/80 backdrop-blur-md text-white border-none px-4 py-1.5 text-sm font-bold uppercase tracking-widest">
              {article.source}
            </Badge>
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <Calendar className="size-4" />
              {formatDate(article.createdAt)}
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
            {article.title}
          </h1>
        </motion.div>

        {/* ─── Contenido ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Card className="bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <CardContent className="p-6 md:p-10">
              <div className="space-y-6">
                {paragraphs.map((párrafo, i) => (
                  <p
                    key={i}
                    className="text-white/85 text-base md:text-lg leading-relaxed"
                  >
                    {párrafo}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Fuente original ──────────────────────────────────────────────── */}
        {article.sourceUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-8"
          >
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 gap-2 border-2 border-emerald-400/50 text-emerald-200 hover:bg-emerald-400/10 font-bold text-base rounded-xl"
              >
                <ExternalLink className="size-5" />
                Ver Fuente Original
              </Button>
            </a>
          </motion.div>
        )}

        {/* ─── Ver más noticias ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/noticias")}
            className="text-white/50 hover:text-white hover:bg-white/10 gap-2"
          >
            <Globe className="size-4" />
            Ver todas las noticias K-POP
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
