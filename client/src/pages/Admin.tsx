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
    price: "",
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
      const validProducts = dbProducts
        .filter((p: any) => p && p.id !== undefined && p.id !== null)
        .map((p: any) => ({
          id: p.id.toString(),
          title: p.title || "Sin título",
          description: p.description || "",
          price: p.price || "0",
          image: p.image || "",
          link: p.link || "",
          rating: p.rating ? Number(p.rating) / 10 : undefined,
          reviews: p.reviews ? Number(p.reviews) : 0,
          badge: p.badge || undefined,
        }));
      setProducts(validProducts);
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
    totalTickets: undefined,
    pricePerTicket: undefined,
    drawDate: "",
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
    if (!productFormData.title || !productFormData.image || !productFormData.link || !productFormData.price) {
      alert("Llena los campos obligatorios (Título, Imagen, Link y Precio)");
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
      setProductFormData({ title: "", description: "", price: "", image: "", link: "", rating: undefined, reviews: undefined, badge: "" });
      alert("Producto guardado correctamente");
    } catch (error) {
      alert("Error al guardar el producto");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await deleteProductMutation.mutateAsync({ id: parseInt(id) });
        await refetchProducts();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleAddRaffle = () => {
    if (!raffleFormData.title || !raffleFormData.pricePerTicket || !raffleFormData.totalTickets) {
      alert("Llena los campos obligatorios");
      return;
    }
    if (editingRaffleId) {
      confirmAddRaffle();
    } else {
      setShowRaffleWarning(true);
    }
  };

  const confirmAddRaffle = () => {
    setShowRaffleWarning(false);
    if (editingRaffleId) {
      executeRaffleMutation();
    } else {
      setShowRaffleWarningFinal(true);
    }
  };

  const finalConfirmAddRaffle = () => {
    setShowRaffleWarningFinal(false);
    executeRaffleMutation();
  };

  const executeRaffleMutation = async () => {
    try {
      if (editingRaffleId) {
        await updateRaffleMutation.mutateAsync({
          id: parseInt(editingRaffleId),
          title: raffleFormData.title!,
          description: raffleFormData.description!,
          image: raffleFormData.image!,
          totalTickets: raffleFormData.totalTickets!,
          pricePerTicket: Math.round(raffleFormData.pricePerTicket! * 100),
          drawDate: new Date(raffleFormData.drawDate!),
          webhookUrl: raffleFormData.webhookUrl!,
          category: raffleFormData.category!,
        });
        setEditingRaffleId(null);
      } else {
        await createRaffleMutation.mutateAsync({
          title: raffleFormData.title!,
          description: raffleFormData.description!,
          image: raffleFormData.image!,
          totalTickets: raffleFormData.totalTickets!,
          pricePerTicket: Math.round(raffleFormData.pricePerTicket! * 100),
          drawDate: new Date(raffleFormData.drawDate!),
          webhookUrl: raffleFormData.webhookUrl!,
          category: raffleFormData.category!,
        });
      }
      await refetchRaffles();
      setRaffleFormData({ title: "", description: "", image: "", totalTickets: undefined, pricePerTicket: undefined, drawDate: "", webhookUrl: "", category: "otro" });
      alert("Rifa guardada correctamente");
    } catch (error) {
      alert("Error al guardar la rifa");
    }
  };

  const handleDeleteRaffle = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta rifa? ¡Se perderán todos los datos!")) {
      try {
        await deleteRaffleMutation.mutateAsync({ id: parseInt(id) });
        await refetchRaffles();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleManualOrder = async () => {
    if (!manualOrderData.buyerName || !manualOrderData.buyerPhone || !manualOrderData.ticketNumbers) {
      alert("Llena los campos obligatorios");
      return;
    }
    try {
      await createManualOrderMutation.mutateAsync({
        buyerName: manualOrderData.buyerName,
        buyerPhone: manualOrderData.buyerPhone,
        buyerEmail: manualOrderData.buyerEmail,
        ticketNumbers: manualOrderData.ticketNumbers.split(",").map(n => n.trim()),
      });
      setManualOrderData({ buyerName: "", buyerPhone: "", buyerEmail: "", ticketNumbers: "" });
      await refetchTicketStats();
      await refetchAllOrders();
      alert("Orden manual creada con éxito");
    } catch (error) {
      alert("Error al crear orden: " + (error as any).message);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta orden? Los boletos volverán a estar disponibles.")) {
      try {
        await deleteOrderMutation.mutateAsync({ id });
        await refetchAllOrders();
        await refetchTicketStats();
      } catch (error) {
        alert("Error al eliminar orden");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600" />
          <CardContent className="p-8">
            <div className="flex justify-center mb-8">
              <div className="bg-slate-700 p-4 rounded-2xl">
                <ShieldCheck className="size-12 text-purple-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white text-center mb-2 uppercase tracking-tighter">Acceso Restringido</h1>
            <p className="text-slate-400 text-center text-sm mb-8 font-medium">Introduce la contraseña maestra para continuar</p>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-slate-700 border-slate-600 text-white h-14 text-center text-xl tracking-widest focus:ring-purple-500 rounded-xl"
                autoFocus
              />
              <Button onClick={handleLogin} className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm uppercase tracking-widest rounded-xl shadow-lg shadow-purple-900/20">
                Entrar al Sistema
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <LayoutDashboard className="size-5 text-white" />
          </div>
          <span className="font-black text-slate-900 uppercase tracking-tighter">Eter Admin</span>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
            <LayoutDashboard className="size-4" /> Dashboard
          </button>
          <button onClick={() => setActiveTab("raffles")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "raffles" ? "bg-purple-50 text-purple-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Ticket className="size-4" /> Rifas
          </button>
          <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "orders" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <ShoppingBag className="size-4" /> Órdenes
          </button>
          <button onClick={() => setActiveTab("products")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "products" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Package className="size-4" /> Productos
          </button>
          <button onClick={() => setActiveTab("news")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "news" ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Newspaper className="size-4" /> Noticias K-Pop
          </button>
          <button onClick={() => setActiveTab("stories")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "stories" ? "bg-pink-50 text-pink-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <ClipboardList className="size-4" /> Historias
          </button>
          <button onClick={() => setActiveTab("galleries")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "galleries" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}>
            <Images className="size-4" /> Galerías
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" onClick={() => navigate("/")} className="w-full justify-start gap-3 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-xl">
            <ArrowLeft className="size-4" /> Salir del Panel
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Dashboard</h1>
                <p className="text-slate-500 font-medium">Resumen general de tu plataforma</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                <Clock className="size-3" /> Última actualización: {new Date().toLocaleTimeString()}
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-50 p-2 rounded-lg"><DollarSign className="size-5 text-purple-600" /></div>
                    <Badge className="bg-purple-50 text-purple-700 border-none">+{allOrders?.filter(o => o.status === 'paid').length || 0}</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">${(allOrders?.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.totalAmount, 0) || 0) / 100} MXN</div>
                  <p className="text-xs text-slate-500 mt-1">Ingresos Totales</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-50 p-2 rounded-lg"><Ticket className="size-5 text-blue-600" /></div>
                    <Badge className="bg-blue-50 text-blue-700 border-none">Sold</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{ticketStats?.sold || 0}</div>
                  <p className="text-xs text-slate-500 mt-1">Boletos Vendidos</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-amber-50 p-2 rounded-lg"><Clock className="size-5 text-amber-600" /></div>
                    <Badge className="bg-amber-50 text-amber-700 border-none">Hold</Badge>
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
                      className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-widest"
                    >
                      {isAddingPhoto ? "Añadiendo..." : "Subir a Galería"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Photos Grid */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg capitalize">Fotos de {selectedGalleryGroup} ({galleryPhotos?.length || 0})</h2>
                  <Button variant="ghost" size="sm" onClick={() => refetchGallery()} className="text-slate-400 hover:text-slate-900">
                    <RefreshCw className="size-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryPhotos?.map((photo: any) => (
                    <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={photo.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="h-10 w-10 p-0 rounded-full"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!galleryPhotos || galleryPhotos.length === 0) && !isLoadingGallery && (
                    <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                      No hay fotos en esta galería.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Manual Order Form */}
              <Card className="lg:col-span-1 bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <Plus className="size-5 text-blue-600" /> Nueva Venta Manual
                  </h2>
                  <div className="space-y-3">
                    <Input placeholder="Nombre del Comprador" value={manualOrderData.buyerName} onChange={(e) => setManualOrderData({...manualOrderData, buyerName: e.target.value})} />
                    <Input placeholder="Teléfono" value={manualOrderData.buyerPhone} onChange={(e) => setManualOrderData({...manualOrderData, buyerPhone: e.target.value})} />
                    <Input placeholder="Email (Opcional)" value={manualOrderData.buyerEmail} onChange={(e) => setManualOrderData({...manualOrderData, buyerEmail: e.target.value})} />
                    <Input placeholder="Números (separados por coma, ej: 001, 002)" value={manualOrderData.ticketNumbers} onChange={(e) => setManualOrderData({...manualOrderData, ticketNumbers: e.target.value})} />
                  </div>
                  <Button onClick={handleManualOrder} className="w-full bg-blue-600 hover:bg-blue-700 h-11">Crear Orden</Button>
                </CardContent>
              </Card>

              {/* Orders List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-bold text-lg">Historial de Órdenes ({allOrders?.length || 0})</h2>
                <div className="space-y-3">
                  {allOrders?.map((order) => (
                    <Card key={order.id} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-full flex items-center justify-center font-bold ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {order.buyerName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{order.buyerName}</p>
                            <p className="text-xs text-slate-500">{order.ticketNumbers} • ${order.totalAmount / 100} MXN</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={order.status === 'paid' ? 'bg-green-100 text-green-700 border-none' : 'bg-slate-100 text-slate-600 border-none'}>
                            {order.status}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteOrder(order.id)} className="text-red-400 hover:text-red-600 h-8 w-8 p-0">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === "news" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-bold text-xl flex items-center gap-2">
                  <Newspaper className="size-6 text-amber-600" /> Noticias Automatizadas
                </h2>
                <p className="text-slate-500 text-sm">Gestiona las noticias traídas de Soompi y AllKpop</p>
              </div>
              <Button 
                onClick={handleRunAutomation} 
                disabled={isRunningAutomation}
                className="bg-amber-600 hover:bg-amber-700 gap-2 rounded-xl h-11 px-6 shadow-lg shadow-amber-100"
              >
                <Zap className={`size-4 ${isRunningAutomation ? 'animate-pulse' : ''}`} />
                {isRunningAutomation ? "Ejecutando..." : "Ejecutar Automatización"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allNews?.map((article: any) => (
                <Card key={article.id} className="bg-white border-slate-200 overflow-hidden group hover:shadow-xl transition-all rounded-[2rem]">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={article.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 border-none font-black text-[10px] uppercase tracking-widest">
                      {article.source}
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 text-sm uppercase leading-tight">{article.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><ExternalLink className="size-4" /></Button>
                        </a>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteNews(article.id)} className="h-8 w-8 p-0 text-red-400 hover:text-red-600"><Trash2 className="size-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                    placeholder="Precio (ej: 124.56)" 
                    type="text" 
                    value={productFormData.price || ""} 
                    onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} 
                  />
                  <Input placeholder="URL Imagen" value={productFormData.image || ""} onChange={(e) => setProductFormData({...productFormData, image: e.target.value})} />
                  <Input placeholder="Link Mercado Libre" value={productFormData.link || ""} onChange={(e) => setProductFormData({...productFormData, link: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Rating (0-5)" type="number" step="0.1" value={productFormData.rating || ""} onChange={(e) => setProductFormData({...productFormData, rating: parseFloat(e.target.value)})} />
                    <Input placeholder="Reviews" type="number" value={productFormData.reviews || ""} onChange={(e) => setProductFormData({...productFormData, reviews: parseInt(e.target.value)})} />
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
                    <Input placeholder="Total Boletos" type="number" value={raffleFormData.totalTickets || ""} onChange={(e) => setRaffleFormData({...raffleFormData, totalTickets: parseInt(e.target.value)})} />
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
