import { useState } from 'react';
// 1. استدعاء المكون المشترك وعقد البيانات المشتركة من حزم الـ Monorepo المحلية!
import { Button } from '@modular/ui';
import type { Product } from '@modular/types'; 
// ملاحظة: سنستخدم الـ import الخاص بحزمتنا المحلية التي ربطناها في الـ package.json
import type { Product as ModularProduct } from '@modular/types';

export default function App() {
  // 2. استخدام الـ Type المشترك للتأكد من صرامة البيانات وبيئة خالية من أخطاء الـ Run-time
  const [products, setProducts] = useState<ModularProduct[]>([
    {
      id: "prod-1",
      title: "Premium Wireless Headphones",
      description: "Active noise-cancelling headphones with 40h battery life.",
      price: 299,
      compareAtPrice: 350,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"],
      category: "Electronics",
      stock: 45,
      sku: "HD-WL-001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-2",
      title: "Mechanical Gaming Keyboard",
      description: "Tactile switches with customizable RGB backlighting.",
      price: 129,
      images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60"],
      category: "Accessories",
      stock: 12,
      sku: "KB-ME-002",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const handleAddProduct = () => {
    alert("هذه اللمسة قادمة مباشرة من الـ Context / Convex Backend قريباً!");
  };

  return (
    <div className="min-h-screen p-lg">
      <header className="flex items-center justify-between border-b pb-md mb-lg">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">لوحة تحكم المشرفين | Admin Dashboard</h1>
          <p className="text-sm text-gray-500">إدارة المنتجات والمخزون بنظام مغلق هندسياً</p>
        </div>
        
        {/* 3. زر الـ UI المشترك يعمل هنا بكفاءة وتصميم موحد بالـ Tokens */}
        <Button variant="primary" onClick={handleAddProduct}>
          + إضافة منتج جديد
        </Button>
      </header>

      <main>
        <h2 className="text-lg font-semibold mb-md">المنتجات الحالية ({products.length})</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-md rounded-lg shadow-sm border flex gap-md">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-24 h-24 object-cover rounded-md bg-gray-100"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent bg-amber-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-1">{product.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-sm">
                  <div className="flex items-baseline gap-xs">
                    <span className="text-lg font-extrabold text-gray-900">${product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-gray-400 line-through">${product.compareAtPrice}</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.stock < 15 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    المخزون: {product.stock} قطعة (SKU: {product.sku})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}