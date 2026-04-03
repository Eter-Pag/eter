import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ticket, Loader2, Calendar, DollarSign, Info, ShieldCheck, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { getTheme, type RaffleCategory } from "@shared/raffleThemes";

export default function RaffleDetail({ raffleId: propRaffleId }: { raffleId?: string | number }) {
  const [match, params] = useRoute("/rifa/:id");
  const [, navigate] = useLocation();
  
  // Usar propRaffleId si se proporciona, de lo contrario usar params.id
  const rawId = propRaffleId || params?.id;
  const raffleId = rawId ? parseInt(rawId.toString()) : null;

  const { data: raffle, isLoading: isLoadingRaffle } = trpc.raffles.getById.useQuery(
    { id: raffleId! },
    { enabled: !!raffleId }
  );

  const { data: tickets, isLoading: isLoadingTickets } = trpc.tickets.list.useQuery(
    undefined,
    { enabled: !!raffleId }
  );

  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const checkoutMutation = trpc.checkout.create.useMutation();

  if (isLoadingRaffle || !raffle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="size-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Procesar campo unificado de imágenes (soporta comas y saltos de línea)
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1579546678181-7f1a630ec3dc?q=80&w=2071&auto=format&fit=crop";
  
  const sanitizeUrl = (url: string) => {
    if (!url || typeof url !== 'string') return FALLBACK_IMAGE;
    const trimmed = url.trim();
    if (!trimmed.startsWith('http')) return FALLBACK_IMAGE;
    // Evitamos usar new URL() directamente ya que puede fallar antes del catch en algunos entornos
    return trimmed;
  };

  const rawImages = raffle.image ? raffle.image.split(/[\n,]+/).map(img => img.trim()).filter(img => img !== "") : [];
  const allImages = rawImages.length > 0 ? rawImages.map(sanitizeUrl) : [FALLBACK_IMAGE];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleTicketClick = (number: string, status: string) => {
    if (status !== "available") return;
    setSelectedTickets(prev => 
      prev.includes(number) ? prev.filter(n => n !== number) : [...prev, number]
    );
  };

  const handleCheckout = async () => {
    if (selectedTickets.length === 0) {
      toast.error("Selecciona al menos un boleto");
      return;
    }

    setIsProcessing(true);
    try {
      const { url } = await checkoutMutation.mutateAsync({
        ticketNumbers: selectedTickets,
        raffleId: raffle.id ? parseInt(raffle.id) : 0
      });
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pago");
      setIsProcessing(false);
    }
  };

  const pricePerTicket = Number(raffle.pricePerTicket) / 100;
  const totalPrice = selectedTickets.length * pricePerTicket;
  const theme = getTheme(raffle.category as RaffleCategory);

  const filteredTickets = tickets?.filter(t => t.number.includes(searchTerm)) || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">
            <ArrowLeft className="size-4" /> Inicio
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-lg">{theme.icon}</span>
            <Badge className={`${theme.buttonBg} ${theme.textColor} px-3 py-1 font-black uppercase text-[10px] tracking-tighter`}>Sorteo {raffle.category}</Badge>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Información y Carrusel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{raffle.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-500 font-bold">{theme.icon} {raffle.category.toUpperCase()}</Badge>
                <Badge variant="outline" className="border-slate-200 bg-white text-slate-500 font-bold"># {raffle.raffleNumber}</Badge>
              </div>
            </div>

            {/* Carrusel Profesional */}
            <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white group ring-1 ring-slate-200">
              <img 
                src={allImages[currentImageIndex]} 
                className="w-full h-full object-cover transition-all duration-700 ease-in-out" 
                alt={raffle.title} 
              />
              
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md size-12 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                  >
                    <ChevronLeft className="size-6 text-slate-900" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-md size-12 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                  >
                    <ChevronRight className="size-6 text-slate-900" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-8 bg-white" : "w-1.5 bg-white/50"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <p className="text-slate-600 leading-relaxed text-lg font-medium">{raffle.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <DollarSign className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Precio por Boleto</span>
                    </div>
                    <p className={`text-3xl font-black ${theme.accent}`}>${pricePerTicket} <span className="text-sm font-medium text-slate-400">MXN</span></p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Calendar className="size-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Fecha del Sorteo</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{new Date(raffle.drawDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 p-5 ${theme.buttonBg}/5 rounded-3xl border border-${theme.primary}/10`}>
                  <div className={`${theme.buttonBg} size-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <ShieldCheck className="size-7" />
                  </div>
                  <div>
                    <p className={`text-sm font-black ${theme.accent} uppercase tracking-widest`}>Compra 100% Protegida</p>
                    <p className="text-xs text-slate-500 font-bold">Garantía y seguridad de Eter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Boletos */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-slate-200">
              <div className={`${theme.buttonBg} p-8 flex items-center justify-between`}>
                <div>
                  <h2 className={`${theme.textColor} font-black text-2xl flex items-center gap-3 uppercase tracking-tighter`}>
                    <Ticket className="size-8 opacity-80" /> Escoge tu Suerte
                  </h2>
                  <p className={`${theme.textColor} opacity-70 text-xs font-bold mt-1 uppercase tracking-widest`}>
                    {tickets?.filter((t: any) => t.status === "available").length} números disponibles
                  </p>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <Input 
                    placeholder="Busca tu número de la suerte..." 
                    className="pl-12 h-14 rounded-2xl bg-slate-50 border-slate-100 focus:ring-purple-500 font-bold text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingTickets ? (
                    <div className="col-span-full py-20 text-center">
                      <Loader2 className="size-10 animate-spin text-slate-200 mx-auto" />
                    </div>
                  ) : (
                    filteredTickets.map((t: any) => {
                      const isSelected = selectedTickets.includes(t.number);
                      const isSold = t.status === "sold";
                      const isReserved = t.status === "reserved";
                      
                      return (
                        <button
                          key={t.number}
                          disabled={isSold || isReserved}
                          onClick={() => handleTicketClick(t.number, t.status)}
                          className={`
                            aspect-square rounded-2xl text-sm font-black transition-all duration-300 border-2
                            ${isSelected ? `${theme.buttonBg} ${theme.textColor} border-transparent scale-95 shadow-xl shadow-${theme.primary}/30` : ""}
                            ${t.status === "available" && !isSelected ? "bg-white border-slate-100 text-slate-600 hover:border-purple-200 hover:bg-purple-50 hover:scale-105" : ""}
                            ${isSold ? "bg-slate-100 border-transparent text-slate-300 cursor-not-allowed grayscale" : ""}
                            ${isReserved ? "bg-amber-50 border-amber-100 text-amber-400 cursor-not-allowed animate-pulse" : ""}
                          `}
                        >
                          {t.number}
                        </button>
                      );
                    })
                  )}
                  {filteredTickets.length === 0 && !isLoadingTickets && (
                    <div className="col-span-full py-10 text-center text-slate-400 font-bold italic">No encontramos ese número...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Checkout Bar (Mobile) */}
      {selectedTickets.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-slate-200 p-4 md:p-6 z-50 animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
          <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
            <div className="flex-grow flex items-center gap-6">
              <div className={`${theme.buttonBg} ${theme.textColor} px-6 py-3 rounded-2xl font-black text-lg shadow-lg`}>
                {selectedTickets.length} <span className="text-xs uppercase opacity-80">Boletos</span>
              </div>
              <div className="text-slate-900">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-2">Total de tu suerte</p>
                <p className="text-3xl font-black leading-none">${totalPrice.toLocaleString()} <span className="text-sm font-medium text-slate-400">MXN</span></p>
              </div>
            </div>
            <Button 
              disabled={isProcessing}
              onClick={handleCheckout}
              className={`w-full md:w-auto px-16 h-16 ${theme.buttonBg} ${theme.buttonHover} ${theme.textColor} font-black text-xl rounded-[1.5rem] shadow-2xl transition-all hover:scale-105 active:scale-95 gap-4 shadow-${theme.primary}/20`}
            >
              {isProcessing ? <Loader2 className="animate-spin size-6" /> : <ShoppingCart className="size-6" />}
              Comprar Ahora
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
