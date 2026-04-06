import { Link } from "wouter";

interface LegalFooterProps {
  title: string;
  description: string;
  year?: number;
  storeName?: string;
}

export function LegalFooter({
  title,
  description,
  year = new Date().getFullYear(),
  storeName = "ETER KPOP",
}: LegalFooterProps) {
  return (
    <section className="py-8 md:py-10 bg-slate-100/50 border-t border-slate-200">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">
              © {year} {storeName}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* Enlaces Legales */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs">
            <Link href="/privacidad">
              <a className="text-slate-500 hover:text-slate-700 transition-colors underline">
                Aviso de Privacidad
              </a>
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/terminos">
              <a className="text-slate-500 hover:text-slate-700 transition-colors underline">
                Términos y Condiciones
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
