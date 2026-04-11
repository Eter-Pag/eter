import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Loader2, Plus, Trash2, Edit2, Package, ShoppingCart, 
  MessageCircle, Newspaper, Image as ImageIcon, Search, RefreshCw,
  DollarSign, Calendar, Images, User, Phone, CheckCircle2, XCircle,
  X, Lock, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");

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
<TabsTrigger value="products" className="rounded-xl gap-2 px-4"><Package className="size-4" /> Productos</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl gap-2 px-4"><ShoppingCart className="size-4" /> Pedidos</TabsTrigger>
              <TabsTrigger value="stories" className="rounded-xl gap-2 px-4"><MessageCircle className="size-4" /> Historias</TabsTrigger>
              <TabsTrigger value="news" className="rounded-xl gap-2 px-4"><Newspaper className="size-4" /> Noticias</TabsTrigger>
              <TabsTrigger value="galleries" className="rounded-xl gap-2 px-4"><Images className="size-4" /> Galería</TabsTrigger>
              <TabsTrigger value="subscribers" className="rounded-xl gap-2 px-4"><ShieldCheck className="size-4" /> Suscriptores</TabsTrigger>
            </TabsList>
          </div>

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

          <TabsContent value="subscribers" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SubscriberManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// --- SUBSCRIBER MANAGER ---
function SubscriberManager() {
  const { data: currentPassword, refetch } = trpc.subscribers.getPassword.useQuery();
  const updateMutation = trpc.subscribers.updatePassword.useMutation();
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({ password: newPassword });
      toast.success("Contraseña de suscriptores actualizada");
      setNewPassword("");
      refetch();
    } catch (error) {
      toast.error("Error al actualizar la contraseña");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden max-w-2xl mx-auto">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
        <div className="size-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
          <Lock className="size-8 text-purple-600" />
        </div>
        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Gestión de Suscriptores</CardTitle>
        <p className="text-slate-500">Configura la contraseña que protege la Zona VIP de tu sitio web.</p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Contraseña Actual</label>
          <div className="text-2xl font-mono font-bold text-slate-900 tracking-wider">
            {currentPassword || "No configurada"}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nueva Contraseña</label>
            <Input 
              className="rounded-xl bg-slate-50 h-12 text-lg" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Ej: BTS_ARMY_2024"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isUpdating || !newPassword}
            className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isUpdating ? <Loader2 className="animate-spin size-5" /> : "Actualizar Contraseña"}
          </Button>
        </form>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
          <ShieldCheck className="size-5 text-blue-600 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Recuerda compartir esta contraseña <strong>solo</strong> en tu grupo o página de Facebook para suscriptores. 
            Si crees que se ha filtrado, cámbiala aquí inmediatamente.
          </p>
        </div>
      </CardContent>
    </Card>
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
  const { data: stories, refetch, isLoading } = trpc.stories.list.useQuery();
  
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
  const { data: news, refetch, isLoading } = trpc.news.adminGetAll.useQuery();
  const deleteMutation = trpc.news.delete.useMutation();
  const automationMutation = trpc.news.runAutomation.useMutation();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar noticia?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Noticia eliminada");
      refetch();
    } catch (error) {
      toast.error("Error al eliminar noticia");
    }
  };

  const handleRunAutomation = async () => {
    setIsGenerating(true);
    try {
      const result = await automationMutation.mutateAsync();
      toast.success(result.message || "Noticia generada exitosamente");
      await new Promise(resolve => setTimeout(resolve, 1000));
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error("Error: " + errorMessage);
      console.error("[NewsManager] Automation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Newspaper className="size-5 text-blue-600" /> Generador Automático de Noticias
          </CardTitle>
          <Button 
            onClick={handleRunAutomation} 
            disabled={isGenerating}
            className="rounded-full gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generando...
              </>
            ) : (
              <>
                <RefreshCw className="size-4" /> Generar Noticia
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-900 font-medium">
              ✨ Haz clic en el botón para generar una nueva noticia automáticamente desde Soompi o Allkpop. Las noticias se traducen al español automáticamente y se publican de inmediato.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="font-black text-slate-900">🤖 Automático</p>
              <p className="text-slate-600 text-xs mt-1">Se ejecuta cada día a las 8 AM y 8 PM</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="font-black text-slate-900">🌐 Traducido</p>
              <p className="text-slate-600 text-xs mt-1">Contenido traducido al español</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="font-black text-slate-900">🎯 Sin Duplicados</p>
              <p className="text-slate-600 text-xs mt-1">Detecta y evita noticias repetidas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Newspaper className="size-5 text-slate-900" /> Noticias Publicadas ({news?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Card key={item.id} className="border-slate-200 shadow-lg rounded-3xl overflow-hidden group hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img src={item.image || ""} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md text-white border-none font-bold text-[10px]">{item.source}</Badge>
                    {item.isPublished && <Badge className="absolute top-3 right-3 bg-green-500 text-white border-none font-bold text-[10px]">PUBLICADA</Badge>}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-black text-slate-900 leading-tight line-clamp-2 uppercase tracking-tighter text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 font-medium">{item.summary}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-400 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(Number(item.id))} className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="size-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 rounded-2xl">
              <Newspaper className="size-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No hay noticias publicadas aún. ¡Genera la primera!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- GALLERY MANAGER ---
function GalleryManager() {
  const groups = ["bts", "blackpink", "straykids", "twice", "newjeans", "ive", "txt"];
  const [selectedGroup, setSelectedGroup] = useState("bts");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: photos, refetch } = trpc.galleries.list.useQuery({ group: selectedGroup });
  const addMutation = trpc.galleries.add.useMutation();
  const deleteMutation = trpc.galleries.delete.useMutation();

  const handleAddPhoto = async () => {
    if (!photoUrl.trim()) {
      toast.error("Por favor ingresa una URL de imagen");
      return;
    }

    setIsLoading(true);
    try {
      await addMutation.mutateAsync({ group: selectedGroup, url: photoUrl });
      toast.success("Foto agregada exitosamente");
      setPhotoUrl("");
      refetch();
    } catch (error) {
      toast.error("Error al agregar la foto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Foto eliminada exitosamente");
      refetch();
    } catch (error) {
      toast.error("Error al eliminar la foto");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-slate-200 shadow-lg rounded-[2rem]">
        <CardHeader className="border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Gestor de Galerías</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Group Selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Seleccionar Grupo</label>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <Button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`rounded-full capitalize font-bold ${
                    selectedGroup === group
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {group.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Add Photo Form */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Agregar Nueva Foto</label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="rounded-xl border-slate-300"
              />
              <Button
                onClick={handleAddPhoto}
                disabled={isLoading || !photoUrl.trim()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl gap-2 px-6"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                Agregar
              </Button>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                Fotos de {selectedGroup.toUpperCase()} ({photos?.length || 0})
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="rounded-lg gap-1"
              >
                <RefreshCw className="size-3" />
                Actualizar
              </Button>
            </div>
            
            {photos && photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo: any) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt="Gallery photo"
                      className="w-full h-32 object-cover rounded-xl border border-slate-200 group-hover:border-red-400 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                      }}
                    />
                    <Button
                      onClick={() => handleDeletePhoto(photo.id)}
                      size="sm"
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <ImageIcon className="size-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">No hay fotos en {selectedGroup.toUpperCase()} aún</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
