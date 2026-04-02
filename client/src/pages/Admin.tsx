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
  Smartphone, Wallet, Plane, Car, Gift, X
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
  const { data: raffles, refetch, isLoading } = trpc.raffles.list.useQuery();
  const createMutation = trpc.raffles.create.useMutation();
  const updateMutation = trpc.raffles.update.useMutation();
  const deleteMutation = trpc.raffles.delete.useMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "", // Todas las imágenes aquí
    totalTickets: 100,
    pricePerTicket: 50,
    drawDate: "",
    category: "otro" as RaffleCategory,
    isActive: true
  });

  const handleEdit = (raffle: any) => {
    setEditingId(Number(raffle.id));
    setFormData({
      title: raffle.title,
      description: raffle.description || "",
      image: raffle.image || "",
      totalTickets: Number(raffle.totalTickets),
      pricePerTicket: Number(raffle.pricePerTicket) / 100,
      drawDate: raffle.drawDate ? raffle.drawDate.split('T')[0] : "",
      category: raffle.category as RaffleCategory,
      isActive: raffle.isActive === true || raffle.isActive === 'TRUE'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      totalTickets: 100,
      pricePerTicket: 50,
      drawDate: "",
      category: "otro",
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.image || !formData.drawDate) {
        toast.error("Por favor completa los campos obligatorios");
        return;
      }

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          pricePerTicket: Math.round(formData.pricePerTicket * 100),
        });
        toast.success("¡Rifa actualizada correctamente!");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          pricePerTicket: Math.round(formData.pricePerTicket * 100),
          raffleNumber: (raffles?.length || 0) + 1
        });
        toast.success("¡Rifa creada y boletos generados!");
      }
      
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro? Se borrarán todos los datos de esta rifa.")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Rifa eliminada");
      refetch();
    } catch (error: any) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter">
            {editingId ? <Edit2 className="size-5 text-blue-600" /> : <Plus className="size-5 text-purple-600" />}
            {editingId ? "Editar Rifa" : "Nueva Rifa"}
          </CardTitle>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={resetForm} className="rounded-full size-8 p-0">
              <X className="size-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. Gran Rifa de Verano" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imágenes de la Rifa (URLs)</label>
              <textarea 
                className="w-full min-h-[120px] px-3 py-2 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
                placeholder="Pega las URLs aquí (puedes poner una por línea o separarlas por comas)"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
              <p className="text-[10px] text-slate-400 italic">La primera imagen será la de portada. El resto aparecerá en el carrusel.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Boletos</label>
                <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" type="number" value={formData.totalTickets} onChange={e => setFormData({...formData, totalTickets: parseInt(e.target.value)})} disabled={!!editingId} />
                {editingId && <p className="text-[8px] text-amber-500 font-bold uppercase">No editable</p>}
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
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoría / Tema</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(raffleThemes).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat as RaffleCategory})}
                    className={`
                      p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1
                      ${formData.category === cat ? "border-purple-600 bg-purple-50" : "border-slate-100 bg-slate-50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"}
                    `}
                  >
                    <span className="text-lg">{raffleThemes[cat as RaffleCategory].icon}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className={`w-full ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"} text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg mt-4`} disabled={createMutation.isLoading || updateMutation.isLoading}>
              {(createMutation.isLoading || updateMutation.isLoading) ? <Loader2 className="animate-spin mr-2" /> : (editingId ? <Edit2 className="mr-2 size-5" /> : <Ticket className="mr-2 size-5" />)}
              {editingId ? "Actualizar Rifa" : "Generar Rifa"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter text-lg">Historial de Rifas <Badge className="bg-slate-900">{raffles?.length || 0}</Badge></h3>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {raffles?.map((raffle) => {
              const theme = raffleThemes[raffle.category as RaffleCategory] || raffleThemes.otro;
              return (
                <Card key={raffle.id} className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden group">
                  <div className={`h-2 ${theme.buttonBg}`} />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`size-12 rounded-2xl ${theme.buttonBg} flex items-center justify-center text-white text-2xl shadow-lg`}>
                        {theme.icon}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:bg-blue-50 rounded-lg" onClick={() => handleEdit(raffle)}>
                          <Edit2 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(Number(raffle.id))}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tighter mb-1 line-clamp-1">{raffle.title}</h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Calendar className="size-3" /> {new Date(raffle.drawDate).toLocaleDateString()}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Boletos</p>
                        <p className="font-black text-slate-900">{raffle.totalTickets}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio</p>
                        <p className={`font-black ${theme.accent}`}>${Number(raffle.pricePerTicket) / 100}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
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
    badge: "",
    rating: 5,
    reviews: 0
  });

  const handleEdit = (product: any) => {
    setEditingId(Number(product.id));
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price,
      image: product.image,
      link: product.link,
      badge: product.badge || "",
      rating: Number(product.rating) || 5,
      reviews: Number(product.reviews) || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "", description: "", price: "", image: "", link: "", badge: "", rating: 5, reviews: 0
    });
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
      toast.error("Error al guardar producto");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 border-slate-200 shadow-xl rounded-[2rem] bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter">
            {editingId ? <Edit2 className="size-5 text-blue-600" /> : <Plus className="size-5 text-green-600" />}
            {editingId ? "Editar Producto" : "Nuevo Producto"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre del Producto</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Precio (Texto, ej: $1,500)</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen URL</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Link de Mercado Libre / Amazon</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Badge (Opcional, ej: OFERTA)</label>
              <Input className="rounded-xl h-11 bg-slate-50 border-slate-100" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} />
            </div>
            <div className="flex gap-3">
              {editingId && (
                <Button type="button" variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={resetForm}>Cancelar</Button>
              )}
              <Button type="submit" className={`flex-[2] ${editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white rounded-xl h-12 font-bold`}>
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Productos en Tienda <Badge className="bg-slate-900">{products?.length || 0}</Badge></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map(p => (
            <Card key={p.id} className="border-none shadow-lg rounded-2xl bg-white overflow-hidden flex">
              <div className="w-24 h-24 shrink-0">
                <img src={p.image} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h5 className="font-black text-slate-900 uppercase text-xs line-clamp-1">{p.title}</h5>
                  <p className="text-green-600 font-black text-sm">{p.price}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="size-8 p-0 text-blue-500" onClick={() => handleEdit(p)}><Edit2 className="size-4" /></Button>
                  <Button variant="ghost" size="sm" className="size-8 p-0 text-red-500" onClick={() => deleteMutation.mutate(Number(p.id))}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ORDER MANAGER ---
function OrderManager() {
  const { data: orders, isLoading } = trpc.orders.getAll.useQuery();
  const deleteMutation = trpc.orders.delete.useMutation({ onSuccess: () => window.location.reload() });

  return (
    <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
      <CardHeader className="bg-slate-900 text-white p-8">
        <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
          <ShoppingCart className="size-8 text-purple-400" /> Control de Pedidos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 p-6">Comprador</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 p-6">Boletos</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 p-6">Total</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 p-6">Estado</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 p-6 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="p-6">
                  <p className="font-black text-slate-900 uppercase">{order.buyerName}</p>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-1"><Phone className="size-3" /> {order.buyerPhone}</p>
                </TableCell>
                <TableCell className="p-6">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {JSON.parse(order.ticketNumbers).map((n: string) => (
                      <Badge key={n} variant="outline" className="bg-slate-100 border-slate-200 text-slate-600 font-bold text-[10px]">{n}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="p-6 font-black text-slate-900">${order.totalAmount / 100}</TableCell>
                <TableCell className="p-6">
                  {order.status === "paid" ? (
                    <Badge className="bg-green-500 text-white font-black uppercase text-[9px]">PAGADO</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 font-black uppercase text-[9px]">PENDIENTE</Badge>
                  )}
                </TableCell>
                <TableCell className="p-6 text-right">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => deleteMutation.mutate({ id: Number(order.id) })}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// --- STORY MANAGER ---
function StoryManager() {
  const { data: stories, isLoading } = trpc.stories.list.useQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories?.map((story) => (
        <Card key={story.id} className="border-none shadow-lg rounded-3xl bg-white p-6">
          <div className="flex justify-between items-start mb-4">
            <Badge className="bg-purple-100 text-purple-700 font-black uppercase text-[10px]">{story.nombre}</Badge>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(story.fecha).toLocaleDateString()}</span>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Español</p>
              <p className="text-sm text-slate-600 italic line-clamp-3">"{story.historia_es}"</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">Traducción Coreana (IA)</p>
              <p className="text-sm text-slate-900 font-medium line-clamp-3">{story.historia_ko}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// --- PLACEHOLDERS ---
function NewsManager() { return <div className="p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase italic tracking-widest">Módulo de Noticias en mantenimiento</div>; }
function GalleryManager() { return <div className="p-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase italic tracking-widest">Módulo de Galería en mantenimiento</div>; }
