import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Loader2, Plus, Trash2, Edit2, Ticket, Package, ShoppingCart, 
  MessageCircle, Newspaper, Image as ImageIcon, Search, RefreshCw,
  DollarSign, Calendar, Zap, ExternalLink, Images, User, Phone, CheckCircle2, XCircle,
  Smartphone, Wallet, Plane, Car, Gift, X, AlertTriangle
} from "lucide-react";
import { raffleThemes, type RaffleCategory } from "@shared/raffleThemes";
import { toast } from "sonner";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("raffles");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 size-10 rounded-xl flex items-center justify-center text-white font-black italic">E</div>
            <h1 className="font-black text-xl text-slate-900 tracking-tighter uppercase">Panel Eter</h1>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold px-3 py-1">ADMINISTRADOR</Badge>
        </div>
      </header>

      <main className="container px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-2 custom-scrollbar">
            <TabsList className="bg-white border border-slate-200 p-1 h-12 shadow-sm rounded-2xl w-max md:w-full flex justify-start md:justify-center">
              <TabsTrigger value="raffles" className="rounded-xl gap-2 px-4"><Ticket className="size-4" /> Rifas</TabsTrigger>
              <TabsTrigger value="products" className="rounded-xl gap-2 px-4"><Package className="size-4" /> Productos</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl gap-2 px-4"><ShoppingCart className="size-4" /> Pedidos</TabsTrigger>
              <TabsTrigger value="stories" className="rounded-xl gap-2 px-4"><MessageCircle className="size-4" /> Historias</TabsTrigger>
              <TabsTrigger value="news" className="rounded-xl gap-2 px-4"><Newspaper className="size-4" /> Noticias</TabsTrigger>
              <TabsTrigger value="galleries" className="rounded-xl gap-2 px-4"><Images className="size-4" /> Galería</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="raffles" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <RaffleManager />
          </TabsContent>

          <TabsContent value="products" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ProductManager />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <OrderManager />
          </TabsContent>

          <TabsContent value="stories" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <StoryManager />
          </TabsContent>

          <TabsContent value="news" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <NewsManager />
          </TabsContent>

          <TabsContent value="galleries" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <GalleryManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// --- RIFFLE MANAGER ---
