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

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Kit Fiesta Bts/bt21 Globos De Cumpleaños Decoración K-pop",
    description:
      "Set de 18 globos. 1 juego completo de banderola, 18 globos de látex, 1 inserto de tarta grande (2 palos), 14 insertos de tarta pequeños",
    price: 213.84,
    image:
      "https://http2.mlstatic.com/D_NQ_NP_2X_730858-CBT84152775940_052025-F-kit-fiesta-btsbt21-globos-de-cumpleanos-decoracion-k-pop.webp",
    link: "https://meli.la/14ifKUh",
    rating: 4.9,
    reviews: 63,
    badge: "Nuevo",
  },
  {
    id: "2",
    title: "Bts Kpop Bangtan Boys Muñecas De Dibujos Animados 7 Pcs",
    description: "La edad mínima recomendada para utilizarla es 5 años.",
    price: 398,
    image:
      "https://http2.mlstatic.com/D_NQ_NP_2X_747539-MLA107426879435_022026-F.webp",
    link: "https://meli.la/2EASF4B",
    rating: 5,
    reviews: 4,
    badge: "Nuevo",
  },
];

export default function Store() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const { data: dbProducts } = trpc.products.list.useQuery();

  useEffect(() => {
    if (dbProducts && dbProducts.length > 0) {
      const formattedProducts = dbProducts.map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        description: p.description || "",
        price: p.price / 100,
        image: p.image,
        link: p.link,
        rating: p.rating ? p.rating / 10 : undefined,
        reviews: p.reviews,
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
      window.history.pushState(null, "", window.location.pathname);
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
            onClick={() => window.history.back()}
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
        {products.length === 0 ? (
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
                          <Button className="w-full rounded-2xl bg-slate-900 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-widest h-10 transition-all">
                            Ver Detalles
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </DialogTrigger>

                <DialogContent className="max-w-4xl bg-white border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
                  <div className="flex flex-col md:flex-row h-[90vh] md:h-[70vh]">
                    {/* Product Image */}
                    <div className="w-full md:w-1/2 relative h-64 md:h-full bg-slate-50">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-contain p-8"
                      />
                      {product.badge && (
                        <Badge className="absolute top-6 left-6 bg-fuchsia-600 text-white border-none px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                          {product.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
                      <div className="flex-grow space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em]">
                            <ShoppingCart className="size-3" />
                            Producto Oficial
                          </div>
                          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight uppercase">
                            {product.title}
                          </h2>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-4xl font-black text-purple-600 tracking-tighter">
                            ${product.price} <span className="text-xs text-slate-400 uppercase">MXN</span>
                          </div>
                          <div className="h-8 w-px bg-slate-100" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {renderStars(product.rating)}
                              <span className="text-xs font-bold text-slate-900 ml-1">{product.rating}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {product.reviews} Calificaciones
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-emerald-500" /> Descripción
                          </h4>
                          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            {product.description}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                          <img
                            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663442540562/eG7tCpxgJHL2beNG2g3VYE/Mercado-Libre-Logo-PNG1_e7fad039.png"
                            alt="Mercado Libre"
                            className="h-6"
                          />
                          <div className="text-[10px] font-bold text-slate-500 leading-tight uppercase tracking-wider">
                            Compra segura a través de nuestro enlace de afiliados en Mercado Libre.
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3">
                            <ExternalLink className="size-5" />
                            Comprar Ahora
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </section>

      {/* Footer with Admin Button */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="container py-16 px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 bg-slate-200" />
            <p className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">
              DEDIKA STUDIO
            </p>
            <div className="h-px w-12 bg-slate-200" />
          </div>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
            Este sitio muestra productos disponibles en Mercado Libre mediante
            enlaces externos. No vendemos ni distribuimos directamente los
            productos mostrados. Las compras, envíos, garantías y políticas son
            responsabilidad exclusiva de los vendedores y de la plataforma
            Mercado Libre.
          </p>

          {/* Admin Access Button - Tiny and Discreet */}
          <button
            onClick={() => setShowAdminPrompt(true)}
            className="text-[10px] text-slate-300 hover:text-purple-600 transition-colors flex items-center gap-1 mx-auto uppercase font-bold tracking-widest"
          >
            <Lock className="size-3" />
            Acceso Admin
          </button>
        </div>

        {/* Admin Password Modal */}
        {showAdminPrompt && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm"
            >
              <Card className="bg-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                  <div className="bg-purple-100 size-12 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <ShieldCheck className="size-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-black text-center text-slate-900 uppercase tracking-tight mb-2">Acceso Restringido</h2>
                  <p className="text-xs text-slate-400 text-center mb-6 font-medium">Ingresa la contraseña maestra para continuar</p>
                  
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAdminAccess();
                    }}
                    className="w-full px-6 py-4 border-2 border-slate-100 rounded-2xl mb-4 bg-slate-50 focus:border-purple-600 focus:outline-none transition-all text-center font-bold"
                    autoFocus
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleAdminAccess}
                      className="w-full bg-purple-600 hover:bg-purple-700 h-12 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Entrar al Panel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAdminPrompt(false);
                        setAdminPassword("");
                      }}
                      variant="ghost"
                      className="w-full h-12 rounded-2xl font-bold text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </footer>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
