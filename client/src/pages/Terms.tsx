import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, FileText, Scale, ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import { STORE_CONFIG } from "@shared/const";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="mb-8 hover:bg-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <Card className="border-none shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-blue-600 h-2 w-full" />
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Términos y Condiciones</h1>
                <p className="text-slate-500 text-sm">Última actualización: 24 de marzo de 2026</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-500" /> ARTÍCULO 1. IDENTIDAD Y MARCO LEGAL
                </h2>
                <p>
                  El presente sitio web, identificado como <strong>{STORE_CONFIG.storeName}</strong>, es operado por <strong>DEDIKA STUDIO</strong> (en adelante "EL TITULAR"). Nuestras actividades se rigen por la legislación mexicana vigente, incluyendo la <em>Ley Federal de Protección al Consumidor</em>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 2. OBJETO Y AFILIACIÓN</h2>
                <p>
                  Este sitio es una plataforma fan-based dedicada a la cultura K-pop. Conforme al <strong>Artículo 76 Bis de la Ley Federal de Protección al Consumidor</strong>, informamos que:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Participamos en programas de afiliados (ej. Mercado Libre). EL TITULAR no es el vendedor directo ni responsable de garantías o envíos de dichos productos.</li>
                  <li>Mostramos publicidad mediante Google AdSense. EL TITULAR no controla ni garantiza el contenido de dichos anuncios.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 3. PROPIEDAD INTELECTUAL (FAN-BASED)</h2>
                <p>
                  Reconocemos que todas las marcas, nombres de grupos (ej. BTS, Stray Kids) e imágenes de artistas pertenecen exclusivamente a sus respectivas agencias de entretenimiento. Este sitio es un proyecto de fans sin afiliación oficial, operando bajo el principio de uso informativo y editorial.
                </p>
              </section>

              <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h2 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-600" /> ARTÍCULO 4. LIMITACIÓN DE RESPONSABILIDAD
                </h2>
                <p className="text-sm text-red-900">
                  EL TITULAR no se hace responsable por interrupciones técnicas, errores en la red de terceros o el uso inadecuado de las herramientas digitales gratuitas proporcionadas. El usuario asume la responsabilidad total de su navegación y transacciones con terceros enlazados.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 5. JURISDICCIÓN</h2>
                <p>
                  Para cualquier controversia, las partes se someten a las leyes de los Estados Unidos Mexicanos y a la competencia de los tribunales de la Ciudad de México, renunciando a cualquier otro fuero.
                </p>
              </section>

              <div className="pt-8 border-t border-slate-100 text-sm text-slate-400 text-center">
                © {new Date().getFullYear()} DEDIKA STUDIO | {STORE_CONFIG.storeName}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
