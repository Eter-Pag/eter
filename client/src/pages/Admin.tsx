import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "../components/ui/badge";
import { 
  ArrowLeft, Plus, Trash2, Eye, Calendar, Copy, Check, 
  LayoutDashboard, Ticket, ShoppingBag, ClipboardList, 
  Users, TrendingUp, AlertTriangle, Search, RefreshCw, ShieldCheck,
  Clock, DollarSign, Package, MoreVertical, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, User, Phone, Mail, ChevronRight, Download, Filter,
  AlertCircle, Newspaper, Zap, ExternalLink, Wrench
} from "lucide-react";
import { raffleThemes, type RaffleCategory } from "@shared/raffleThemes";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  link: string;
  rating?: number;
  reviews: number;
  badge?: string;
}

interface Raffle {
  id: string;
  title: string;
  description: string;
  image: string;
  totalTickets: number;
  pricePerTicket: number;
  drawDate: string;
  webhookUrl: string;
  category: RaffleCategory;
  raffleNumber?: number;
}

const ADMIN_PASSWORD = "panochonas12";

export default function Admin() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    title: "",
    description: "",
    price: undefined,
    image: "",
    link: "",
    rating: undefined,
    reviews: undefined,
    badge: "",
  });

  const { data: dbProducts, refetch: refetchProducts } = trpc.products.list.useQuery();
  const createProductMutation = trpc.products.create.useMutation();
  const updateProductMutation = trpc.products.update.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();

  useEffect(() => {
    if (dbProducts) {
      setProducts(
        dbProducts.map((p) => ({
          id: p.id.toString(),
          title: p.title,
          description: p.description || "",
          price: p.price / 100,
          image: p.image,
          link: p.link,
          rating: p.rating ? p.rating / 10 : undefined,
          reviews: p.reviews,
          badge: p.badge || undefined,
        }))
      );
    }
  }, [dbProducts]);

  // Raffles state
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const { data: dbRaffles, refetch: refetchRaffles } = trpc.raffles.list.useQuery();
  const createRaffleMutation = trpc.raffles.create.useMutation();
  const updateRaffleMutation = trpc.raffles.update.useMutation();
  const deleteRaffleMutation = trpc.raffles.delete.useMutation();

  useEffect(() => {
    if (dbRaffles) {
      setRaffles(dbRaffles.map(r => ({
        id: r.id.toString(),
        title: r.title,
        description: r.description || "",
        image: r.image,
        totalTickets: r.totalTickets,
        pricePerTicket: r.pricePerTicket / 100,
        drawDate: r.drawDate.toISOString().split('T')[0],
        webhookUrl: r.webhookUrl || "",
        category: r.category as RaffleCategory,
      })));
      const maxRaffleNumber = Math.max(...dbRaffles.map(r => r.raffleNumber || 0), 0);
      setNextRaffleNumber(maxRaffleNumber + 1);
    }
  }, [dbRaffles]);

  const [raffleFormData, setRaffleFormData] = useState<Partial<Raffle>>({
    title: "",
    description: "",
    image: "",
    totalTickets: 1000,
    pricePerTicket: undefined,
    drawDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    webhookUrl: "",
    category: "otro",
  });

  // Tickets & Orders state
  const { data: ticketStats, refetch: refetchTicketStats } = trpc.tickets.getStats.useQuery();
  const { data: allTickets, refetch: refetchAllTickets } = trpc.tickets.getAll.useQuery();
  const { data: allOrders, refetch: refetchAllOrders } = trpc.orders.getAll.useQuery();
  const createManualOrderMutation = trpc.orders.createManual.useMutation();
  const deleteOrderMutation = trpc.orders.delete.useMutation();

  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showRafflePreview, setShowRafflePreview] = useState(false);
  const [showRaffleWarning, setShowRaffleWarning] = useState(false);
  const [showRaffleWarningFinal, setShowRaffleWarningFinal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingRaffleId, setEditingRaffleId] = useState<string | null>(null);
  const [copiedWebhookId, setCopiedWebhookId] = useState<string | null>(null);
  const [nextRaffleNumber, setNextRaffleNumber] = useState(1);
  const [copiedRaffleUrl, setCopiedRaffleUrl] = useState<string | null>(null);
  const [generatedWebhookUrl, setGeneratedWebhookUrl] = useState<string | null>(null);

  const [manualOrderData, setManualOrderData] = useState({
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    ticketNumbers: "",
  });

  // News state
  const { data: allNews, refetch: refetchNews } = trpc.news.adminGetAll.useQuery();
  const deleteNewsMutation = trpc.news.delete.useMutation();
  const runAutomationMutation = trpc.news.runAutomation.useMutation();
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);

  const handleDeleteNews = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta noticia?")) {
      try {
        await deleteNewsMutation.mutateAsync({ id });
        await refetchNews();
      } catch (error) {
        alert("Error al eliminar la noticia");
      }
    }
  };

  const handleRunAutomation = async () => {
    setIsRunningAutomation(true);
    try {
      await runAutomationMutation.mutateAsync();
      alert("Automatización ejecutada con éxito");
      await refetchNews();
    } catch (error) {
      alert("Error al ejecutar la automatización");
    } finally {
      setIsRunningAutomation(false);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Contraseña incorrecta");
      setPassword("");
    }
  };

  // Handlers
  const handleAddProduct = async () => {
    if (!productFormData.title || !productFormData.image || !productFormData.link || productFormData.price === undefined) {
      alert("Llena los campos obligatorios");
      return;
    }
    try {
      if (editingProductId) {
        await updateProductMutation.mutateAsync({
          id: parseInt(editingProductId),
          title: productFormData.title,
          description: productFormData.description,
          price: productFormData.price,
          image: productFormData.image,
          link: productFormData.link,
          rating: productFormData.rating,
          reviews: productFormData.reviews,
          badge: productFormData.badge,
        });
        setEditingProductId(null);
      } else {
        await createProductMutation.mutateAsync({
          title: productFormData.title,
          description: productFormData.description,
          price: productFormData.price,
          image: productFormData.image,
          link: productFormData.link,
          rating: productFormData.rating,
          reviews: productFormData.reviews,
          badge: productFormData.badge,
        });
      }
      await refetchProducts();
      setProductFormData({ title: "", description: "", price: undefined, image: "", link: "", rating: undefined, reviews: undefined, badge: "" });
    } catch (error) {
      alert("Error al guardar el producto");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Eliminar este producto?")) {
      await deleteProductMutation.mutateAsync({ id: parseInt(id) });
      await refetchProducts();
    }
  };

  const handleAddRaffle = () => {
    if (!raffleFormData.title || !raffleFormData.image || !raffleFormData.drawDate || raffleFormData.totalTickets === undefined || raffleFormData.pricePerTicket === undefined) {
      alert("Llena los campos obligatorios");
      return;
    }
    setShowRaffleWarning(true);
  };

  const confirmAddRaffle = async () => {
    setShowRaffleWarning(false);
    setShowRaffleWarningFinal(true);
  };

  const finalConfirmAddRaffle = async () => {
    setShowRaffleWarningFinal(false);
    try {
      if (editingRaffleId) {
        await updateRaffleMutation.mutateAsync({
          id: parseInt(editingRaffleId),
          title: raffleFormData.title!,
          description: raffleFormData.description!,
          image: raffleFormData.image!,
          totalTickets: raffleFormData.totalTickets!,
          pricePerTicket: raffleFormData.pricePerTicket!,
          drawDate: raffleFormData.drawDate!,
          webhookUrl: raffleFormData.webhookUrl,
          category: raffleFormData.category || "otro",
        });
        setEditingRaffleId(null);
      } else {
        await createRaffleMutation.mutateAsync({
          title: raffleFormData.title!,
          description: raffleFormData.description!,
          image: raffleFormData.image!,
          totalTickets: raffleFormData.totalTickets!,
          pricePerTicket: raffleFormData.pricePerTicket!,
          drawDate: raffleFormData.drawDate!,
          webhookUrl: raffleFormData.webhookUrl,
          category: raffleFormData.category || "otro",
          raffleNumber: nextRaffleNumber,
        });
      }
      await refetchRaffles();
      await refetchTicketStats();
      await refetchAllTickets();
    } catch (error) {
      alert("Error al guardar la rifa");
    }
  };

  const handleDeleteRaffle = async (id: string) => {
    if (confirm("¿Eliminar esta rifa? Esto NO borrará los boletos actuales.")) {
      await deleteRaffleMutation.mutateAsync({ id: parseInt(id) });
      await refetchRaffles();
    }
  };

  const handleCreateManualOrder = async () => {
    if (!manualOrderData.buyerName || !manualOrderData.buyerPhone || !manualOrderData.ticketNumbers) {
      alert("Llena los campos obligatorios");
      return;
    }
    const tickets = manualOrderData.ticketNumbers.split(",").map(t => t.trim());
    try {
      await createManualOrderMutation.mutateAsync({
        buyerName: manualOrderData.buyerName,
        buyerPhone: manualOrderData.buyerPhone,
        buyerEmail: manualOrderData.buyerEmail || null,
        ticketNumbers: tickets,
      });
      alert("Orden manual creada con éxito");
      setManualOrderData({ buyerName: "", buyerPhone: "", buyerEmail: "", ticketNumbers: "" });
      await refetchAllOrders();
      await refetchAllTickets();
      await refetchTicketStats();
    } catch (error: any) {
      alert(error.message || "Error al crear orden manual");
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (confirm("¿Eliminar esta orden? Los boletos volverán a estar disponibles.")) {
      await deleteOrderMutation.mutateAsync({ id });
      await refetchAllOrders();
      await refetchAllTickets();
      await refetchTicketStats();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-slate-200 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-purple-100 size-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="size-8 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
              <p className="text-slate-500 text-sm">Ingresa la contraseña maestra para continuar</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-12 text-center text-lg tracking-widest"
              />
              <Button onClick={handleLogin} className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg font-bold">
                Acceder al Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-purple-600 p-2 rounded-lg">
            <LayoutDashboard className="size-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">ETER Admin</span>
        </div>
        
        <nav className="space-y-1">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <LayoutDashboard className="size-4" /> Dashboard
          </button>
          <button onClick={() => setActiveTab("raffles")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "raffles" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Ticket className="size-4" /> Rifas
          </button>
          <button onClick={() => setActiveTab("tickets")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "tickets" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <ClipboardList className="size-4" /> Boletos
          </button>
          <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "orders" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <ShoppingBag className="size-4" /> Órdenes
          </button>
          <button onClick={() => setActiveTab("products")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "products" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Package className="size-4" /> Productos
          </button>
          <button onClick={() => setActiveTab("news")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "news" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Newspaper className="size-4" /> Noticias
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full justify-start gap-3 text-slate-500 hover:text-red-600 hover:bg-red-50">
            <ArrowLeft className="size-4" /> Salir al Sitio
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm">Gestiona el contenido de ETER KPOP MX</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white py-1.5 px-3 border-slate-200 text-slate-600 gap-2">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" /> Sistema Online
            </Badge>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 p-2 rounded-lg"><Ticket className="size-5 text-blue-600" /></div>
                    <Badge className="bg-blue-50 text-blue-700 border-none">Total</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{ticketStats?.total || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">Boletos Generados</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-50 p-2 rounded-lg"><TrendingUp className="size-5 text-green-600" /></div>
                    <Badge className="bg-green-50 text-green-700 border-none">Vendido</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{ticketStats?.sold || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">Boletos Pagados</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-50 p-2 rounded-lg"><Clock className="size-5 text-amber-600" /></div>
                    <Badge className="bg-amber-50 text-amber-700 border-none">Pendiente</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{ticketStats?.reserved || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">Boletos Reservados</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-slate-50 p-2 rounded-lg"><Search className="size-5 text-slate-600" /></div>
                    <Badge className="bg-slate-50 text-slate-700 border-none">Libre</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{ticketStats?.available || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">Boletos Disponibles</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <ShoppingBag className="size-5 text-purple-600" /> Últimas Órdenes
                  </h2>
                  <div className="space-y-4">
                    {allOrders?.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 size-10 rounded-full flex items-center justify-center font-bold text-slate-600">
                            {order.buyerName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900">{order.buyerName}</p>
                            <p className="text-xs text-slate-500">{order.ticketCount} boletos • ${order.totalAmount / 100} MXN</p>
                          </div>
                        </div>
                        <Badge className={order.status === 'paid' ? 'bg-green-100 text-green-700 border-none' : 'bg-slate-100 text-slate-600 border-none'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                    {(!allOrders || allOrders.length === 0) && <p className="text-center py-8 text-slate-400 text-sm italic">No hay órdenes recientes</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <AlertTriangle className="size-5 text-amber-600" /> Acciones Rápidas
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setActiveTab("raffles")} className="h-24 flex-col gap-2 border-slate-200 hover:bg-purple-50 hover:border-purple-200 group">
                      <Plus className="size-6 text-slate-400 group-hover:text-purple-600" />
                      <span className="text-xs font-bold text-slate-600">Nueva Rifa</span>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("orders")} className="h-24 flex-col gap-2 border-slate-200 hover:bg-blue-50 hover:border-blue-200 group">
                      <ShoppingBag className="size-6 text-slate-400 group-hover:text-blue-600" />
                      <span className="text-xs font-bold text-slate-600">Venta Manual</span>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("products")} className="h-24 flex-col gap-2 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 group">
                      <Package className="size-6 text-slate-400 group-hover:text-emerald-600" />
                      <span className="text-xs font-bold text-slate-600">Nuevo Producto</span>
                    </Button>
                    <Button variant="outline" onClick={() => refetchTicketStats()} className="h-24 flex-col gap-2 border-slate-200 hover:bg-slate-50 group">
                      <RefreshCw className="size-6 text-slate-400 group-hover:text-slate-900" />
                      <span className="text-xs font-bold text-slate-600">Refrescar Datos</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Zap className="size-5 text-amber-500" /> Automatización
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ejecuta el proceso de obtención y traducción de noticias de K-pop inmediatamente.
                  </p>
                  <Button 
                    onClick={handleRunAutomation} 
                    disabled={isRunningAutomation}
                    className="w-full bg-amber-500 hover:bg-amber-600 h-11 gap-2"
                  >
                    {isRunningAutomation ? <RefreshCw className="size-4 animate-spin" /> : <Zap className="size-4" />}
                    {isRunningAutomation ? "Ejecutando..." : "Ejecutar runNewsAutomationNow()"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Wrench className="size-5 text-blue-600" /> Herramientas Útiles
                  </h2>
                  <div className="space-y-2">
                    <a href="https://www.soompi.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
                      <span className="text-sm font-medium">Soompi (Fuente)</span>
                      <ExternalLink className="size-4 text-slate-400 group-hover:text-blue-600" />
                    </a>
                    <a href="https://www.allkpop.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
                      <span className="text-sm font-medium">Allkpop (Fuente)</span>
                      <ExternalLink className="size-4 text-slate-400 group-hover:text-blue-600" />
                    </a>
                    <a href="https://translate.google.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group">
                      <span className="text-sm font-medium">Google Translate</span>
                      <ExternalLink className="size-4 text-slate-400 group-hover:text-blue-600" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">Noticias Publicadas ({allNews?.length || 0})</h2>
                <Button variant="outline" size="sm" onClick={() => refetchNews()} className="gap-2">
                  <RefreshCw className="size-4" /> Actualizar
                </Button>
              </div>
              <div className="space-y-4">
                {allNews?.map((article) => (
                  <Card key={article.id} className="bg-white border-slate-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="flex p-4 gap-4">
                      {article.image && (
                        <img src={article.image} className="size-24 rounded-xl object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900 line-clamp-1">{article.title}</h3>
                          <Badge variant="outline" className="text-[10px] uppercase">{article.source}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{article.summary}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="size-3" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2 ml-auto">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteNews(article.id)} 
                              className="h-7 text-[10px] px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-3 mr-1" /> Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {(!allNews || allNews.length === 0) && (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <Newspaper className="size-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No hay noticias registradas</p>
                    <p className="text-xs text-slate-400 mt-1">Ejecuta la automatización para obtener noticias</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Raffles Tab */}
        {activeTab === "raffles" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="size-5 text-purple-600" /> {editingRaffleId ? "Editar Rifa" : "Nueva Rifa"}
                </h2>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Información Básica</label>
                  <Input placeholder="Título de la Rifa" value={raffleFormData.title || ""} onChange={(e) => setRaffleFormData({...raffleFormData, title: e.target.value})} />
                  <Input placeholder="Descripción" value={raffleFormData.description || ""} onChange={(e) => setRaffleFormData({...raffleFormData, description: e.target.value})} />
                  <Input placeholder="URL Imagen" value={raffleFormData.image || ""} onChange={(e) => setRaffleFormData({...raffleFormData, image: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Configuración</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Boletos" type="number" value={raffleFormData.totalTickets || 1000} onChange={(e) => setRaffleFormData({...raffleFormData, totalTickets: parseInt(e.target.value)})} />
                    <Input placeholder="Precio $" type="number" step="0.01" value={raffleFormData.pricePerTicket ?? ""} onChange={(e) => setRaffleFormData({...raffleFormData, pricePerTicket: e.target.value === "" ? undefined : parseFloat(e.target.value)})} />
                  </div>
                  <Input type="datetime-local" value={raffleFormData.drawDate || ""} onChange={(e) => setRaffleFormData({...raffleFormData, drawDate: e.target.value})} />
                  <select value={raffleFormData.category || "otro"} onChange={(e) => setRaffleFormData({...raffleFormData, category: e.target.value as RaffleCategory})} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm">
                    <option value="dinero">💰 Dinero</option>
                    <option value="electronica">📱 Electrónica</option>
                    <option value="herramientas">🔧 Herramientas</option>
                    <option value="kpop">🎤 K-POP</option>
                    <option value="moda">👗 Moda</option>
                    <option value="otro">🎁 Otro</option>
                  </select>
                </div>
                <Button onClick={handleAddRaffle} className="w-full bg-purple-600 hover:bg-purple-700 h-11">
                  {editingRaffleId ? "Actualizar Rifa" : "Crear Nueva Rifa"}
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-lg">Rifas Registradas ({raffles.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {raffles.map((raffle) => (
                  <Card key={raffle.id} className="bg-white border-slate-200 overflow-hidden hover:shadow-md transition-all">
                    <img src={raffle.image} className="h-32 w-full object-cover" />
                    <CardContent className="p-4">
                      <h3 className="font-bold text-slate-900 line-clamp-1">{raffle.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">${raffle.pricePerTicket} MXN • {raffle.totalTickets} boletos</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => {setRaffleFormData(raffle); setEditingRaffleId(raffle.id);}} className="flex-1">Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteRaffle(raffle.id)} className="size-9 p-0"><Trash2 className="size-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-bold text-lg">Listado Maestro de Boletos</h2>
                  <Button variant="outline" size="sm" onClick={() => refetchAllTickets()} className="gap-2">
                    <RefreshCw className="size-4" /> Actualizar
                  </Button>
                </div>
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="w-24">Número</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead className="text-right">ID Orden</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allTickets?.slice(0, 50).map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono font-bold">{ticket.number}</TableCell>
                          <TableCell>
                            <Badge className={
                              ticket.status === 'sold' ? 'bg-green-100 text-green-700 border-none' :
                              ticket.status === 'reserved' ? 'bg-amber-100 text-amber-700 border-none' :
                              'bg-slate-100 text-slate-600 border-none'
                            }>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{ticket.buyerName || '-'}</TableCell>
                          <TableCell className="text-slate-600">{ticket.buyerPhone || '-'}</TableCell>
                          <TableCell className="text-right text-slate-400">#{ticket.orderId || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {allTickets && allTickets.length > 50 && (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50">
                      Mostrando los primeros 50 boletos de {allTickets.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm h-fit">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="size-5 text-blue-600" /> Crear Orden Manual
                </h2>
                <p className="text-xs text-slate-500">Registra ventas realizadas fuera de la plataforma (efectivo, transferencia).</p>
                <div className="space-y-3 pt-2">
                  <Input placeholder="Nombre del Comprador" value={manualOrderData.buyerName} onChange={e => setManualOrderData({...manualOrderData, buyerName: e.target.value})} />
                  <Input placeholder="Teléfono (10 dígitos)" value={manualOrderData.buyerPhone} onChange={e => setManualOrderData({...manualOrderData, buyerPhone: e.target.value})} />
                  <Input placeholder="Email (Opcional)" value={manualOrderData.buyerEmail} onChange={e => setManualOrderData({...manualOrderData, buyerEmail: e.target.value})} />
                  <Input placeholder="Números (ej: 001, 045, 999)" value={manualOrderData.ticketNumbers} onChange={e => setManualOrderData({...manualOrderData, ticketNumbers: e.target.value})} />
                </div>
                <Button onClick={handleCreateManualOrder} className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                  Registrar Venta Manual
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg mb-6">Historial de Órdenes</h2>
                <div className="space-y-4">
                  {allOrders?.map(order => (
                    <div key={order.id} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-slate-400 uppercase">Orden #{order.id}</span>
                          <h4 className="font-bold text-slate-900">{order.buyerName}</h4>
                        </div>
                        <Badge className={order.status === 'paid' ? 'bg-green-100 text-green-700 border-none' : 'bg-slate-100 text-slate-600 border-none'}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1"><Ticket className="size-3" /> {order.ticketCount} boletos</div>
                        <div className="flex items-center gap-1"><TrendingUp className="size-3" /> ${order.totalAmount / 100} MXN</div>
                        <div className="flex items-center gap-1"><Calendar className="size-3" /> {new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <code className="text-xs bg-white px-2 py-1 rounded border border-slate-100">{JSON.parse(order.ticketNumbers).join(", ")}</code>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8">
                          <Trash2 className="size-4 mr-2" /> Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="size-5 text-blue-600" /> {editingProductId ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <div className="space-y-3">
                  <Input placeholder="Título del Producto" value={productFormData.title || ""} onChange={(e) => setProductFormData({...productFormData, title: e.target.value})} />
                  <Input placeholder="Descripción" value={productFormData.description || ""} onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} />
                  <Input placeholder="Precio (MXN)" type="number" step="0.01" value={productFormData.price ?? ""} onChange={(e) => setProductFormData({...productFormData, price: e.target.value === "" ? undefined : parseFloat(e.target.value)})} />
                  <Input placeholder="URL Imagen" value={productFormData.image || ""} onChange={(e) => setProductFormData({...productFormData, image: e.target.value})} />
                  <Input placeholder="Link Mercado Libre" value={productFormData.link || ""} onChange={(e) => setProductFormData({...productFormData, link: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Rating (0-5)" type="number" step="0.1" value={productFormData.rating || 4.5} onChange={(e) => setProductFormData({...productFormData, rating: parseFloat(e.target.value)})} />
                    <Input placeholder="Reviews" type="number" value={productFormData.reviews || 0} onChange={(e) => setProductFormData({...productFormData, reviews: parseInt(e.target.value)})} />
                  </div>
                  <Input placeholder="Badge (ej: Nuevo)" value={productFormData.badge || ""} onChange={(e) => setProductFormData({...productFormData, badge: e.target.value})} />
                </div>
                <Button onClick={handleAddProduct} className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                  {editingProductId ? "Actualizar Producto" : "Agregar Producto"}
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-lg">Productos en Tienda ({products.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="bg-white border-slate-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="flex p-4 gap-4">
                      <img src={product.image} className="size-24 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 line-clamp-2 text-sm">{product.title}</h3>
                        <p className="text-sm font-bold text-blue-600 mt-1">${product.price} MXN</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" onClick={() => {setProductFormData(product); setEditingProductId(product.id);}} className="flex-1 h-8 text-xs">Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)} className="size-8 p-0"><Trash2 className="size-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Warning Dialogs for Raffle Creation */}
      <Dialog open={showRaffleWarning} onOpenChange={setShowRaffleWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="size-6" /> 🚨 ¡OYE, TONTUELO! 🚨
            </DialogTitle>
            <DialogDescription className="pt-4 text-slate-600">
              ¿ESTÁS SEGURO DE QUE QUIERES BORRAR TODA LA RIFA ANTERIOR?
              <ul className="list-disc list-inside mt-3 space-y-1 font-medium">
                <li>Se borrarán TODOS los boletos de la rifa anterior.</li>
                <li>Se creará una NUEVA rifa desde cero.</li>
                <li>¡NO HAY VUELTA ATRÁS! 💥</li>
              </ul>
              <p className="mt-4 font-bold text-slate-900">¿Sigues queriendo continuar o ya te dio miedo?</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRaffleWarning(false)}>Cancelar</Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={confirmAddRaffle}>Sí, entiendo los riesgos</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRaffleWarningFinal} onOpenChange={setShowRaffleWarningFinal}>
        <DialogContent className="max-w-md border-2 border-red-500">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="size-6" /> ⚠️ SEGUNDA ADVERTENCIA (porque eres muy atrevido) ⚠️
            </DialogTitle>
            <DialogDescription className="pt-4 text-slate-900 font-bold text-lg">
              ¡No digas que no te lo advertí, tontuelo! 😱
              <p className="text-sm font-normal text-slate-600 mt-2">
                Si hay gente con boletos pagados, ¡se van a enojar mucho! (Si dices que sí, no me culpes después 😏).
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRaffleWarningFinal(false)}>¡Esperar, me dio miedo! 😅</Button>
            <Button variant="destructive" onClick={finalConfirmAddRaffle}>¡DALE, SIN MIEDO AL ÉXITO! 🔥</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
