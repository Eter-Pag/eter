import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalFooter } from "@/components/LegalFooter";
import { ArrowLeft, Calendar, ExternalLink, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  image?: string | null;
  sourceUrl?: string | null;
  source: string;
  isPublished: boolean;
  createdAt: Date;
}

export default function News() {
  const [, navigate] = useLocation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch news articles using tRPC query hook for better integration
  const newsQuery = trpc.news.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1
  });

  useEffect(() => {
    if (newsQuery.data) {
      setArticles(newsQuery.data as NewsArticle[]);
      setLoading(false);
    } else if (newsQuery.isError) {
      console.error("Error fetching news:", newsQuery.error);
      setLoading(false);
    } else if (!newsQuery.isLoading) {
      setLoading(false);
    }
  }, [newsQuery.data, newsQuery.isError, newsQuery.isLoading, newsQuery.error]);

  const formatDate = (date: any) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Fecha no disponible";
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Fecha no disponible";
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
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
            {articles.map((article) => {
              const isExpanded = expandedId === article.id;
              return (
                <Card
                  key={article.id}
                  className={`bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden transition-all duration-300 ${
                    isExpanded ? "ring-2 ring-emerald-500/20 shadow-xl" : "hover:shadow-xl"
                  }`}
                >
                  <CardContent className="p-0 flex flex-col">
                    <div className="flex flex-col md:flex-row">
                      {/* Image Section */}
                      {article.image && (
                        <div className={`relative w-full md:w-1/3 bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden transition-all duration-300 ${
                          isExpanded ? "h-64 md:h-auto" : "h-48 md:h-64"
                        }`}>
                          <img
                            src={article.image}
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
                      <div className={`p-6 flex flex-col justify-between ${article.image ? "md:w-2/3" : "w-full"}`}>
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

                          <div className={`text-gray-600 text-sm md:text-base mb-4 transition-all duration-300 ${
                            isExpanded ? "" : "line-clamp-3"
                          }`}>
                            {isExpanded ? (
                              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                {article.content.split('\n').map((paragraph, idx) => (
                                  <p key={idx}>{paragraph}</p>
                                ))}
                              </div>
                            ) : (
                              <p>{article.summary || article.content.substring(0, 200)}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => toggleExpand(article.id)}
                            className={`flex-1 gap-2 transition-all duration-300 ${
                              isExpanded 
                                ? "bg-gray-100 text-gray-900 hover:bg-gray-200" 
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                            } text-sm`}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="size-4" />
                                Leer Menos
                              </>
                            ) : (
                              <>
                                <ChevronDown className="size-4" />
                                Leer Completo
                              </>
                            )}
                          </Button>
                          {article.sourceUrl && (
                            <Button
                              onClick={() => window.open(article.sourceUrl!, "_blank")}
                              variant="outline"
                              className="gap-2 text-sm"
                            >
                              <ExternalLink className="size-4" />
                              Fuente
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
