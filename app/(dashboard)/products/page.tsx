'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { formatPrice } from '@/lib/utils';
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
} from 'lucide-react';

// Demo products
const DEMO_PRODUCTS = [
  {
    id: '1',
    name: 'Robe wax taille M',
    price: 15000,
    comparePrice: 20000,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
    stock: 5,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Kit beauté complet',
    price: 8500,
    comparePrice: null,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    stock: 12,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: '3',
    name: 'Pagne holson 6 yards',
    price: 12000,
    comparePrice: 15000,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
    stock: 0,
    isAvailable: false,
    isFeatured: false,
  },
  {
    id: '4',
    name: 'Parfum Chanel imported',
    price: 35000,
    comparePrice: 45000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400',
    stock: 3,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Sac à main cuir',
    price: 22000,
    comparePrice: null,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    stock: 7,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: '6',
    name: 'Lace wig 360 frontal',
    price: 45000,
    comparePrice: 55000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    stock: 2,
    isAvailable: true,
    isFeatured: false,
  },
];

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = DEMO_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-1">Mes Produits</h1>
          <p className="text-sm text-text-3">{DEMO_PRODUCTS.length} produits</p>
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
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.comparePrice && (
                      <Badge
                        variant="danger"
                        className="absolute top-2 left-2"
                        size="sm"
                      >
                        -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                      </Badge>
                    )}
                    {product.stock <= 2 && product.stock > 0 && (
                      <Badge
                        variant="warning"
                        className="absolute top-2 right-2"
                        size="sm"
                      >
                        ⚡ Derniers
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="default" size="lg">
                          Rupture
                        </Badge>
                      </div>
                    )}
                    <button
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product.id);
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
                      {product.comparePrice && (
                        <p className="text-xs text-text-3 line-through">
                          {formatPrice(product.comparePrice)}
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
                <Card className="p-3" hover onClick={() => setSelectedProduct(product.id)}>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-1 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-outfit font-bold text-primary">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice && (
                          <p className="text-sm text-text-3 line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={product.stock > 0 ? 'success' : 'danger'} size="sm">
                          Stock: {product.stock}
                        </Badge>
                        <Badge variant={product.isAvailable ? 'info' : 'default'} size="sm">
                          {product.isAvailable ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                    </div>
                    <button className="p-2">
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
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Actions"
      >
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Edit2 className="mr-3 h-5 w-5" />
            Modifier
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Copy className="mr-3 h-5 w-5" />
            Dupliquer
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Archive className="mr-3 h-5 w-5" />
            Archiver
          </Button>
          <Button variant="danger" className="w-full justify-start">
            <Trash2 className="mr-3 h-5 w-5" />
            Supprimer
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