function RaffleManager() {
  const { data: activeRaffle, refetch, isLoading } = trpc.raffles.getActive.useQuery();
  const createMutation = trpc.raffles.create.useMutation();
  const updateMutation = trpc.raffles.update.useMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    totalTickets: 100,
    pricePerTicket: 50,
    drawDate: "",
    category: "otro" as RaffleCategory,
  });

  // Cargar datos de la rifa activa si existe para editar
  useEffect(() => {
    if (activeRaffle && isEditing) {
      setFormData({
        title: activeRaffle.title,
        description: activeRaffle.description || "",
        image: activeRaffle.image || "",
        totalTickets: Number(activeRaffle.totalTickets),
        pricePerTicket: Number(activeRaffle.pricePerTicket) / 100,
        drawDate: activeRaffle.drawDate ? activeRaffle.drawDate.split('T')[0] : "",
        category: activeRaffle.category as RaffleCategory,
      });
    }
  }, [activeRaffle, isEditing]);

  const resetForm = () => {
    setIsEditing(false);
    setFormData({
      title: "",
      description: "",
      image: "",
      totalTickets: 100,
      pricePerTicket: 50,
      drawDate: "",
      category: "otro",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.image || !formData.drawDate) {
        toast.error("Por favor completa los campos obligatorios");
        return;
      }

      if (isEditing && activeRaffle) {
        await updateMutation.mutateAsync({
          id: Number(activeRaffle.id),
          ...formData,
          pricePerTicket: Math.round(formData.pricePerTicket * 100),
        });
        toast.success("¡Rifa actualizada correctamente!");
      } else {
        if (!confirm("⚠️ ATENCIÓN: Crear una nueva rifa desactivará la actual y LIMPIARÁ todos los boletos vendidos. ¿Deseas continuar?")) return;
        
        const newRaffleId = await createMutation.mutateAsync({
          ...formData,
          pricePerTicket: Math.round(formData.pricePerTicket * 100),
          raffleNumber: 1,
          isActive: true
        });
        toast.success("¡Nueva rifa creada! La anterior ha sido reemplazada.");
        // Redirigir a la página de la rifa para confirmar que existe
        window.open(`/rifa/${newRaffleId}`, '_blank');
      }
      
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden h-fit sticky top-24">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter">
            {isEditing ? <Edit2 className="size-5 text-blue-600" /> : <Plus className="size-5 text-purple-600" />}
            {isEditing ? "Editar Rifa Actual" : "Lanzar Nueva Rifa"}
          </CardTitle>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={resetForm} className="rounded-full size-8 p-0">
              <X className="size-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título del Premio</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. iPhone 15 Pro Max" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imágenes (URLs)</label>
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
                placeholder="Pega las URLs aquí (una por línea)"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cant. Boletos</label>
                <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" type="number" value={formData.totalTickets} onChange={e => setFormData({...formData, totalTickets: parseInt(e.target.value)})} disabled={isEditing} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio ($)</label>
                <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" type="number" value={formData.pricePerTicket} onChange={e => setFormData({...formData, pricePerTicket: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha del Sorteo</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" type="date" value={formData.drawDate} onChange={e => setFormData({...formData, drawDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tema Visual</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(raffleThemes).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat as RaffleCategory})}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${formData.category === cat ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-white hover:border-slate-200'}`}
                  >
                    {cat === 'dinero' && <Wallet className="size-4" />}
                    {cat === 'electronica' && <Smartphone className="size-4" />}
                    {cat === 'viajes' && <Plane className="size-4" />}
                    {cat === 'vehiculos' && <Car className="size-4" />}
                    {cat === 'kpop' && <Gift className="size-4" />}
                    {cat === 'otro' && <Zap className="size-4" />}
                    <span className="text-[8px] font-bold uppercase tracking-tighter">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" /> : (isEditing ? "Guardar Cambios" : "Lanzar Rifa")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                <Zap className="size-5 text-amber-500 fill-amber-500" /> Rifa Activa Actual
              </CardTitle>
              {activeRaffle && (
                <Badge className="bg-green-500 text-white border-none px-3 py-1 font-black italic">EN CURSO</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeRaffle ? (
              <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-48 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img src={activeRaffle.image?.split(/[\n,]+/)[0].trim() || "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop"} alt="Premio" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">{activeRaffle.title}</h3>
                    <p className="text-slate-500 font-medium mt-2">{activeRaffle.description}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Precio Boleto</p>
                      <p className="text-xl font-black text-slate-900">${Number(activeRaffle.pricePerTicket) / 100}</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Boletos</p>
                      <p className="text-xl font-black text-slate-900">{activeRaffle.totalTickets}</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sorteo</p>
                      <p className="text-xl font-black text-slate-900">{new Date(activeRaffle.drawDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3 justify-center md:justify-start">
                    <Button onClick={() => setIsEditing(true)} className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="size-4" /> Editar Detalles
                    </Button>
                    <Button variant="outline" asChild className="rounded-xl gap-2">
                      <a href="/rifa" target="_blank"><ExternalLink className="size-4" /> Ver Página</a>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="bg-slate-50 size-20 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="size-10 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 uppercase">No hay rifa activa</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">Crea una nueva rifa en el formulario de la izquierda para comenzar a vender boletos.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
              <AlertTriangle className="size-5 text-slate-400" /> Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
              <Zap className="size-6 text-amber-500 shrink-0" />
              <p className="text-sm text-amber-800 font-medium">
                Al lanzar una <strong>Nueva Rifa</strong>, el sistema desactiva automáticamente cualquier rifa anterior y <strong>borra todos los boletos vendidos</strong> de la base de datos para generar los nuevos.
              </p>
            </div>
            <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <CheckCircle2 className="size-6 text-blue-500 shrink-0" />
              <p className="text-sm text-blue-800 font-medium">
                Si solo quieres cambiar el precio, las imágenes o la fecha sin perder los boletos ya vendidos, usa el botón <strong>"Editar Detalles"</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- PRODUCT MANAGER ---
function ProductManager() {
  const { data: products, refetch, isLoading } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    link: "",
    reviews: 0,
    rating: 5,
    badge: ""
  });

  const handleEdit = (product: any) => {
    setEditingId(Number(product.id));
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price,
      image: product.image,
      link: product.link,
      reviews: Number(product.reviews) || 0,
      rating: Number(product.rating) || 5,
      badge: product.badge || ""
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", price: "", image: "", link: "", reviews: 0, rating: 5, badge: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast.success("Producto actualizado");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Producto creado");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteMutation.mutateAsync({ id });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 border-slate-200 shadow-lg rounded-3xl h-fit sticky top-24">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            {editingId ? <Edit2 className="size-5 text-blue-600" /> : <Plus className="size-5 text-purple-600" />}
            {editingId ? "Editar Producto" : "Nuevo Producto"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título</label>
              <Input className="rounded-xl bg-slate-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio (Texto)</label>
              <Input className="rounded-xl bg-slate-50" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Ej: $1,299.00" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen URL</label>
              <Input className="rounded-xl bg-slate-50" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Link Mercado Libre</label>
              <Input className="rounded-xl bg-slate-50" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reseñas</label>
                <Input className="rounded-xl bg-slate-50" type="number" value={formData.reviews} onChange={e => setFormData({...formData, reviews: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Calificación</label>
                <Input className="rounded-xl bg-slate-50" type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 rounded-xl font-black uppercase tracking-widest">Guardar</Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl">X</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {products?.map((product) => (
          <Card key={product.id} className="border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-slate-100">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              {product.badge && <Badge className="absolute top-3 right-3 bg-slate-900 text-white font-black italic">{product.badge}</Badge>}
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tighter">{product.title}</h3>
                <span className="font-black text-slate-900">{product.price}</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1 rounded-xl gap-2"><Edit2 className="size-3" /> Editar</Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(Number(product.id))} className="rounded-xl text-red-500 hover:text-red-600"><Trash2 className="size-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- ORDER MANAGER ---
function OrderManager() {
  const { data: orders, refetch, isLoading } = trpc.orders.getAll.useQuery();
  const deleteMutation = trpc.orders.delete.useMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar pedido?")) return;
    await deleteMutation.mutateAsync({ id });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <ShoppingCart className="size-5 text-slate-900" /> Historial de Ventas
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-full gap-2 font-bold"><RefreshCw className="size-3" /> Actualizar</Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Cliente</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Contacto</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Boletos</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Monto</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Estado</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                        {order.buyerName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">{order.buyerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-600"><Phone className="size-3" /> {order.buyerPhone}</div>
                      {order.buyerEmail && <div className="text-[10px] text-slate-400 font-medium">{order.buyerEmail}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(JSON.parse(order.ticketNumbers) as string[]).map(n => (
                        <Badge key={n} variant="outline" className="text-[9px] font-black bg-white">{n}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-slate-900">${order.totalAmount / 100}</TableCell>
                  <TableCell>
                    <Badge className={`font-black italic px-3 py-1 border-none ${order.status === 'paid' ? 'bg-green-500 text-white' : 'bg-amber-400 text-white'}`}>
                      {order.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(Number(order.id))} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="size-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- STORY MANAGER ---
function StoryManager() {
  const { data: stories, refetch, isLoading } = trpc.stories.getAll.useQuery();
  
  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
          <MessageCircle className="size-5 text-slate-900" /> Muro de Historias
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Nombre</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Historia (ES)</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Traducción (KO)</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest pr-6">Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stories?.map((story) => (
                <TableRow key={story.id}>
                  <TableCell className="pl-6 font-black text-slate-900 uppercase text-xs">{story.nombre}</TableCell>
                  <TableCell className="max-w-xs text-xs font-medium text-slate-600 line-clamp-2">{story.historia_es}</TableCell>
                  <TableCell className="max-w-xs text-xs font-bold text-purple-600 italic line-clamp-2">{story.historia_ko}</TableCell>
                  <TableCell className="text-[10px] text-slate-400 font-bold pr-6">{new Date(story.fecha).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- NEWS MANAGER ---
function NewsManager() {
  const { data: news, refetch, isLoading } = trpc.news.list.useQuery();
  const deleteMutation = trpc.news.delete.useMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar noticia?")) return;
    await deleteMutation.mutateAsync({ id });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news?.map((item) => (
        <Card key={item.id} className="border-slate-200 shadow-lg rounded-3xl overflow-hidden group">
          <div className="aspect-video relative overflow-hidden bg-slate-100">
            <img src={item.image || ""} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md text-white border-none font-bold text-[10px]">{item.source}</Badge>
          </div>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-black text-slate-900 leading-tight line-clamp-2 uppercase tracking-tighter">{item.title}</h3>
            <p className="text-xs text-slate-500 line-clamp-3 font-medium">{item.summary}</p>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(Number(item.id))} className="text-slate-300 hover:text-red-500 rounded-xl"><Trash2 className="size-4" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- GALLERY MANAGER ---
function GalleryManager() {
  return (
    <div className="p-12 text-center bg-white border border-slate-200 rounded-[2rem] shadow-xl space-y-4">
      <div className="bg-slate-50 size-20 rounded-full flex items-center justify-center mx-auto">
        <Images className="size-10 text-slate-300" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Gestor de Galerías</h3>
        <p className="text-slate-500 max-w-sm mx-auto font-medium">Las galerías se gestionan actualmente de forma estática en el código. Próximamente podrás subir fotos directamente desde aquí.</p>
      </div>
    </div>
  );
}
