import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalFooter } from "@/components/LegalFooter";
import { ArrowLeft, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
  isPublished: boolean;
  createdAt: Date;
}

export default function News() {
  const [, navigate] = useLocation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const result = await trpc.news.getAll.query();
        setArticles(result as NewsArticle[]);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="size-5 text-gray-700" />
            </button>
            <h1 className="font-bold text-lg">Noticias K-POP</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container py-8 md:py-12">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 mb-4">
              No hay noticias disponibles en este momento.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              <ArrowLeft className="size-4" />
              Volver al Inicio
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Image Section */}
                  {article.imageUrl && (
                    <div className="relative w-full md:w-1/3 h-48 md:h-64 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className={`p-6 flex flex-col justify-between ${article.imageUrl ? "md:w-2/3" : "w-full"}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="size-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {formatDate(article.createdAt)}
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {article.source.toUpperCase()}
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
                        {article.title}
                      </h2>

                      <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/noticias/${article.slug}`)}
                        className="flex-1 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm"
                      >
                        Leer Completo
                      </Button>
                      {article.sourceUrl && (
                        <Button
                          onClick={() => window.open(article.sourceUrl, "_blank")}
                          variant="outline"
                          className="gap-2 text-sm"
                        >
                          <ExternalLink className="size-4" />
                          Fuente
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Legal Footer */}
      <LegalFooter
        title={`© ${new Date().getFullYear()} ETER KPOP`}
        description="Las noticias mostradas en esta sección son recopiladas automáticamente de fuentes externas de K-pop y traducidas al español. ETER KPOP no es responsable del contenido original de las noticias."
        storeName="ETER KPOP"
      />
    </div>
  );
}
