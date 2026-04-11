'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { useToast } from '@/components/ui/toast';
import { useCurrentVendor } from '@/hooks/useCurrentVendor';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import {
  Search,
  Plus,
  Grid3X3,
  List,
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  Trash2,
  Filter,
  Save,
} from 'lucide-react';

export default function ProductsPage() {
  const { vendor } = useCurrentVendor();
  const { products, updateProduct, deleteProduct, createProduct } = useProducts(vendor?.id);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { addToast } = useToast();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleToggle = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    await updateProduct(id, { is_available: !product.is_available });
    addToast(product.is_available ? 'Produit indisponible' : 'Produit disponible');
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      stock_count: editingProduct.stock_count,
      compare_price: editingProduct.compare_price,
    });
    setEditingProduct(null);
    addToast('Produit mis à jour');
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    const success = await deleteProduct(productId);
    if (success) {
      addToast('Produit supprimé');
      setSelectedProductId(null);
    } else {
      addToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleDuplicate = async (product: Product) => {
    const newProduct = await createProduct({
      vendor_id: product.vendor_id,
      name: product.name + ' (copie)',
      description: product.description,
      price: product.price,
      compare_price: product.compare_price,
      images: product.images,
      category: product.category,
      tags: product.tags,
      stock_count: product.stock_count,
      track_stock: product.track_stock,
      is_available: product.is_available,
      is_featured: product.is_featured,
      order_index: product.order_index + 1,
    });
    if (newProduct) {
      addToast('Produit dupliqué');
      setSelectedProductId(null);
    } else {
      addToast('Erreur lors de la duplication', 'error');
    }
  };

  const handleArchive = async (product: Product) => {
    await updateProduct(product.id, { is_available: !product.is_available });
    addToast(product.is_available ? 'Produit archivé' : 'Produit réactivé');
    setSelectedProductId(null);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Mes Produits</h1>
          <p className="text-sm text-text-3">{products.length} produits</p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-5 w-5" />
            Ajouter
          </Button>
        </Link>
      </header>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-3" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className={showFilters ? 'bg-bg-elevated' : ''}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" />
        </Button>
        <div className="flex border border-border-subtle rounded-2xl overflow-hidden">
          <button
            className={`p-3 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-bg-surface text-text-3'}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-5 w-5" />
          </button>
          <button
            className={`p-3 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-bg-surface text-text-3'}`}
            onClick={() => setViewMode('list')}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="overflow-hidden p-0 card-hover"
                  padding="none"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.compare_price && (
                      <Badge
                        variant="danger"
                        className="absolute top-2 left-2"
                        size="sm"
                      >
                        -{Math.round((1 - product.price / product.compare_price) * 100)}%
                      </Badge>
                    )}
                    {typeof product.stock_count === 'number' && product.stock_count <= 2 && product.stock_count > 0 && (
                      <Badge
                        variant="warning"
                        className="absolute top-2 right-2"
                        size="sm"
                      >
                        ⚡ Derniers
                      </Badge>
                    )}
                    {product.stock_count === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="default" size="lg">
                          Rupture
                        </Badge>
                      </div>
                    )}
                    {/* Availability Toggle */}
                    <button
                      className={`absolute bottom-2 left-2 h-8 px-2 rounded-full text-xs font-semibold transition-all ${
                        product.is_available
                          ? 'bg-accent-green text-white'
                          : 'bg-text-3 text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(product.id);
                      }}
                    >
                      {product.is_available ? '✓ Dispo' : '✕ Indispo'}
                    </button>
                    <button
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductId(product.id);
                      }}
                    >
                      <MoreVertical className="h-4 w-4 text-text-2" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-text-1 truncate mb-1">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-outfit font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                      {product.compare_price && (
                        <p className="text-xs text-text-3 line-through">
                          {formatPrice(product.compare_price)}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-3" hover onClick={() => setSelectedProductId(product.id)}>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400'}
                      alt={product.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-1 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-outfit font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                        {product.compare_price && (
                          <p className="text-sm text-text-3 line-through">
                            {formatPrice(product.compare_price)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={(product.stock_count ?? 0) > 0 ? 'success' : 'danger'} size="sm">
                          Stock: {product.stock_count ?? 0}
                        </Badge>
                        <button
                          className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                            product.is_available
                              ? 'bg-accent-green/10 text-accent-green'
                              : 'bg-text-3/10 text-text-3'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(product.id);
                          }}
                        >
                          {product.is_available ? 'Disponible' : 'Indisponible'}
                        </button>
                      </div>
                    </div>
                    <button className="p-2" onClick={() => setSelectedProductId(product.id)}>
                      <MoreVertical className="h-5 w-5 text-text-3" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Product Actions Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedProductId && !editingProduct}
        onClose={() => setSelectedProductId(null)}
        title="Actions"
      >
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              if (selectedProduct) {
                setEditingProduct({ ...selectedProduct });
              }
            }}
          >
            <Edit2 className="mr-3 h-5 w-5" />
            Modifier
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => selectedProduct && handleDuplicate(selectedProduct)}
          >
            <Copy className="mr-3 h-5 w-5" />
            Dupliquer
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => selectedProduct && handleArchive(selectedProduct)}
          >
            <Archive className="mr-3 h-5 w-5" />
            Archiver
          </Button>
          <Button
            variant="danger"
            className="w-full justify-start"
            onClick={() => selectedProduct && handleDelete(selectedProduct.id)}
          >
            <Trash2 className="mr-3 h-5 w-5" />
            Supprimer
          </Button>
        </div>
      </BottomSheet>

      {/* Edit Product Bottom Sheet */}
      <BottomSheet
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Modifier le produit"
      >
        {editingProduct && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400'}
                alt={editingProduct.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-text-1">{editingProduct.name}</p>
                <p className="text-sm text-text-3">ID: {editingProduct.id}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-2 mb-1 block">Nom</label>
              <Input
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Prix (FCFA)</label>
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-text-2 mb-1 block">Stock</label>
                <Input
                  type="number"
                  value={editingProduct.stock_count ?? 0}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock_count: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-text-2 mb-1 block">Prix comparé (FCFA)</label>
              <Input
                type="number"
                value={editingProduct.compare_price ?? ''}
                placeholder="Laisser vide si pas de promo"
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    compare_price: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>

            <Button className="w-full mt-4" onClick={handleSaveEdit}>
              <Save className="mr-2 h-5 w-5" />
              Enregistrer
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
