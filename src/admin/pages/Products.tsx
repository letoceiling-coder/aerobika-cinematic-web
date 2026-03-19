import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../lib/api';

interface Product {
  id: number;
  name: string;
  description: string;
  // Legacy fields
  price5l: number | null;
  price10l: number | null;
  exchangePrice5l: number | null;
  exchangePrice10l: number | null;
  // New universal fields
  price: number | null;
  priceType: 'fixed' | 'request';
  category: string | null;
  productType: 'cylinder' | 'accessory' | 'other';
  imageUrl: string;
  isActive: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить товар?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) {
    return <div className="text-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gold-text">Товары</span>
          </h1>
          <p className="text-muted-foreground">Управление товарами</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="gold-gradient text-primary-foreground font-bold px-6 py-3 rounded-lg hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-secondary rounded-lg p-4">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4 rounded"
                />
              )}
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
              <div className="text-xs text-muted-foreground mb-4 flex gap-2 flex-wrap">
                <span className="bg-primary/20 px-2 py-1 rounded">
                  {product.productType === 'cylinder' ? 'Баллон' : product.productType === 'accessory' ? 'Аксессуар' : 'Другое'}
                </span>
                {product.category && (
                  <span className="bg-secondary px-2 py-1 rounded">{product.category}</span>
                )}
              </div>
              {product.productType === 'cylinder' ? (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">5л</p>
                    <p className="font-bold">{product.price5l?.toLocaleString() || '—'} ₽</p>
                    {product.exchangePrice5l && (
                      <p className="text-xs text-accent">Обмен: {product.exchangePrice5l.toLocaleString()} ₽</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">10л</p>
                    <p className="font-bold">{product.price10l?.toLocaleString() || '—'} ₽</p>
                    {product.exchangePrice10l && (
                      <p className="text-xs text-accent">Обмен: {product.exchangePrice10l.toLocaleString()} ₽</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Цена</p>
                  <p className="font-bold text-lg">
                    {product.priceType === 'request' 
                      ? 'По запросу' 
                      : product.price 
                        ? `${product.price.toLocaleString()} ₽`
                        : '—'}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowModal(true);
                  }}
                  className="flex-1 bg-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-destructive/20 text-destructive px-4 py-2 rounded-lg hover:bg-destructive/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            fetchProducts();
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}) {
  // Initialize formData only once when product changes
  const [formData, setFormData] = useState(() => ({
    name: product?.name || '',
    description: product?.description || '',
    // Legacy fields
    price5l: product?.price5l ?? null,
    price10l: product?.price10l ?? null,
    exchangePrice5l: product?.exchangePrice5l ?? null,
    exchangePrice10l: product?.exchangePrice10l ?? null,
    // New universal fields
    productType: product?.productType || 'cylinder',
    category: product?.category || '',
    price: product?.price ?? null,
    priceType: product?.priceType || 'fixed',
    imageUrl: product?.imageUrl || '',
    isActive: product?.isActive ?? true,
  }));

  // Only update when product ID changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price5l: product.price5l ?? null,
        price10l: product.price10l ?? null,
        exchangePrice5l: product.exchangePrice5l ?? null,
        exchangePrice10l: product.exchangePrice10l ?? null,
        productType: product.productType || 'cylinder',
        category: product.category || '',
        price: product.price ?? null,
        priceType: product.priceType || 'fixed',
        imageUrl: product.imageUrl || '',
        isActive: product.isActive ?? true,
      });
    } else {
      // Reset to defaults for new product
      setFormData({
        name: '',
        description: '',
        price5l: null,
        price10l: null,
        exchangePrice5l: null,
        exchangePrice10l: null,
        productType: 'cylinder',
        category: '',
        price: null,
        priceType: 'fixed',
        imageUrl: '',
        isActive: true,
      });
    }
  }, [product?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 SUBMIT TRIGGERED');
    
    try {
      // Build submit data explicitly
      const submitData: any = {
        name: formData.name,
        description: formData.description || null,
        productType: formData.productType,
        category: formData.category || null,
        priceType: formData.priceType,
        imageUrl: formData.imageUrl || null,
        isActive: formData.isActive,
      };

      // Handle prices based on product type (SAFE - clear unused fields)
      if (formData.productType === 'cylinder') {
        // Cylinder: use price5l/price10l
        submitData.price5l = formData.price5l !== null && formData.price5l !== undefined ? Number(formData.price5l) : null;
        submitData.price10l = formData.price10l !== null && formData.price10l !== undefined ? Number(formData.price10l) : null;
        
        // Exchange prices
        if (formData.exchangePrice5l !== null && formData.exchangePrice5l !== undefined) {
          submitData.exchangePrice5l = Number(formData.exchangePrice5l);
        } else {
          submitData.exchangePrice5l = null;
        }

        if (formData.exchangePrice10l !== null && formData.exchangePrice10l !== undefined) {
          submitData.exchangePrice10l = Number(formData.exchangePrice10l);
        } else {
          submitData.exchangePrice10l = null;
        }
        
        // Clear universal price for cylinders (SAFE)
        submitData.price = null;
      } else {
        // Non-cylinder: use universal price
        submitData.price = formData.price !== null && formData.price !== undefined ? Number(formData.price) : null;
        // Set cylinder prices to null for non-cylinders (SAFE - prevent data pollution)
        submitData.price5l = null;
        submitData.price10l = null;
        submitData.exchangePrice5l = null;
        submitData.exchangePrice10l = null;
      }

      console.log('📤 SubmitData:', JSON.stringify(submitData, null, 2));
      console.log('🔍 exchangePrice5l:', submitData.exchangePrice5l, typeof submitData.exchangePrice5l);
      console.log('🔍 exchangePrice10l:', submitData.exchangePrice10l, typeof submitData.exchangePrice10l);

      if (product) {
        console.log('📡 Sending PATCH request:', `/products/${product.id}`);
        const response = await api.patch(`/products/${product.id}`, submitData);
        console.log('✅ PATCH response:', response.data);
      } else {
        console.log('📡 Sending POST request:', '/products');
        const response = await api.post('/products', submitData);
        console.log('✅ POST response:', response.data);
      }
      onSave();
    } catch (error: any) {
      console.error('❌ Failed to save product:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Редактировать' : 'Добавить'} товар
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Название</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
              rows={3}
            />
          </div>
          
          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Тип товара</label>
            <select
              value={formData.productType}
              onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value as 'cylinder' | 'accessory' | 'other' }))}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            >
              <option value="cylinder">Баллон</option>
              <option value="accessory">Аксессуар</option>
              <option value="other">Другое</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
              placeholder="Например: аксессуары, панч-болл"
            />
          </div>

          {/* Conditional fields based on productType */}
          {formData.productType === 'cylinder' ? (
            <>
              {/* Cylinder prices */}
              <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Цена 5л (₽)</label>
              <input
                type="number"
                value={formData.price5l}
                onChange={(e) => setFormData(prev => ({ ...prev, price5l: Number(e.target.value) }))}
                className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Цена 10л (₽)</label>
              <input
                type="number"
                value={formData.price10l}
                onChange={(e) => setFormData(prev => ({ ...prev, price10l: Number(e.target.value) }))}
                className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Цена обмена 5л (₽)</label>
              <input
                type="number"
                value={formData.exchangePrice5l ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const numVal = val === '' ? null : (val ? Number(val) : null);
                  console.log('🔍 exchangePrice5l input:', val, '→', numVal);
                  setFormData(prev => {
                    const newData = { ...prev, exchangePrice5l: numVal };
                    console.log('🔍 exchangePrice5l state updated:', newData.exchangePrice5l);
                    return newData;
                  });
                }}
                className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
                placeholder="Необязательно"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Цена обмена 10л (₽)</label>
              <input
                type="number"
                value={formData.exchangePrice10l ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const numVal = val === '' ? null : (val ? Number(val) : null);
                  console.log('🔍 exchangePrice10l input:', val, '→', numVal);
                  setFormData(prev => {
                    const newData = { ...prev, exchangePrice10l: numVal };
                    console.log('🔍 exchangePrice10l state updated:', newData.exchangePrice10l);
                    return newData;
                  });
                }}
                className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
                placeholder="Необязательно"
              />
            </div>
          </div>
            </>
          ) : (
            <>
              {/* Universal price for non-cylinders */}
              <div>
                <label className="block text-sm font-medium mb-2">Тип цены</label>
                <select
                  value={formData.priceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value as 'fixed' | 'request' }))}
                  className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
                >
                  <option value="fixed">Фиксированная</option>
                  <option value="request">По запросу</option>
                </select>
              </div>
              {formData.priceType === 'fixed' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                  <input
                    type="number"
                    value={formData.price ?? ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value === '' ? null : Number(e.target.value) }))}
                    className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
                    placeholder="Введите цену"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">URL изображения</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground border border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4"
            />
            <label className="text-sm">Активен</label>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 gold-gradient text-primary-foreground font-bold py-3 rounded-lg hover:brightness-110"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary text-foreground font-bold py-3 rounded-lg hover:bg-secondary/80"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
