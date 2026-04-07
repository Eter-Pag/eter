import { useState, useCallback } from 'react';

export interface SearchResult {
  title: string;
  extract: string;
  thumbnail?: string;
  source: 'wikipedia' | 'google';
  googleSearchUrl?: string;
}

export function useWikipediaSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWikipedia = useCallback(async (query: string): Promise<SearchResult | null> => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro&explaintext&piprop=thumbnail&pithumbsize=100&titles=${encodeURIComponent(
          query
        )}&origin=*`
      );

      if (!response.ok) {
        throw new Error('Error al consultar Wikipedia');
      }

      const data = await response.json();
      const pages = data.query.pages;
      const page = Object.values(pages)[0] as any;

      if (page.missing !== undefined) {
        return null;
      }

      const result: SearchResult = {
        title: page.title,
        extract: page.extract || 'No hay información disponible',
        thumbnail: page.thumbnail?.source,
        source: 'wikipedia',
      };

      return result;
    } catch (err) {
      console.error('Error en búsqueda de Wikipedia:', err);
      return null;
    }
  }, []);

  const search = useCallback(
    async (query: string): Promise<SearchResult | null> => {
      setLoading(true);
      setError(null);

      try {
        // Primero intentar con Wikipedia
        const wikiResult = await searchWikipedia(query);
        
        if (wikiResult && wikiResult.extract && wikiResult.extract !== 'No hay información disponible') {
          setLoading(false);
          return wikiResult;
        }

        // Si Wikipedia no tiene información, preparar fallback a Google
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
          query + ' K-Pop'
        )}`;

        const googleResult: SearchResult = {
          title: query,
          extract: `No encontramos información en Wikipedia. Haz clic en "Buscar en Google" para encontrar más detalles sobre ${query}.`,
          source: 'google',
          googleSearchUrl,
        };

        setLoading(false);
        return googleResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [searchWikipedia]
  );

  return { search, loading, error };
}
