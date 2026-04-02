import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket, Calendar, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getTheme } from "@shared/raffleThemes";
import { Loader } from "lucide-react";

export default function Raffles() {
  const [, navigate] = useLocation();
  const { data: activeRaffle, isLoading } = trpc.raffles.getActive.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="size-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Cargando rifa activa...</p>
        </div>
      </div>
    );
  }

  if (!activeRaffle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="bg-slate-100 size-20 rounded-full flex items-center justify-center mx-auto">
            <Ticket className="size-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">No hay rifas activas</h2>
          <p className="text-slate-500 font-medium">En este momento no hay ningún sorteo en curso. ¡Vuelve pronto para participar!</p>
          <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl px-8">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const theme = getTheme(activeRaffle.category);
  const drawDate = typeof activeRaffle.drawDate === 'string' ? new Date(activeRaffle.drawDate) : activeRaffle.drawDate;
  const isUpcoming = drawDate > new Date();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-14">
          <span className="font-bold text-sm tracking-tight">Rifa Vigente</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1 text-xs"
          >
            <ArrowLeft className="size-3" />
            Volver
          </Button>
        </div>
      </header>

      <div className="container py-12 flex justify-center">
          <Card
          className="bg-white/60 backdrop-blur-xl border-border/50 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group max-w-lg w-full"
          onClick={() => navigate(`/rifa/${activeRaffle.id}`)}
        >
          {/* Image */}
          <div className={`relative h-64 bg-gradient-to-br ${theme.gradient} overflow-hidden`}>
            <img
              src={(() => {
                const fallback = "https://images.unsplash.com/photo-1579546678181-7f1a630ec3dc?q=80&w=2071&auto=format&fit=crop";
                const first = activeRaffle.image ? activeRaffle.image.split(/[\n,]+/)[0].trim() : "";
                if (!first || typeof first !== 'string' || !first.startsWith('http')) return fallback;
                return first;
              })()}
              alt={activeRaffle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

            {/* Category Badge */}
            <div className={`absolute top-4 right-4 ${theme.buttonBg} ${theme.textColor} px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
              {theme.icon} {activeRaffle.category.toUpperCase()}
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-black italic shadow-lg">
              ACTIVA
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="font-black text-3xl text-slate-900 leading-none uppercase tracking-tighter">{activeRaffle.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {activeRaffle.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="size-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Boletos</span>
                </div>
                <p className="text-xl font-black text-slate-900">{activeRaffle.totalTickets}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="size-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio</span>
                </div>
                <p className={`text-xl font-black ${theme.accent}`}>
                  ${activeRaffle.pricePerTicket / 100}
                </p>
              </div>
            </div>

            {/* Draw Date */}
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
              <div className="flex items-center gap-3">
                <Calendar className="size-5 text-white/50" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Fecha del Sorteo</span>
                  <span className="text-sm font-bold">
                    {drawDate.toLocaleDateString("es-MX", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                Oficial
              </div>
            </div>

            {/* CTA Button */}
            <Button
              className={`w-full h-14 text-lg font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${theme.buttonBg} ${theme.buttonHover} ${theme.textColor}`}
            >
              ¡Comprar Boletos Ahora!
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
