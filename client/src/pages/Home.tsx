import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import { RAFFLE_CONFIG } from "@shared/raffle";
import {
  Search,
  Shuffle,
  CreditCard,
  Ticket,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoCount, setAutoCount] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Get active raffle
  const { data: activeRaffle, isLoading: raffleLoading } = trpc.raffles.getActive.useQuery();

  // Diploma state
  const [diplomaName, setDiplomaName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const diplomaImage = new Image();
  diplomaImage.src = "/assets/diploma.png";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    diplomaImage.onload = () => {
      canvas.width = diplomaImage.width;
      canvas.height = diplomaImage.height;
      ctx.drawImage(diplomaImage, 0, 0);
      if (diplomaName) {
        ctx.font = "bold 60px Arial"; // Ajusta la fuente y tamaño según el diseño del diploma
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(diplomaName, canvas.width / 2, canvas.height / 2 + 20); // Ajusta la posición Y
      }
    };

    // Redraw if name changes and image is already loaded
    if (diplomaImage.complete) {
      canvas.width = diplomaImage.width;
      canvas.height = diplomaImage.height;
      ctx.drawImage(diplomaImage, 0, 0);
      if (diplomaName) {
        ctx.font = "bold 60px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(diplomaName, canvas.width / 2, canvas.height / 2 + 20);
      }
    }
  }, [diplomaName]);

  const handleDownloadDiploma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `Diploma_ARMY_${diplomaName || ""}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const ticketsQuery = trpc.tickets.list.useQuery(undefined, {
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  const createCheckout = trpc.checkout.create.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirigiendo al pago...");
        window.open(data.checkoutUrl, "_blank");
      }
      setIsCheckingOut(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsCheckingOut(false);
    },
  });

  const ticketMap = useMemo(() => {
    const map = new Map<string, string>();
    if (ticketsQuery.data) {
      for (const t of ticketsQuery.data) {
        map.set(t.number, t.status);
      }
    }
    return map;
  }, [ticketsQuery.data]);

  const availableCount = useMemo(() => {
    let count = 0;
    ticketMap.forEach((status) => {
      if (status === "available") count++;
    });
    return count;
  }, [ticketMap]);

  const pricePerTicket = activeRaffle ? Number(activeRaffle.pricePerTicket) / 100 : 3;
  const totalPrice = selectedTickets.length * pricePerTicket;

  const handleSearch = useCallback(() => {
    const totalTickets = activeRaffle ? Number(activeRaffle.totalTickets) : 1000;
    const padding = totalTickets > 1000 ? 5 : totalTickets > 100 ? 4 : 3;
    const num = searchValue.padStart(padding - 1, "0");
    
    if (isNaN(Number(num))) {
      toast.error("Ingresa un número válido");
      return;
    }
    const status = ticketMap.get(num);
    if (!status || status === "available") {
      if (!selectedTickets.includes(num)) {
        if (selectedTickets.length >= 30) {
          toast.error("Máximo 30 boletos por pedido");
          return;
        }
        setSelectedTickets((prev) => [...prev, num]);
        toast.success(`Boleto ${num} agregado`);
      } else {
        toast.info(`Boleto ${num} ya está seleccionado`);
      }
    } else {
      toast.error(`Boleto ${num} no disponible (${status})`);
    }
    setSearchValue("");
  }, [searchValue, ticketMap, selectedTickets]);

  const handleAutoGenerate = useCallback(() => {
    const count = parseInt(autoCount);
    if (!count || count < 1) {
      toast.error("Ingresa una cantidad válida");
      return;
    }
    if (count + selectedTickets.length > 30) {
      toast.error("Máximo 30 boletos por pedido");
      return;
    }
    const available: string[] = [];
    ticketMap.forEach((status, number) => {
      if (status === "available" && !selectedTickets.includes(number)) {
        available.push(number);
      }
    });
    if (available.length < count) {
      toast.error(`Solo hay ${available.length} boletos disponibles`);
      return;
    }
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);
    setSelectedTickets((prev) => [...prev, ...picked]);
    toast.success(`${count} boleto(s) generados al azar`);
    setAutoCount("");
  }, [autoCount, ticketMap, selectedTickets]);

  const removeTicket = useCallback((num: string) => {
    setSelectedTickets((prev) => prev.filter((t) => t !== num));
  }, []);

  const handleCheckout = useCallback(() => {
    if (!buyerName.trim()) {
      toast.error("Ingresa tu nombre");
      return;
    }
    if (!buyerPhone.trim()) {
      toast.error("Ingresa tu teléfono");
      return;
    }
    if (buyerPhone.length !== 10) {
      toast.error("El teléfono debe tener exactamente 10 dígitos");
      return;
    }
    if (selectedTickets.length < 4) {
      toast.error("El mínimo de compra es 4 boletos");
      return;
    }
    if (selectedTickets.length > 30) {
      toast.error("El máximo de compra es 30 boletos por pedido");
      return;
    }
    setShowConfirmDialog(true);
  }, [buyerName, buyerPhone, selectedTickets]);

  const confirmCheckout = useCallback(() => {
    // Final validation before confirming
    if (selectedTickets.length < 4 || selectedTickets.length > 30) {
      toast.error("Debes seleccionar entre 4 y 30 boletos");
      return;
    }
    setShowConfirmDialog(false);
    setIsCheckingOut(true);
    createCheckout.mutate({
      ticketNumbers: selectedTickets,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerEmail: buyerEmail.trim() || undefined,
    });
  }, [selectedTickets, buyerName, buyerPhone, buyerEmail, createCheckout]);

  if (raffleLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  const images = activeRaffle?.image ? activeRaffle.image.split(/[\n,]+/).map(i => i.trim()).filter(Boolean) : [];
  const mainImage = images[0] || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container flex items-center justify-between h-12 md:h-14 px-2 md:px-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <img
              src={RAFFLE_CONFIG.logoUrl}
              alt={RAFFLE_CONFIG.storeName}
              className="h-6 w-6 md:h-8 md:w-8 rounded-lg shadow-md flex-shrink-0"
            />
            <span className="font-bold text-xs md:text-sm tracking-tight truncate">
              {RAFFLE_CONFIG.storeName}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/rifas")}
            className="gap-1 text-xs flex-shrink-0 ml-2"
          >
            ← Ver Rifas
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="text-xs font-medium gap-1 bg-white/90 backdrop-blur">
            <ShieldCheck className="size-3" />
            Pago Seguro
          </Badge>
        </div>
        <div className="relative container py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Sparkles className="size-4" />
            Sorteo Activo
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 drop-shadow-lg uppercase italic">
            {activeRaffle?.title || RAFFLE_CONFIG.name}
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            El sorteo se realizará el <strong>{activeRaffle ? new Date(activeRaffle.drawDate).toLocaleDateString() : RAFFLE_CONFIG.drawDate}</strong>
            <br />
            {activeRaffle?.description}
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-extrabold">${activeRaffle ? Number(activeRaffle.pricePerTicket) / 100 : 3}</div>
              <div className="text-xs text-white/70 font-medium uppercase tracking-widest">Por boleto</div>
            </div>
          </div>
        </div>
      </section>

      {/* Diploma Generator Section */}
      <section className="container py-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Genera tu Diploma ARMY</h2>
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-xl">
          <div className="relative w-full aspect-[3/2] mb-6">
            <canvas ref={canvasRef} className="w-full h-full object-contain"></canvas>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Ingresa tu nombre aquí"
              value={diplomaName}
              onChange={(e) => setDiplomaName(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleDownloadDiploma} disabled={!diplomaName.trim()} className="w-full sm:w-auto">
              <Download className="size-4 mr-2" /> Descargar Diploma
            </Button>
          </div>
        </div>
      </section>

      {/* Product Carousel */}
      <section className="container py-10">
        <div className="max-w-xs mx-auto">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {RAFFLE_CONFIG.images.map((img, i) => (
                <CarouselItem key={i}>
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={img}
                      alt={`Album BTS ${i + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white" />
            <CarouselNext className="right-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white" />
          </Carousel>
          <h2 className="text-xl font-bold text-center mt-6">Album BTS Original</h2>
          <p className="text-center text-3xl font-extrabold mt-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
            {RAFFLE_CONFIG.priceDisplay}
            <span className="text-sm font-medium text-muted-foreground ml-1">
              / boleto
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/check-tickets")}
            className="gap-2 mt-6 mx-auto block"
          >
            <Eye className="size-4" />
            Ya compraste tus boletos? Revísalos aquí
          </Button>
        </div>
      </section>

      {/* Buyer Info */}
      <section className="container pb-8">
        <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-xl border-border/50 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Ticket className="size-5 text-primary" />
              Tus datos
            </h3>
            <Input
              placeholder="Tu nombre completo"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
            />
            <Input
              placeholder="Tu número de teléfono (10 dígitos)"
              value={buyerPhone}
              onChange={(e) => setBuyerPhone(e.target.value)}
              type="tel"
              maxLength={10}
            />
            <Input
              placeholder="Tu correo electrónico (opcional)"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              type="email"
            />
          </CardContent>
        </Card>
      </section>

      {/* Ticket Selection */}
      <section className="container pb-16">
        <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-xl border-border/50 shadow-lg">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Shuffle className="size-5 text-primary" />
              Selecciona tus boletos
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar boleto (ej. 007)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                maxLength={3}
                className="w-full"
              />
              <Button onClick={handleSearch} disabled={!searchValue.trim()}>
                <Search className="size-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Generar N boletos al azar"
                value={autoCount}
                onChange={(e) => setAutoCount(e.target.value)}
                type="number"
                min={1}
                max={30 - selectedTickets.length}
                className="w-full"
              />
              <Button onClick={handleAutoGenerate} disabled={!autoCount || parseInt(autoCount) < 1}>
                <Shuffle className="size-4" />
              </Button>
            </div>

            {selectedTickets.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Boletos seleccionados ({selectedTickets.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTickets.map((num) => (
                    <Badge
                      key={num}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                      onClick={() => removeTicket(num)}
                    >
                      {num} <XCircle className="size-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-right text-sm font-medium mt-4">
              Total: ${totalPrice.toFixed(2)}
            </div>

            <Button
              onClick={handleCheckout}
              disabled={selectedTickets.length < 4 || isCheckingOut}
              className="w-full gap-2"
            >
              {isCheckingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CreditCard className="size-4" />
              )}
              Comprar Boletos
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Estás a punto de comprar {selectedTickets.length} boletos por un total de ${totalPrice.toFixed(2)}.
              <br />
              Nombre: {buyerName}
              <br />
              Teléfono: {buyerPhone}
              {buyerEmail && (
                <>
                  <br />
                  Email: {buyerEmail}
                </>
              )}
              <br />
              ¿Deseas continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border/50 text-center text-muted-foreground text-sm">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {RAFFLE_CONFIG.storeName}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
