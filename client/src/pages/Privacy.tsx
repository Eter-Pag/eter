import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ShieldCheck, Lock, UserCheck, Eye } from "lucide-react";
import { useLocation } from "wouter";
import { STORE_CONFIG } from "@shared/const";

export default function Privacy() {
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
          <div className="bg-green-600 h-2 w-full" />
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-green-100 p-3 rounded-2xl">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Aviso de Privacidad Integral</h1>
                <p className="text-slate-500 text-sm">Última actualización: 24 de marzo de 2026</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
              <section className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <h2 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" /> ARTÍCULO 1. RESPONSABLE DEL TRATAMIENTO
                </h2>
                <p>
                  <strong>DEDIKA STUDIO</strong>, con domicilio para oír y recibir notificaciones en la Ciudad de México, es el responsable del tratamiento de sus datos personales en el sitio <strong>{STORE_CONFIG.storeName}</strong>, de conformidad con la <em>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</em>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 2. DATOS PERSONALES RECABADOS</h2>
                <p>
                  Para las finalidades señaladas en este aviso, podemos recabar sus datos personales de forma directa cuando usted nos los proporciona:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Identificación:</strong> Nombre completo o alias.</li>
                  <li><strong>Contacto:</strong> Correo electrónico y número de teléfono (WhatsApp).</li>
                  <li><strong>Navegación:</strong> Dirección IP, tipo de navegador y cookies (datos no sensibles).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 3. FINALIDADES DEL TRATAMIENTO</h2>
                <p>
                  Sus datos personales serán utilizados para las siguientes finalidades necesarias:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Notificación de ganadores y entrega de premios.</li>
                  <li>Atención de dudas y soporte técnico.</li>
                  <li>Mejora de la experiencia del usuario y estadísticas internas.</li>
                </ul>
              </section>

              <section className="border-l-4 border-blue-400 pl-6 py-2">
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 4. COOKIES Y PUBLICIDAD DE TERCEROS</h2>
                <p>
                  Utilizamos cookies para el funcionamiento del sitio y análisis mediante Google AdSense. Conforme al <strong>Artículo 14 de la LFPDPPP</strong>, le informamos que Google puede recopilar datos de navegación para mostrar anuncios personalizados. Usted puede deshabilitar las cookies en la configuración de su navegador.
                </p>
              </section>

              <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-500" /> ARTÍCULO 5. DERECHOS ARCO
                </h2>
                <p>
                  Usted tiene derecho a <strong>Acceder, Rectificar, Cancelar u Oponerse (ARCO)</strong> al tratamiento de sus datos personales. Para ejercer estos derechos, puede enviar una solicitud a través de nuestro canal oficial de WhatsApp ({STORE_CONFIG.whatsappNumber}) o correo electrónico, detallando su petición conforme al <strong>Artículo 29 de la LFPDPPP</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 6. TRANSFERENCIA DE DATOS</h2>
                <p>
                  EL TITULAR no transfiere sus datos personales a terceros con fines comerciales. Solo se realizarán transferencias en los casos previstos por el <strong>Artículo 37 de la LFPDPPP</strong> (cumplimiento de leyes o requerimientos judiciales).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3">ARTÍCULO 7. SEGURIDAD</h2>
                <p>
                  Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales contra daño, pérdida, alteración, destrucción o el uso, acceso o tratamiento no autorizado.
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
