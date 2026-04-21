import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
  X, Lock, ShieldCheck, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { PhotocardCreator } from "@/components/PhotocardCreator";

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
              <TabsTrigger value="photocards" className="rounded-xl gap-2 px-4"><Sparkles className="size-4" /> Photocards</TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-xl gap-2 px-4"><Calendar className="size-4" /> Calendario</TabsTrigger>
              <TabsTrigger value="app-events" className="rounded-xl gap-2 px-4"><RefreshCw className="size-4" /> App Events</TabsTrigger>
              <TabsTrigger value="eventos" className="rounded-xl gap-2 px-4"><Calendar className="size-4" /> Eventos Blog</TabsTrigger>
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

          <TabsContent value="photocards" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <PhotocardCreator />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CalendarManager />
          </TabsContent>

          <TabsContent value="app-events" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AppEventManager />
          </TabsContent>

          <TabsContent value="eventos" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <EventoManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// --- APP EVENT MANAGER ---
function AppEventManager() {
  const { data: events, refetch } = trpc.appEvents.getAll.useQuery();
  const createMutation = trpc.appEvents.create.useMutation();
  const updateMutation = trpc.appEvents.update.useMutation();
  const deleteMutation = trpc.appEvents.delete.useMutation();

  const emptyForm = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear() as number | null,
    title: "",
    type: "bts" as "bts" | "personal",
    summary: "",
    url: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (ev: any) => {
    const recurring = ev.year === null || ev.year === 0;
    setEditingId(ev.id);
    setIsRecurring(recurring);
    setFormData({
      day: ev.day,
      month: Number(ev.month),
      year: recurring ? new Date().getFullYear() : ev.year,
      title: ev.title || "",
      type: ev.type || "bts",
      summary: ev.summary || "",
      url: ev.url || "",
    });
    // scroll al formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsRecurring(false);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setIsSaving(true);
    const payload = { ...formData, year: isRecurring ? null : formData.year };
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        toast.success("Evento actualizado");
        setEditingId(null);
        setFormData(emptyForm);
        setIsRecurring(false);
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Evento creado exitosamente");
        setFormData({ ...emptyForm });
      }
      refetch();
    } catch (error) {
      toast.error(editingId ? "Error al actualizar" : "Error al crear el evento");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Evento eliminado");
      if (editingId === id) handleCancelEdit();
      refetch();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* ── Formulario ── */}
      <Card className={`md:col-span-1 border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden h-fit transition-all ${
        editingId ? 'ring-2 ring-amber-400 ring-offset-2' : ''
      }`}>
        <CardHeader className={`border-b border-slate-100 p-6 ${
          editingId ? 'bg-amber-50' : 'bg-slate-50'
        }`}>
          <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            {editingId
              ? <><Edit2 className="size-5 text-amber-500" /> Editando Evento</>
              : <><Plus className="size-5 text-indigo-600" /> Nuevo Evento</>
            }
          </CardTitle>
          {editingId && (
            <p className="text-[10px] text-amber-600 font-bold uppercase mt-1">Modifica los campos y guarda los cambios</p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Día</label>
                <Input type="number" min="1" max="31" value={formData.day} onChange={e => setFormData({...formData, day: Number(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Año</label>
                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => setIsRecurring(!isRecurring)}
                    className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${isRecurring ? 'bg-indigo-500' : 'bg-slate-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isRecurring ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Recurrente</span>
                </div>
                {!isRecurring && (
                  <Input type="number" value={formData.year ?? new Date().getFullYear()} onChange={e => setFormData({...formData, year: Number(e.target.value)})} />
                )}
                {isRecurring && (
                  <div className="h-10 flex items-center px-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600">Cada año ♾</div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Mes</label>
              <select
                className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-sm"
                value={formData.month}
                onChange={e => setFormData({...formData, month: Number(e.target.value)})}
              >
                {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Título del Evento</label>
              <Input placeholder="Ej: Cumpleaños de Jungkook" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Tipo</label>
              <select
                className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-sm"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as "bts" | "personal"})}
              >
                <option value="bts">BTS</option>
                <option value="personal">Personal</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Resumen <span className="text-slate-300 normal-case font-normal">(descripción corta)</span></label>
              <textarea
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm min-h-[72px] resize-none"
                placeholder="Ej: La espera ha terminado, BTS anuncia..."
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">URL <span className="text-slate-300 normal-case font-normal">(enlace del evento)</span></label>
              <Input placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
            </div>
            <div className="flex gap-2">
              <Button
                disabled={isSaving}
                className={`flex-1 text-white rounded-xl h-11 uppercase font-black tracking-widest text-xs ${
                  editingId
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isSaving
                  ? <Loader2 className="animate-spin size-4" />
                  : editingId ? "Guardar Cambios" : "Publicar en App"
                }
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="rounded-xl border-slate-200 font-black text-slate-500"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Tabla ── */}
      <Card className="md:col-span-2 border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <RefreshCw className="size-5 text-indigo-600" /> Eventos Programados
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => refetch()}><RefreshCw className="size-4" /></Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Fecha</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Evento</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Resumen / URL</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((ev: any) => (
                <TableRow
                  key={ev.id}
                  className={editingId === ev.id ? 'bg-amber-50/60' : ''}
                >
                  <TableCell className="font-bold text-slate-600 whitespace-nowrap">
                    {ev.day} {MESES[Number(ev.month) - 1]}{" "}
                    {ev.year === null || ev.year === 0
                      ? <span className="text-indigo-500 text-[10px] font-black">♾ RECURRENTE</span>
                      : ev.year
                    }
                  </TableCell>
                  <TableCell className="font-medium">{ev.title}</TableCell>
                  <TableCell className="max-w-[180px]">
                    {ev.summary && <p className="text-xs text-slate-500 truncate mb-1">{ev.summary}</p>}
                    {ev.url && <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-500 hover:underline truncate block">{ev.url}</a>}
                    {!ev.summary && !ev.url && <span className="text-slate-300 text-xs italic">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editingId === ev.id ? handleCancelEdit() : handleEdit(ev)}
                        className={`${
                          editingId === ev.id
                            ? 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                      >
                        {editingId === ev.id ? <X className="size-4" /> : <Edit2 className="size-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ev.id)}
                        className="text-red-400 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!events || events.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400 italic">No hay eventos remotos programados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- CALENDAR MANAGER ---
function CalendarManager() {
  const { data: calendar, refetch } = trpc.subscribers.getCalendar.useQuery();
  const updateMutation = trpc.subscribers.updateCalendar.useMutation();
  const [formData, setFormData] = useState({
    pdfUrl: "",
    imageUrl: "",
    month: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (calendar) {
      setFormData({
        pdfUrl: calendar.pdfUrl || "",
        imageUrl: calendar.imageUrl || "",
        month: calendar.month || ""
      });
    }
  }, [calendar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Configuración del calendario actualizada");
      refetch();
    } catch (error) {
      toast.error("Error al actualizar el calendario");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden max-w-2xl mx-auto">
      <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
        <div className="size-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
          <Calendar className="size-8 text-pink-600" />
        </div>
        <CardTitle className="text-2xl font-black uppercase tracking-tighter">Gestión de Calendario VIP</CardTitle>
        <p className="text-slate-500">Actualiza el PDF y la imagen base para el calendario mensual de suscriptores.</p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mes del Calendario</label>
            <Input 
              className="rounded-xl bg-slate-50 h-12" 
              value={formData.month} 
              onChange={e => setFormData({...formData, month: e.target.value})}
              placeholder="Ej: Abril 2026"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL del PDF (Google Drive/S3)</label>
            <Input 
              className="rounded-xl bg-slate-50 h-12" 
              value={formData.pdfUrl} 
              onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
              placeholder="https://drive.google.com/..."
            />
            <p className="text-[10px] text-slate-400 italic">Este es el archivo que se descargará en la versión simple.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL de la Imagen Base (PNG)</label>
            <Input 
              className="rounded-xl bg-slate-50 h-12" 
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              placeholder="/assets/calendario_base_abril.png"
            />
            <p className="text-[10px] text-slate-400 italic">Imagen PNG que se usará para la personalización con foto.</p>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-200"
          >
            {isUpdating ? <Loader2 className="animate-spin size-5" /> : "Guardar Cambios"}
          </Button>
        </form>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
          <Sparkles className="size-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Tip:</strong> Asegúrate de que el nuevo diseño mensual mantenga el recuadro blanco en la misma posición para que la personalización de fotos siga funcionando perfectamente.
          </p>
        </div>
      </CardContent>
    </Card>
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
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Imagen (URL)</label>
              <Input className="rounded-xl bg-slate-50" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Link de Compra</label>
              <Input className="rounded-xl bg-slate-50" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reseñas</label>
                <Input type="number" className="rounded-xl bg-slate-50" value={formData.reviews} onChange={e => setFormData({...formData, reviews: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Rating (1-5)</label>
                <Input type="number" min="1" max="5" className="rounded-xl bg-slate-50" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Badge (Opcional)</label>
              <Input className="rounded-xl bg-slate-50" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="Ej: Best Seller" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción</label>
              <textarea 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm min-h-[100px]" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1 rounded-xl font-black uppercase tracking-widest bg-slate-900 text-white">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl font-black uppercase tracking-widest border-slate-200">
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-black uppercase tracking-tighter text-lg">Inventario de Productos</h3>
          <Badge className="bg-slate-100 text-slate-600 border-none">{products?.length || 0} items</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map((product: any) => (
            <Card key={product.id} className="border-slate-200 shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 border-none font-bold uppercase text-[10px] tracking-widest">
                    {product.badge}
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm size-8 rounded-lg shadow-sm" onClick={() => handleEdit(product)}>
                    <Edit2 className="size-4 text-blue-600" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm size-8 rounded-lg shadow-sm" onClick={() => handleDelete(Number(product.id))}>
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 leading-tight">{product.title}</h4>
                  <span className="font-black text-purple-600">{product.price}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{product.reviews} reseñas</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ORDER MANAGER ---
function OrderManager() {
  const { data: orders, refetch, isLoading } = trpc.orders.getAll.useQuery();
  const deleteMutation = trpc.orders.delete.useMutation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders?.filter(o => 
    o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id?.toString().includes(searchTerm) ||
    o.buyerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar pedido?")) return;
    await deleteMutation.mutateAsync({ id });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input 
            className="pl-10 rounded-xl bg-slate-50 border-slate-200" 
            placeholder="Buscar por nombre, email o ID..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl border-slate-200" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
          </Button>
          <Badge className="bg-slate-900 text-white border-none px-4 py-2 rounded-xl">{filteredOrders?.length || 0} Pedidos</Badge>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4">ID / Fecha</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4">Cliente</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4">Tickets</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4">Total</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4">Estado</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-400 py-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders?.map((order: any) => (
              <TableRow key={order.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-4">
                  <div className="font-bold text-slate-900">#{order.id}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                      {order.buyerName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{order.buyerName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1"><Phone className="size-3" /> {order.buyerPhone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-bold">
                    {order.ticketCount} tickets
                  </Badge>
                  <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">{order.ticketNumbers}</div>
                </TableCell>
                <TableCell className="py-4 font-black text-slate-900">
                  ${Number(order.totalAmount).toLocaleString()}
                </TableCell>
                <TableCell className="py-4">
                  <Badge className={`
                    ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'}
                    border-none font-bold uppercase text-[10px] tracking-widest px-3 py-1 rounded-lg
                  `}>
                    {order.status === 'paid' ? 'PAGADO' : order.status === 'pending' ? 'PENDIENTE' : 'FALLIDO'}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <Button size="icon" variant="ghost" className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(Number(order.id))}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// --- STORY MANAGER ---
function StoryManager() {
  const { data: stories, refetch, isLoading } = trpc.stories.list.useQuery();
  const createMutation = trpc.stories.create.useMutation();
  const deleteMutation = trpc.stories.delete.useMutation();

  const [formData, setFormData] = useState({
    nombre: "",
    historia_es: "",
    historia_ko: "",
    fecha: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Historia creada");
      setFormData({ nombre: "", historia_es: "", historia_ko: "", fecha: new Date().toISOString().split('T')[0] });
      refetch();
    } catch (error) {
      toast.error("Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar historia?")) return;
    await deleteMutation.mutateAsync({ id });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 border-slate-200 shadow-lg rounded-3xl h-fit sticky top-24">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Plus className="size-5 text-pink-600" /> Nueva Historia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre del Ídolo</label>
              <Input className="rounded-xl bg-slate-50" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fecha</label>
              <Input type="date" className="rounded-xl bg-slate-50" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Historia (Español)</label>
              <textarea 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm min-h-[120px]" 
                value={formData.historia_es} 
                onChange={e => setFormData({...formData, historia_es: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Historia (Coreano)</label>
              <textarea 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm min-h-[120px]" 
                value={formData.historia_ko} 
                onChange={e => setFormData({...formData, historia_ko: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full rounded-xl font-black uppercase tracking-widest bg-slate-900 text-white">
              Guardar Historia
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        {stories?.map((story: any) => (
          <Card key={story.id} className="border-slate-200 shadow-sm rounded-3xl overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 font-bold uppercase italic">
                    {story.nombre.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tight">{story.nombre}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{story.fecha}</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(story.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold uppercase tracking-widest">ESPAÑOL</Badge>
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{story.historia_es}"</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold uppercase tracking-widest">COREANO</Badge>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{story.historia_ko}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- NEWS MANAGER ---
function NewsManager() {
  const { data: news, refetch, isLoading } = trpc.news.list.useQuery();
  const createMutation = trpc.news.create.useMutation();
  const deleteMutation = trpc.news.delete.useMutation();
  const runAutomation = trpc.news.runAutomation.useMutation();
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    image: "",
    source: "ETER",
    sourceUrl: "",
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunningAuto, setIsRunningAuto] = useState(false);
  const [preview, setPreview] = useState(false);

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Título y contenido son obligatorios");
      return;
    }
    setIsSubmitting(true);
    try {
      const slug = generateSlug(formData.title);
      await createMutation.mutateAsync({ ...formData, slug });
      toast.success("✅ Noticia publicada correctamente");
      setFormData({ title: "", content: "", summary: "", image: "", source: "ETER", sourceUrl: "", isPublished: true });
      setPreview(false);
      refetch();
    } catch {
      toast.error("Error al publicar la noticia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar noticia?")) return;
    await deleteMutation.mutateAsync({ id });
    toast.success("Noticia eliminada");
    refetch();
  };

  const handleRunAutomation = async () => {
    setIsRunningAuto(true);
    try {
      await runAutomation.mutateAsync();
      toast.success("✅ Automatización ejecutada");
      refetch();
    } catch {
      toast.error("Error en la automatización");
    } finally {
      setIsRunningAuto(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="space-y-8">

      {/* ── Barra superior ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-black text-xl uppercase tracking-tighter">Gestión de Noticias</h2>
          <p className="text-slate-500 text-sm mt-1">{news?.length || 0} noticias publicadas</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRunAutomation}
            disabled={isRunningAuto}
            className="gap-2 rounded-xl border-slate-200 font-bold"
          >
            {isRunningAuto ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Auto K-POP
          </Button>
          <Button onClick={() => refetch()} variant="outline" size="icon" className="rounded-xl border-slate-200">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {/* ── Editor ── */}
      <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Newspaper className="size-5 text-blue-600" /> Nueva Noticia / Blog
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold uppercase">Preview</span>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                preview ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                preview ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {preview ? (
            /* ── Vista previa ── */
            <div className="p-8 max-w-3xl mx-auto">
              {formData.image && (
                <img src={formData.image} alt="preview" className="w-full h-64 object-cover rounded-2xl mb-6" />
              )}
              <div className="flex gap-2 mb-4">
                <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">{formData.source || "ETER"}</Badge>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4">{formData.title || "Título de la noticia"}</h1>
              {formData.summary && (
                <p className="text-slate-500 text-lg mb-6 italic border-l-4 border-emerald-400 pl-4">{formData.summary}</p>
              )}
              <div className="space-y-4">
                {(formData.content || "El contenido aparecerá aquí...").split("\n").filter(p => p.trim()).map((p, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed">{p}</p>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-8 font-bold">URL: /noticias/{generateSlug(formData.title) || "slug-de-la-noticia"}</p>
            </div>
          ) : (
            /* ── Formulario ── */
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Título */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título *</label>
                  <Input
                    className="rounded-xl bg-slate-50 h-12 text-lg font-bold"
                    placeholder="Escribe el título de la noticia..."
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                  {formData.title && (
                    <p className="text-[10px] text-slate-400">URL: /noticias/<strong>{generateSlug(formData.title)}</strong></p>
                  )}
                </div>

                {/* Imagen */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Imagen Portada</label>
                  <Input
                    className="rounded-xl bg-slate-50"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="preview" className="w-full h-32 object-cover rounded-xl mt-2" />
                  )}
                </div>

                {/* Fuente */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fuente</label>
                  <Input
                    className="rounded-xl bg-slate-50"
                    placeholder="ETER, Weverse, Hybe..."
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                  />
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Fuente Original</label>
                  <Input
                    className="rounded-xl bg-slate-50"
                    placeholder="https://..."
                    value={formData.sourceUrl}
                    onChange={e => setFormData({ ...formData, sourceUrl: e.target.value })}
                  />
                </div>

                {/* Resumen */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Resumen Corto <span className="text-slate-300">(aparece en la tarjeta)</span></label>
                  <textarea
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm min-h-[80px] resize-none"
                    placeholder="Un párrafo corto que resume la noticia..."
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  />
                </div>

                {/* Contenido completo */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contenido Completo * <span className="text-slate-300">(soporta saltos de línea)</span></label>
                    <span className="text-[10px] text-slate-400">{formData.content.length} caracteres</span>
                  </div>
                  <textarea
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm min-h-[400px] resize-y font-mono leading-relaxed"
                    placeholder="Escribe aquí el artículo completo...\n\nPuedes usar saltos de línea para separar párrafos.\n\nCada línea en blanco creará un nuevo párrafo en la página."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>

                {/* Publicar */}
                <div className="md:col-span-2 flex items-center justify-between pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="size-5 rounded"
                    />
                    <span className="text-sm font-bold text-slate-700">Publicar inmediatamente</span>
                  </label>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-xl font-black uppercase tracking-widest bg-slate-900 text-white gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin size-4" /> : <Newspaper className="size-4" />}
                    Publicar Noticia
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* ── Lista de noticias ── */}
      <div className="space-y-4">
        <h3 className="font-black uppercase tracking-tighter text-lg px-1">Noticias Publicadas</h3>
        {news?.map((item: any) => (
          <Card key={item.id} className="border-slate-200 shadow-sm rounded-3xl overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              {item.image && (
                <div className="w-full md:w-40 h-32 md:h-auto bg-slate-100 relative shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-5 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px] tracking-widest uppercase">{item.source}</Badge>
                      <span className="text-[10px] text-slate-400 font-bold">{new Date(item.createdAt).toLocaleDateString("es-ES")}</span>
                      {item.isPublished
                        ? <Badge className="bg-green-50 text-green-600 border-none text-[10px] font-bold">✓ Publicado</Badge>
                        : <Badge className="bg-amber-50 text-amber-600 border-none text-[10px] font-bold">Borrador</Badge>
                      }
                    </div>
                    <h4 className="font-black text-slate-900 leading-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400 truncate">/{item.slug}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs font-bold border-slate-200"
                      onClick={() => navigate(`/noticias/${item.slug}`)}
                    >
                      Ver
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      onClick={() => handleDelete(Number(item.id))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
        {(!news || news.length === 0) && (
          <div className="text-center py-16 text-slate-400">
            <Newspaper className="size-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No hay noticias aún. ¡Crea la primera!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- GALLERY MANAGER ---
function GalleryManager() {
  const { data: photos, refetch, isLoading } = trpc.galleries.list.useQuery();
  const createMutation = trpc.galleries.create.useMutation();
  const deleteMutation = trpc.galleries.delete.useMutation();

  const [formData, setFormData] = useState({ group: "BTS", url: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) return;
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Foto añadida");
      setFormData({ ...formData, url: "" });
      refetch();
    } catch (error) {
      toast.error("Error al añadir");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar foto?")) return;
    await deleteMutation.mutateAsync({ id });
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="space-y-8">
      <Card className="border-slate-200 shadow-lg rounded-[2rem] bg-white overflow-hidden max-w-2xl mx-auto">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
          <div className="size-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon className="size-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">Gestión de Galería</CardTitle>
          <p className="text-slate-500">Añade nuevas fotos a las galerías de los grupos.</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Grupo</label>
              <select 
                className="w-full rounded-xl bg-slate-50 border border-slate-200 h-12 px-4 font-bold text-slate-900"
                value={formData.group}
                onChange={e => setFormData({...formData, group: e.target.value})}
              >
                <option value="BTS">BTS</option>
                <option value="BLACKPINK">BLACKPINK</option>
                <option value="TWICE">TWICE</option>
                <option value="STRAY KIDS">STRAY KIDS</option>
                <option value="NEWJEANS">NEWJEANS</option>
              </select>
            </div>
            <div className="flex-[2] space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL de la Imagen</label>
              <Input className="rounded-xl bg-slate-50 h-12" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="pt-6">
              <Button type="submit" className="h-12 px-8 rounded-xl font-black uppercase tracking-widest bg-slate-900 text-white">Añadir</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {photos?.map((photo: any) => (
          <div key={photo.id} className="relative group rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white break-inside-avoid">
            <img src={photo.url} alt="Gallery" className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <Badge className="bg-white text-slate-900 border-none font-black uppercase text-[10px] tracking-widest">{photo.group}</Badge>
              <Button size="icon" variant="destructive" className="rounded-xl size-10" onClick={() => handleDelete(photo.id)}>
                <Trash2 className="size-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- EVENTO MANAGER ---
function EventoManager() {
  const { data: eventos, refetch, isLoading } = trpc.eventDetails.getAll.useQuery();
  const createMutation = trpc.eventDetails.create.useMutation();
  const deleteMutation = trpc.eventDetails.delete.useMutation();
  const [, navigate] = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    location: "",
    time: "",
    ticketsUrl: "",
    extraUrl: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) { toast.error("El título es obligatorio"); return; }
    setIsSubmitting(true);
    try {
      const slug = generateSlug(formData.title);
      await createMutation.mutateAsync({ ...formData, slug });
      toast.success("✅ Evento publicado correctamente");
      setFormData({ title: "", description: "", image: "", location: "", time: "", ticketsUrl: "", extraUrl: "", tags: "" });
      setPreview(false);
      refetch();
    } catch {
      toast.error("Error al publicar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("¿Eliminar este evento?")) return;
    await deleteMutation.mutateAsync({ slug });
    toast.success("Evento eliminado");
    refetch();
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin size-8 text-slate-400" /></div>;

  return (
    <div className="space-y-8">

      {/* ── Barra superior ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-black text-xl uppercase tracking-tighter">Eventos Blog</h2>
          <p className="text-slate-500 text-sm mt-1">{eventos?.length || 0} eventos publicados — conectado a Sheets event_details</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="icon" className="rounded-xl border-slate-200">
          <RefreshCw className="size-4" />
        </Button>
      </div>

      {/* ── Editor ── */}
      <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
            <Calendar className="size-5 text-purple-600" /> Nuevo Evento
          </CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-bold uppercase">Preview</span>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                preview ? "bg-purple-600" : "bg-slate-200"
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                preview ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {preview ? (
            <div className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl my-6">
              {formData.image && <img src={formData.image} alt="preview" className="w-full h-64 object-cover rounded-2xl mb-6" />}
              <h1 className="text-3xl font-black text-white mb-2">{formData.title || "Título del evento"}</h1>
              {formData.location && <p className="text-purple-300 font-semibold mb-2">📍 {formData.location}</p>}
              {formData.time && <p className="text-white/60 text-sm mb-4">🕒 {formData.time}</p>}
              <div className="space-y-3">
                {(formData.description || "Descripción del evento...").split("\n").filter(p => p.trim()).map((p, i) => (
                  <p key={i} className="text-white/80 leading-relaxed">{p}</p>
                ))}
              </div>
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {formData.tags.split(",").map(t => (
                    <span key={t} className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs font-bold">#{t.trim()}</span>
                  ))}
                </div>
              )}
              <p className="text-xs text-white/30 mt-6">URL: /evento/{generateSlug(formData.title) || "slug-del-evento"}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Título */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Título *</label>
                  <Input
                    className="rounded-xl bg-slate-50 h-12 text-lg font-bold"
                    placeholder="Ej: BTS World Tour 2026 - Fecha México"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                  {formData.title && (
                    <p className="text-[10px] text-slate-400">URL: /evento/<strong>{generateSlug(formData.title)}</strong></p>
                  )}
                </div>

                {/* Imagen */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Imagen Portada</label>
                  <Input className="rounded-xl bg-slate-50" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                  {formData.image && <img src={formData.image} alt="preview" className="w-full h-32 object-cover rounded-xl mt-2" />}
                </div>

                {/* Lugar y Hora */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lugar / Venue</label>
                    <Input className="rounded-xl bg-slate-50" placeholder="Ej: Foro Sol, CDMX" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hora</label>
                    <Input className="rounded-xl bg-slate-50" placeholder="Ej: 8:00 PM" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Boletos</label>
                  <Input className="rounded-xl bg-slate-50" placeholder="https://ticketmaster..." value={formData.ticketsUrl} onChange={e => setFormData({ ...formData, ticketsUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">URL Extra (info oficial)</label>
                  <Input className="rounded-xl bg-slate-50" placeholder="https://..." value={formData.extraUrl} onChange={e => setFormData({ ...formData, extraUrl: e.target.value })} />
                </div>

                {/* Tags */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tags <span className="text-slate-300">(separados por coma)</span></label>
                  <Input className="rounded-xl bg-slate-50" placeholder="BTS, concierto, 2026, México" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Descripción Completa <span className="text-slate-300">(blog largo)</span></label>
                    <span className="text-[10px] text-slate-400">{formData.description.length} caracteres</span>
                  </div>
                  <textarea
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm min-h-[400px] resize-y font-mono leading-relaxed"
                    placeholder="Escribe aquí toda la información del evento...\n\nHorarios, setlist esperado, info de boletos, cómo llegar, etc.\n\nCada salto de línea crea un nuevo párrafo."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-xl font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin size-4" /> : <Calendar className="size-4" />}
                    Publicar Evento
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* ── Lista ── */}
      <div className="space-y-4">
        <h3 className="font-black uppercase tracking-tighter text-lg px-1">Eventos Publicados</h3>
        {eventos?.map((ev: any) => (
          <Card key={ev.slug} className="border-slate-200 shadow-sm rounded-3xl overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              {ev.image && (
                <div className="w-full md:w-40 h-32 md:h-auto bg-slate-100 relative shrink-0">
                  <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-5 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 leading-tight mb-1">{ev.title}</h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {ev.location && <span className="text-xs text-slate-500">📍 {ev.location}</span>}
                      {ev.time && <span className="text-xs text-slate-500">🕒 {ev.time}</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 truncate">/evento/{ev.slug}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold border-slate-200" onClick={() => navigate(`/evento/${ev.slug}`)}>
                      Ver
                    </Button>
                    <Button size="icon" variant="ghost" className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(ev.slug)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
        {(!eventos || eventos.length === 0) && (
          <div className="text-center py-16 text-slate-400">
            <Calendar className="size-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">No hay eventos aún. ¡Crea el primero!</p>
          </div>
        )}
      </div>
    </div>
  );
}
