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
  AlertCircle, Newspaper, Zap, ExternalLink, Wrench, MessageCircle, Images, Link as LinkIcon
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
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
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
          price: p.price,
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
        pricePerTicket: Number((r.pricePerTicket / 100).toFixed(2)),
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

  // Stories state
  const { data: allStories, refetch: refetchStories } = trpc.stories.list.useQuery();
  const deleteStoryMutation = trpc.stories.delete.useMutation();

  // Galleries state
  const [selectedGalleryGroup, setSelectedGalleryGroup] = useState("bts");
  const { data: galleryPhotos, refetch: refetchGallery, isLoading: isLoadingGallery } = trpc.galleries.list.useQuery({ group: selectedGalleryGroup });
  const addPhotoMutation = trpc.galleries.add.useMutation();
  const deletePhotoMutation = trpc.galleries.delete.useMutation();
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  const handleAddPhoto = async () => {
    if (!newPhotoUrl || !newPhotoUrl.startsWith("http")) {
      alert("Ingresa una URL válida");
      return;
    }
    setIsAddingPhoto(true);
    try {
      await addPhotoMutation.mutateAsync({ group: selectedGalleryGroup, url: newPhotoUrl });
      setNewPhotoUrl("");
      await refetchGallery();
      alert("Imagen añadida correctamente");
    } catch (error) {
      alert("Error al añadir la imagen");
    } finally {
      setIsAddingPhoto(false);
    }
  };

  const handleDeletePhoto = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      try {
        await deletePhotoMutation.mutateAsync({ group: selectedGalleryGroup, id });
        await refetchGallery();
        alert("Imagen eliminada correctamente");
      } catch (error) {
        alert("Error al eliminar la imagen");
      }
    }
  };

  const handleDeleteStory = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta historia?")) {
      try {
        await deleteStoryMutation.mutateAsync({ id });
        alert("Historia eliminada correctamente (puede tardar unos segundos en reflejarse en Google Sheets)");
        await refetchStories();
      } catch (error) {
        alert("Error al eliminar la historia");
      }
    }
  };

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
      setRaffleFormData({ title: "", description: "", image: "", totalTickets: 1000, pricePerTicket: undefined, drawDate: new Date().toISOString().slice(0, 16), webhookUrl: "", category: "otro" });
    } catch (error) {
      alert("Error al guardar la rifa");
    }
  };

  const handleDeleteRaffle = async (id: string) => {
    if (confirm("¿Eliminar esta rifa?")) {
      await deleteRaffleMutation.mutateAsync({ id: parseInt(id) });
      await refetchRaffles();
    }
  };

  const handleCreateManualOrder = async () => {
    if (!manualOrderData.buyerName || !manualOrderData.buyerPhone || !manualOrderData.ticketNumbers) {
      alert("Llena los campos obligatorios");
      return;
    }
    const ticketNumbers = manualOrderData.ticketNumbers.split(",").map(n => n.trim());
    try {
      await createManualOrderMutation.mutateAsync({
        buyerName: manualOrderData.buyerName,
        buyerPhone: manualOrderData.buyerPhone,
        buyerEmail: manualOrderData.buyerEmail || null,
        ticketNumbers,
      });
      alert("Venta manual registrada con éxito");
      setManualOrderData({ buyerName: "", buyerPhone: "", buyerEmail: "", ticketNumbers: "" });
      await refetchAllOrders();
      await refetchTicketStats();
    } catch (error: any) {
      alert(error.message || "Error al registrar la venta manual");
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (confirm("¿Eliminar esta orden? Los boletos volverán a estar disponibles.")) {
      await deleteOrderMutation.mutateAsync({ id });
      await refetchAllOrders();
      await refetchTicketStats();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="bg-purple-100 size-16 rounded-3xl flex items-center justify-center mb-8 mx-auto">
              <ShieldCheck className="size-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-black text-center text-slate-900 uppercase tracking-tight mb-2">Panel de Control</h1>
            <p className="text-sm text-slate-400 text-center mb-8 font-medium">Ingresa la contraseña maestra para continuar</p>
            <div className="space-y-4">
              <Input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="h-14 rounded-2xl border-slate-200 focus:ring-purple-500 text-center text-lg font-bold tracking-widest"
              />
              <Button onClick={handleLogin} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest transition-all">
                Acceder al Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-purple-600 size-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900">ADMIN</span>
        </div>

        <nav className="space-y-1 flex-1">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <LayoutDashboard className="size-4" /> Dashboard
          </button>
          <button onClick={() => setActiveTab("raffles")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "raffles" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Ticket className="size-4" /> Rifas
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
          <button onClick={() => setActiveTab("stories")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "stories" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <MessageCircle className="size-4" /> Historias
          </button>
          <button onClick={() => setActiveTab("galleries")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "galleries" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Images className="size-4" /> Galerías
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

        {/* Stories Tab */}
        {activeTab === "stories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Gestión de Historias ({allStories?.length || 0})</h2>
              <Button variant="outline" size="sm" onClick={() => refetchStories()} className="gap-2">
                <RefreshCw className="size-4" /> Actualizar
              </Button>
            </div>
            
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-[150px]">Nombre</TableHead>
                    <TableHead>Historia (ES)</TableHead>
                    <TableHead>Historia (KO)</TableHead>
                    <TableHead className="w-[120px]">Fecha</TableHead>
                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allStories?.map((story: any, index: number) => (
                    <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-900">{story.nombre}</TableCell>
                      <TableCell className="max-w-xs truncate text-slate-600" title={story.historia_es}>
                        {story.historia_es}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-400 italic" title={story.historia_ko}>
                        {story.historia_ko}
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {story.fecha ? new Date(story.fecha).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteStory(index + 2)} // index + 2 porque la fila 1 es el encabezado en Sheets
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!allStories || allStories.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                        No hay historias registradas en Google Sheets.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* Galleries Tab */}
        {activeTab === "galleries" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Photo Form */}
              <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm h-fit">
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Plus className="size-5 text-purple-600" /> Añadir a Galería
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grupo K-Pop</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["bts", "blackpink", "straykids", "twice", "newjeans", "ive"].map((group) => (
                          <Button 
                            key={group}
                            variant={selectedGalleryGroup === group ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedGalleryGroup(group)}
                            className={`capitalize text-xs h-9 ${selectedGalleryGroup === group ? "bg-purple-600" : "border-slate-200"}`}
                          >
                            {group}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL de la Imagen</label>
                      <div className="relative">
                        <Input 
                          placeholder="https://ejemplo.com/foto.jpg" 
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          className="h-12 rounded-xl border-slate-200 pr-10"
                        />
                        <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-300" />
                      </div>
                    </div>

                    <Button 
                      onClick={handleAddPhoto} 
                      disabled={isAddingPhoto || !newPhotoUrl}
                      className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 gap-2 shadow-lg shadow-purple-100"
                    >
                      {isAddingPhoto ? <RefreshCw className="size-4 animate-spin" /> : <Plus className="size-4" />}
                      Añadir a {selectedGalleryGroup.toUpperCase()}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Photos List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Images className="size-5 text-slate-400" /> 
                    Fotos en {selectedGalleryGroup.toUpperCase()} ({galleryPhotos?.length || 0})
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => refetchGallery()} className="gap-2 border-slate-200">
                    <RefreshCw className={`size-4 ${isLoadingGallery ? "animate-spin" : ""}`} /> Actualizar
                  </Button>
                </div>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                  <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50 sticky top-0 z-10">
                          <TableHead className="w-[80px]">Preview</TableHead>
                          <TableHead>URL de la Imagen</TableHead>
                          <TableHead className="w-[80px] text-right">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {galleryPhotos?.map((photo: any, index: number) => (
                            <motion.tr 
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <TableCell>
                                <div className="size-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                  <img src={photo.url} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                              </TableCell>
                              <TableCell className="max-w-md">
                                <p className="text-xs text-slate-500 truncate font-mono" title={photo.url}>
                                  {photo.url}
                                </p>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeletePhoto(index + 2)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                        {(!galleryPhotos || galleryPhotos.length === 0) && !isLoadingGallery && (
                          <TableRow>
                            <TableCell colSpan={3} className="h-40 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                <Images className="size-8 opacity-20" />
                                <p className="text-sm font-medium">No hay imágenes en esta galería.</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
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
                    <p className="text-slate-400 text-sm italic">No hay noticias publicadas</p>
                  </div>
                )}
              </div>
            </div>
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
                  <textarea 
                    placeholder="Descripción Completa del Producto" 
                    value={productFormData.description || ""} 
                    onChange={(e) => setProductFormData({...productFormData, description: e.target.value})}
                    className="w-full min-h-[120px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <Input 
                    placeholder="Precio (ej: 23.65)" 
                    type="text" 
                    value={productFormData.price ?? ""} 
                    onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} 
                  />
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

        {/* Raffles Tab */}
        {activeTab === "raffles" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Plus className="size-5 text-purple-600" /> {editingRaffleId ? "Editar Rifa" : "Nueva Rifa"}
                </h2>
                <div className="space-y-3">
                  <Input placeholder="Título de la Rifa" value={raffleFormData.title || ""} onChange={(e) => setRaffleFormData({...raffleFormData, title: e.target.value})} />
                  <textarea 
                    placeholder="Descripción de la Rifa" 
                    value={raffleFormData.description || ""} 
                    onChange={(e) => setRaffleFormData({...raffleFormData, description: e.target.value})}
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  />
                  <Input placeholder="URL Imagen Banner" value={raffleFormData.image || ""} onChange={(e) => setRaffleFormData({...raffleFormData, image: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Total Boletos" type="number" value={raffleFormData.totalTickets || 1000} onChange={(e) => setRaffleFormData({...raffleFormData, totalTickets: parseInt(e.target.value)})} />
                    <Input placeholder="Precio x Boleto (MXN)" type="number" value={raffleFormData.pricePerTicket || ""} onChange={(e) => setRaffleFormData({...raffleFormData, pricePerTicket: parseFloat(e.target.value)})} />
                  </div>
                  <Input placeholder="Fecha del Sorteo" type="datetime-local" value={raffleFormData.drawDate || ""} onChange={(e) => setRaffleFormData({...raffleFormData, drawDate: e.target.value})} />
                  <Input placeholder="Webhook URL (Opcional)" value={raffleFormData.webhookUrl || ""} onChange={(e) => setRaffleFormData({...raffleFormData, webhookUrl: e.target.value})} />
                  <select 
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    value={raffleFormData.category || "otro"}
                    onChange={(e) => setRaffleFormData({...raffleFormData, category: e.target.value as RaffleCategory})}
                  >
                    {Object.keys(raffleThemes).map(cat => (
                      <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleAddRaffle} className="w-full bg-purple-600 hover:bg-purple-700 h-11">
                  {editingRaffleId ? "Actualizar Rifa" : "Crear Nueva Rifa"}
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-bold text-lg">Rifas Activas ({raffles.length})</h2>
              <div className="grid grid-cols-1 gap-4">
                {raffles.map((raffle) => (
                  <Card key={raffle.id} className="bg-white border-slate-200 overflow-hidden hover:shadow-md transition-all">
                    <div className="flex p-4 gap-4">
                      <img src={raffle.image} className="size-32 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-900">{raffle.title}</h3>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-none">#{raffle.raffleNumber}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 mt-3 text-xs text-slate-500">
                          <div className="flex items-center gap-1"><Ticket className="size-3" /> {raffle.totalTickets} boletos</div>
                          <div className="flex items-center gap-1"><DollarSign className="size-3" /> ${raffle.pricePerTicket} MXN</div>
                          <div className="flex items-center gap-1"><Calendar className="size-3" /> {raffle.drawDate}</div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => {setRaffleFormData(raffle); setEditingRaffleId(raffle.id);}} className="flex-1 h-8 text-xs">Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteRaffle(raffle.id)} className="size-8 p-0"><Trash2 className="size-4" /></Button>
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
