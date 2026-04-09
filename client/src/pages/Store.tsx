import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../components/ui/badge";
import { ExternalLink, ShoppingBag, Lock, ArrowLeft, Star, Maximize2, ShoppingCart, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

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

export default function Store() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const { data: dbProducts, isLoading } = trpc.products.list.useQuery();

  useEffect(() => {
    if (dbProducts) {
      const formattedProducts = dbProducts
        .filter((p: any) => p && p.id !== undefined && p.id !== null)
        .map((p: any) => ({
          id: p.id.toString(),
          title: p.title || "Producto sin nombre",
          description: p.description || "",
          price: p.price ? Number(p.price) : 0,
          image: p.image || "",
          link: p.link || "#",
          rating: p.rating ? Number(p.rating) / 10 : undefined,
          reviews: p.reviews ? Number(p.reviews) : 0,
          badge: p.badge || undefined,
        }));
      setProducts(formattedProducts);
    }
  }, [dbProducts]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash.startsWith("producto-")) {
        const id = hash.replace("producto-", "");
        setOpenProductId(id);
      } else {
        setOpenProductId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleOpenChange = (open: boolean, id: string) => {
    if (open) {
      window.location.hash = `producto-${id}`;
    } else {
      window.location.hash = ""; // Usar hash vacío en lugar de pushState
      setOpenProductId(null);
    }
  };

  const handleAdminAccess = () => {
    if (adminPassword === "panochonas12") {
      setShowAdminPrompt(false);
      setAdminPassword("");
      navigate("/admin");
    } else {
      alert("Contraseña incorrecta");
      setAdminPassword("");
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`size-3 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl">
              <ShoppingBag className="size-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 uppercase">Tienda Eter</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/Mercado-Libre-Logo-PNG1_e7fad039.png"
              alt="Mercado Libre"
              className="h-4"
            />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Afiliados Oficiales</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (openProductId) {
                // Si hay un producto abierto, ciérralo
                window.location.hash = "";
                setOpenProductId(null);
              } else {
                // Si no hay producto abierto, vuelve a la página anterior
                window.history.back();
              }
            }}
            className="gap-2 font-bold text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <ArrowLeft className="size-4" />
            <span>Volver</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[30vh] md:h-[40vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative container text-center text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-2 tracking-tighter uppercase"
          >
            Tienda Oficial
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-xl text-purple-100 font-medium max-w-2xl mx-auto"
          >
            Los mejores productos K-POP seleccionados especialmente para ti
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container py-12 px-4 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
            <ShoppingBag className="size-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-lg mb-6">
              No hay productos disponibles en este momento
            </p>
            <Button onClick={() => navigate("/")} variant="outline" className="rounded-full px-8">
              Volver al inicio
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <Dialog 
                key={product.id} 
                open={openProductId === product.id} 
                onOpenChange={(open) => handleOpenChange(open, product.id)}
              >
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="cursor-pointer"
                  >
                    <Card className="group h-full bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col">
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {product.badge && (
                          <Badge className="absolute top-4 right-4 bg-fuchsia-600 text-white border-none px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest">
                            {product.badge}
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
                            <Maximize2 className="size-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-grow">
                        <h3 className="font-black text-slate-900 text-sm md:text-base mb-2 line-clamp-2 leading-tight uppercase tracking-tight">
                          {product.title}
                        </h3>
                        <div className="mt-auto pt-4 flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="text-xl md:text-2xl font-black text-purple-600 tracking-tighter">
                              ${product.price} <span className="text-[10px] text-slate-400 uppercase">MXN</span>
                            </div>
                            {product.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-bold text-slate-600">{product.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest h-9 transition-all">
                              Ver Detalles
                            </Button>
                            <a
                              href={product.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full"
                            >
                              <Button
                                variant="outline"
                                className="w-full rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-widest h-9 transition-all gap-2"
                              >
                                <ExternalLink className="size-3" />
                                Comprar
                              </Button>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
                  <div className="grid md:grid-cols-2">
                    {/* Product Image */}
                    <div className="relative aspect-square md:aspect-auto bg-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                          Oficial
                        </Badge>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-8 md:p-10 flex flex-col bg-white">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-purple-100 p-1.5 rounded-lg">
                          <CheckCircle2 className="size-4 text-purple-600" />
                        </div>
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                          Producto Oficial
                        </span>
                      </div>

                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter mb-4">
                          {product.title}
                        </DialogTitle>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-black text-purple-600 tracking-tighter">
                            ${product.price} <span className="text-xs text-slate-400 uppercase">MXN</span>
                          </div>
                          <div className="h-6 w-px bg-slate-100" />
                          <div className="flex items-center gap-2">
                            {renderStars(product.rating)}
                            <span className="text-xs font-bold text-slate-400">
                              ({product.reviews} reseñas)
                            </span>
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="space-y-6 flex-grow">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descripción</h4>
                          <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            {product.description}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/Mercado-Libre-Logo-PNG1_e7fad039.png"
                              alt="Mercado Libre"
                              className="h-3"
                            />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                              Vendido vía Mercado Libre
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold leading-tight uppercase">
                            Compra protegida, envío rápido y devoluciones gratis.
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col gap-3">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button className="w-full rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest h-14 shadow-xl shadow-purple-200 transition-all gap-3">
                            <ShoppingCart className="size-5" />
                            Comprar Ahora
                          </Button>
                        </a>
                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                          Stock Limitado • Envío a todo México
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </section>

      {/* Footer Info */}
      <section className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-full mb-6 border border-slate-100">
            <Lock className="size-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zona de Administración Protegida</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
            Eter es un portal de fans para fans. Los productos mostrados son parte de nuestro programa de afiliados.
            <br />
            © 2026 Eter K-POP MX. Todos los derechos reservados.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdminPrompt(true)}
            className="text-slate-300 hover:text-slate-400 font-bold text-[10px] uppercase tracking-widest"
          >
            Panel de Control
          </Button>
        </div>
      </section>

      {/* Admin Password Dialog */}
      <Dialog open={showAdminPrompt} onOpenChange={setShowAdminPrompt}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] p-8 border-none shadow-2xl">
          <div className="text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="size-8 text-slate-900" />
            </div>
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Acceso Admin
              </DialogTitle>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                Introduce la contraseña maestra
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminAccess()}
                className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-center font-black text-lg focus:outline-none focus:border-purple-600 transition-all"
                placeholder="••••••••"
                autoFocus
              />
              <Button
                onClick={handleAdminAccess}
                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest transition-all"
              >
                Entrar al Panel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
