import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import { InteractivePhotocard } from './InteractivePhotocard';
import { motion } from 'framer-motion';

export const PhotocardCreator: React.FC = () => {
  const [characterName, setCharacterName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [shineType, setShineType] = useState<'stars' | 'hearts' | 'rainbow' | 'holographic' | 'diamond' | 'crystal'>('holographic');
  const [opacity, setOpacity] = useState(0.5);
  const [showName, setShowName] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { data: photocards = [], refetch } = trpc.photocards.list.useQuery();
  const createMutation = trpc.photocards.create.useMutation();
  const deleteMutation = trpc.photocards.delete.useMutation();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName || !imageUrl) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsCreating(true);
    try {
      await createMutation.mutateAsync({
        characterName,
        imageUrl,
        shineType,
        opacity,
        showName,
      });
      toast.success('Photocard creada exitosamente');
      setCharacterName('');
      setImageUrl('');
      setShineType('holographic');
      setOpacity(0.5);
      refetch();
    } catch (error) {
      toast.error('Error al crear la photocard');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta photocard?')) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success('Photocard eliminada');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar la photocard');
    }
  };

  return (
    <div className="space-y-8">
      {/* Creator Form */}
      <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-100 p-8">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">
            Crear Nueva Photocard
          </CardTitle>
          <p className="text-slate-500 text-sm mt-2">
            Diseña photocards holográficas exclusivas para tus suscriptores
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Character Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-600 tracking-widest">
                Nombre del Personaje
              </label>
              <Input
                placeholder="Ej: Jungkook"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="rounded-xl bg-slate-50 h-12"
              />
              <p className="text-xs text-slate-400">
                💡 El folio se generará automáticamente como CARD-ETER-XXX
              </p>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-600 tracking-widest">
                URL de la Imagen (5.5 x 8.5 cm / 650 x 1000px)
              </label>
              <Input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl bg-slate-50 h-12"
              />
              <p className="text-xs text-slate-400">
                💡 Sube tu imagen a un servicio como Imgur o Cloudinary y pega el enlace aquí
              </p>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-600 tracking-widest">
                Intensidad del Brillo: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Muy Sutil</span>
                <span>Muy Intenso</span>
              </div>
            </div>

            {/* Shine Type */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-600 tracking-widest">
                Tipo de Brillo
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {(['holographic', 'stars', 'hearts', 'rainbow', 'diamond', 'crystal'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setShineType(type)}
                    className={`p-3 rounded-xl font-bold uppercase text-xs transition-all ${
                      shineType === type
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'holographic' && '✨ Holo'}
                    {type === 'stars' && '⭐ Estrellas'}
                    {type === 'hearts' && '💖 Corazones'}
                    {type === 'rainbow' && '🌈 Arcoíris'}
                    {type === 'diamond' && '💎 Diamante'}
                    {type === 'crystal' && '❄️ Cristal'}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {imageUrl && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-600 tracking-widest">
                  Vista Previa (Mueve el ratón o desliza en móvil)
                </label>
                <div className="bg-slate-50 p-6 rounded-2xl flex justify-center">
                  <div style={{ width: '200px', height: '300px' }}>
                    <InteractivePhotocard
                      imageUrl={imageUrl}
                      characterName={characterName}
                      shineType={shineType}
                      showName={false}
                      opacity={opacity}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isCreating || !characterName || !imageUrl}
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isCreating ? (
                <>
                  <Loader2 className="animate-spin size-5 mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Upload className="size-5 mr-2" />
                  Crear Photocard
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Photocards Gallery */}
      {photocards.length > 0 && (
        <Card className="border-slate-200 shadow-xl rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-100 p-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter">
              Photocards Creadas ({photocards.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photocards.map((pc) => (
                <motion.div
                  key={pc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div style={{ width: '100%', aspectRatio: '2/3' }}>
                    <InteractivePhotocard
                      imageUrl={pc.imageUrl}
                      characterName={pc.characterName}
                      shineType={pc.shineType}
                      showName={false}
                      opacity={pc.opacity ?? 0.5}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-900">
                      {pc.folio}
                    </p>
                    <p className="text-xs text-slate-500">
                      {pc.characterName} • {pc.shineType === 'holographic' ? '✨ Holográfico' : pc.shineType === 'diamond' ? '💎 Diamante' : pc.shineType === 'crystal' ? '❄️ Cristal' : pc.shineType}
                    </p>
                    <p className="text-xs text-slate-400">
                      Intensidad: {Math.round((pc.opacity ?? 0.5) * 100)}%
                    </p>
                    <Button
                      onClick={() => pc.id && handleDelete(pc.id)}
                      variant="destructive"
                      size="sm"
                      className="w-full rounded-lg"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
