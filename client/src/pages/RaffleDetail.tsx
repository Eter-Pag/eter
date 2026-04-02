import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Ticket, Loader2, Calendar, DollarSign, Info, ShieldCheck, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function RaffleDetail() {
  const [match, params] = useRoute("/rifa/:id");
  const [, navigate] = useLocation();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketSearch, setTicketSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(500);
  
  const { data: raffle, isLoading: isLoadingRaffle, error: raffleError } = trpc.raffles.getById.useQuery(
    { id: parseInt(params?.id || "0") },
    { enabled: !!params?.id }
  );
  
  const { data: tickets, isLoading: isLoadingTickets, refetch: refetchTickets } = trpc.tickets.list.useQuery(undefined, {
    refetchInterval: 30000 // Refrescar cada 30 segundos para ver boletos ocupados
  });

  const createCheckoutMutation = trpc.checkout.create.useMutation();

  if (isLoadingRaffle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="size-12 animate-spin text-purple-600 mb-4" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Rifa...</p>
      </div>
    );
  }

  if (raffleError || !raffle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md">
          <div className="bg-red-50 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="size-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Rifa no encontrada</h2>
          <p className="text-slate-500 mb-6">Parece que el enlace es incorrecto o la rifa ya no está disponible.</p>
          <Button onClick={() => navigate("/")} className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const handleTicketClick = (num: string, status: string) => {
    if (status !== "available") return;
    if (selectedTickets.includes(num)) {
      setSelectedTickets(selectedTickets.filter(t => t !== num));
    } else {
      setSelectedTickets([...selectedTickets, num]);
    }
  };

  const handleCheckout = async () => {
    if (selectedTickets.length === 0) {
      toast.error("Selecciona al menos un boleto");
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await createCheckoutMutation.mutateAsync({
        ticketNumbers: selectedTickets,
        buyerName: "Usuario Web", // El resto se completa en Stripe
        buyerPhone: "5500000000",
      });
      
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pago");
      setIsProcessing(false);
    }
  };

  const pricePerTicket = Number(raffle.pricePerTicket) / 100;
  const totalPrice = selectedTickets.length * pricePerTicket;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">
            <ArrowLeft className="size-4" /> Inicio
          </Button>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1 font-black uppercase text-[10px] tracking-tighter">Sorteo Activo</Badge>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Información */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
              <div className="aspect-square relative">
                <img src={raffle.image} className="w-full h-full object-cover" alt={raffle.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{raffle.title}</h1>
                  <p className="text-white/80 text-sm line-clamp-2">{raffle.description}</p>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <DollarSign className="size-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Precio</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">${pricePerTicket} <span className="text-xs font-medium text-slate-400">MXN</span></p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Calendar className="size-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sorteo</span>
                    </div>
                    <p className="text-lg font-black text-slate-900">{new Date(raffle.drawDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="bg-green-500 size-10 rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-800 uppercase tracking-widest">Pago Seguro</p>
                    <p className="text-[10px] text-green-600 font-bold">Procesado por Stripe®</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha: Boletos */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <div className="bg-slate-900 p-6 flex items-center justify-between">
                <h2 className="text-white font-black text-lg flex items-center gap-3">
                  <Ticket className="size-6 text-purple-400" /> Selecciona tus Boletos
                </h2>
                <Badge variant="outline" className="text-white border-white/20 px-3 py-1">
                  {tickets?.filter((t: any) => t.status === "available").length} Disponibles
                </Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input 
                      placeholder="Buscar número..." 
                      className="pl-11 h-12 rounded-2xl bg-slate-50 border-slate-100"
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                    />
                  </div>
                  {tickets && tickets.length > displayLimit && !ticketSearch && (
                    <Button 
                      variant="outline" 
                      onClick={() => setDisplayLimit(prev => prev + 500)}
                      className="rounded-2xl h-12 border-slate-200 font-bold"
                    >
                      Cargar más boletos
                    </Button>
                  )}
                </div>

                {isLoadingTickets ? (
                  <div className="grid grid-cols-5 md:grid-cols-8 gap-3">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {tickets
                      ?.filter((t: any) => ticketSearch ? t.number.includes(ticketSearch) : true)
                      .slice(0, ticketSearch ? undefined : displayLimit)
                      .map((t: any) => {
                        const isSelected = selectedTickets.includes(t.number);
                        const isSold = t.status === "sold";
                        const isReserved = t.status === "reserved";
                        
                        return (
                          <button
                            key={t.number}
                            disabled={isSold || isReserved}
                            onClick={() => handleTicketClick(t.number, t.status)}
                            className={`
                              aspect-square rounded-xl text-xs font-black transition-all duration-200
                              ${isSelected ? "bg-purple-600 text-white scale-95 shadow-lg shadow-purple-200" : ""}
                              ${t.status === "available" && !isSelected ? "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-105" : ""}
                              ${isSold ? "bg-red-50 text-red-300 cursor-not-allowed opacity-50" : ""}
                              ${isReserved ? "bg-amber-50 text-amber-400 cursor-not-allowed animate-pulse" : ""}
                            `}
                          >
                            {t.number}
                          </button>
                        );
                      })}
                  </div>
                )}
                
                <div className="mt-8 flex flex-wrap gap-4 justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2"><div className="size-3 bg-slate-100 rounded-full" /> Disponible</div>
                  <div className="flex items-center gap-2"><div className="size-3 bg-purple-600 rounded-full" /> Seleccionado</div>
                  <div className="flex items-center gap-2"><div className="size-3 bg-amber-200 rounded-full" /> Reservado</div>
                  <div className="flex items-center gap-2"><div className="size-3 bg-red-100 rounded-full" /> Vendido</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer Flotante para Pago */}
      <div className={`
        fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-transform duration-500 z-[100]
        ${selectedTickets.length > 0 ? "translate-y-0" : "translate-y-full"}
      `}>
        <div className="container max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex-grow flex items-center gap-4">
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-2xl font-black text-sm">
              {selectedTickets.length} Boletos
            </div>
            <div className="text-slate-900">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Total a Pagar</p>
              <p className="text-2xl font-black leading-none">${totalPrice.toLocaleString()} <span className="text-xs font-medium text-slate-400">MXN</span></p>
            </div>
          </div>
          <Button 
            disabled={isProcessing}
            onClick={handleCheckout}
            className="w-full md:w-auto px-12 h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 gap-3"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Ticket className="size-5" />}
            {isProcessing ? "Procesando..." : "Comprar Ahora"}
          </Button>
        </div>
      </div>
    </div>
  );
}
