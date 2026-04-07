import { useState, useCallback } from 'react';

interface WikipediaResult {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
}

export function useWikipediaSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string): Promise<WikipediaResult | null> => {
      setLoading(true);
      setError(null);

      try {
        // Consultar la API de Wikipedia
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
          setError('No se encontró información');
          return null;
        }

        const result: WikipediaResult = {
          title: page.title,
          extract: page.extract || 'No hay información disponible',
          thumbnail: page.thumbnail,
        };

        setLoading(false);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    []
  );

  return { search, loading, error };
}
