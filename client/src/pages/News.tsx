import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LegalFooter } from "@/components/LegalFooter";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Calendar, Loader2, Maximize2 } from "lucide-react";
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

const ARTICLES_PER_PAGE = 12;

export default function News() {
  const [, navigate] = useLocation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch all news articles using tRPC query hook
  const newsQuery = trpc.news.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: 1
  });

  // Initial load of articles
  useEffect(() => {
    if (newsQuery.data) {
      setArticles(newsQuery.data as NewsArticle[]);
      setDisplayedArticles((newsQuery.data as NewsArticle[]).slice(0, ARTICLES_PER_PAGE));
      setCurrentPage(1);
      setHasMore((newsQuery.data as NewsArticle[]).length > ARTICLES_PER_PAGE);
      setLoading(false);
    } else if (newsQuery.isError) {
      console.error("Error fetching news:", newsQuery.error);
      setLoading(false);
    } else if (!newsQuery.isLoading) {
      setLoading(false);
    }
  }, [newsQuery.data, newsQuery.isError, newsQuery.isLoading, newsQuery.error]);

  // Load more articles when user scrolls to bottom
  const loadMoreArticles = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIdx = currentPage * ARTICLES_PER_PAGE;
      const endIdx = nextPage * ARTICLES_PER_PAGE;
      const newArticles = articles.slice(startIdx, endIdx);
      
      if (newArticles.length > 0) {
        setDisplayedArticles(prev => [...prev, ...newArticles]);
        setCurrentPage(nextPage);
        setHasMore(endIdx < articles.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 300);
  }, [currentPage, articles, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreArticles, hasMore, loadingMore]);

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

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
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
          {!loading && articles.length > 0 && (
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {displayedArticles.length} de {articles.length}
            </span>
          )}
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {displayedArticles.map((article) => (
                <Card
                  key={article.id}
                  className="bg-white/60 backdrop-blur-xl border-border/50 shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Image Section */}
                    {article.image && (
                      <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-emerald-500/80 backdrop-blur-md text-white border-none text-[10px] uppercase tracking-widest">
                            {article.source}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="size-3 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {formatDate(article.createdAt)}
                        </span>
                      </div>

                      <h2 className="font-black text-lg text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
                        {article.title}
                      </h2>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                        {stripHtml(article.summary || article.content).substring(0, 150)}...
                      </p>

                      <div className="mt-auto">
                        <Button 
                          className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-xl gap-2 font-bold transition-all"
                          onClick={() => navigate(`/noticias/${article.slug}`)}
                        >
                          <Maximize2 className="size-4" />
                          Leer Noticia Completa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Infinite Scroll Trigger & Loading Indicator */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-12">
                {loadingMore && (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-6 animate-spin text-emerald-600" />
                    <p className="text-sm text-gray-500 font-medium">Cargando más noticias...</p>
                  </div>
                )}
              </div>
            )}

            {/* End of Articles Message */}
            {!hasMore && displayedArticles.length > 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-medium">
                  ✨ Has visto todas las {displayedArticles.length} noticias disponibles
                </p>
              </div>
            )}
          </>
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
