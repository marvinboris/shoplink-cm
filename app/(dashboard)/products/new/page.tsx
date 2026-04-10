'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  ArrowLeft,
  X,
  Camera,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'robes', label: 'Robes' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'pagnes', label: 'Pagnes' },
  { value: 'accessoires', label: 'Accessoires' },
  { value: 'perruques', label: 'Perruques' },
  { value: 'food', label: 'Food' },
  { value: 'autre', label: 'Autre' },
];

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [trackStock, setTrackStock] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).slice(0, 6 - images.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      addToast('Nom et prix sont requis', 'error');
      return;
    }
    if (images.length === 0) {
      addToast('Ajoutez au moins une photo', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          compare_price: comparePrice ? Number(comparePrice) : null,
          category,
          stock_count: stock ? Number(stock) : null,
          track_stock: trackStock,
          images,
          is_available: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast('Produit ajouté avec succès !', 'success');
        router.push('/products');
      } else {
        addToast(data.error || 'Erreur lors de la création', 'error');
      }
    } catch {
      addToast('Erreur lors de la création', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-bg-surface shadow-sm flex items-center justify-center border border-border-subtle"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Nouveau produit</h1>
          <p className="text-sm text-text-3">Ajoutez un produit à votre boutique</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <Card className="p-4 bg-bg-surface border-border-subtle" variant="default">
          <label className="block mb-3">
            <span className="font-medium text-text-1">Photos du produit</span>
            <span className="text-sm text-text-3 ml-2">({images.length}/6)</span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden"
              >
                <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
                {i === 0 && (
                  <Badge variant="default" size="sm" className="absolute bottom-1 left-1 bg-primary text-white border-0">
                    Principal
                  </Badge>
                )}
              </motion.div>
            ))}

            {images.length < 6 && (
              <label
                className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors press-effect ${
                  isDragging ? 'border-primary bg-primary-soft' : 'border-border-subtle hover:border-primary/50'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const files = e.dataTransfer.files;
                  Array.from(files).slice(0, 6 - images.length).forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (ev.target?.result) {
                        setImages((prev) => [...prev, ev.target!.result as string]);
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageUpload}
                />
                <Camera className="h-8 w-8 text-text-3 mb-2" />
                <span className="text-xs text-text-3">Ajouter</span>
              </label>
            )}
          </div>
        </Card>

        {/* Basic Info */}
        <Card className="p-4 space-y-4 bg-bg-surface border-border-subtle" variant="default">
          <Input
            label="Nom du produit"
            placeholder="Ex: Robe wax taille M"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Description (optionnel)"
            placeholder="Décrivez votre produit..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            label="Catégorie"
            placeholder="Sélectionnez une catégorie"
            options={CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Card>

        {/* Pricing */}
        <Card className="p-4 space-y-4 bg-bg-surface border-border-subtle" variant="default">
          <h3 className="font-medium text-text-1">Prix</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Prix de vente (FCFA)"
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
              required
            />
            <Input
              label="Prix barré (FCFA)"
              type="number"
              placeholder="0"
              hint="Pour afficher une promotion"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </Card>

        {/* Stock */}
        <Card className="p-4 space-y-4 bg-bg-surface border-border-subtle" variant="default">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-text-1">Gestion du stock</h3>
              <p className="text-sm text-text-3">Suivre les quantités disponibles</p>
            </div>
            <Toggle checked={trackStock} onChange={(checked) => setTrackStock(checked)} />
          </div>

          {trackStock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <Input
                label="Quantité en stock"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value.replace(/\D/g, ''))}
              />
            </motion.div>
          )}
        </Card>

        {/* Submit */}
        <div className="space-y-3">
          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            <Sparkles className="mr-2 h-5 w-5" />
            Ajouter le produit
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
