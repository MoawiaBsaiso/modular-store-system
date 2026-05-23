import { useQuery } from "convex/react";
// الخروج للـ Root للوصول لـ convex المولد تلقائياً
import { api } from "../../../convex/_generated/api"; 
import { useState } from "react";

interface ConvexProduct {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  stock: number;
  sku: string;
}

export default function App() {
  // 1. جلب نفس المنتجات الحية من السحاب في الوقت الفعلي!
  const products = useQuery(api.products.get);
  
  // سلة مشتريات محلية بسيطة للتفاعل
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* البار العلوي للمتجر الإلكتروني */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-indigo-600 tracking-wider">MODULAR_SHOP</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">بوابة الزبائن</span>
            </div>
            
            {/* أيقونة السلة التفاعلية */}
            <div className="relative bg-gray-100 p-2.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* الهيرو سيكشن (البانر الترحيبي) */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-700 py-16 text-center text-white px-4">
        <h1 className="text-4xl font-extrabold sm:text-5xl">أحدث المنتجات التقنية بين يديك</h1>
        <p className="mt-4 text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
          استمتع بتجربة تسوق فريدة ومحدثة لحظة بلحظة مباشرة من مستودعاتنا الذكية.
        </p>
      </header>

      {/* محتوى المتجر الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* حالة التحميل */}
        {products === undefined && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 text-sm">جاري تحديث واجهة العرض...</p>
          </div>
        )}

        {/* حالة فراغ المتجر */}
        {products !== undefined && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
            <p className="text-lg font-medium text-gray-500">المتجر فارغ حالياً 😔</p>
            <p className="mt-1 text-sm text-gray-400">يرجى إضافة منتجات من لوحة التحكم لتظهر هنا فوراً.</p>
          </div>
        )}

        {/* شبكة عرض المنتجات للزبون */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product: ConvexProduct) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                <div className="aspect-square w-full bg-gray-50 overflow-hidden relative border-b border-gray-50">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">لا توجد صورة</div>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {product.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1">{product.title}</h3>
                    <p className="mt-1 text-xs text-gray-400">SKU: {product.sku}</p>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-black text-gray-900">${product.price}</span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.compareAtPrice}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => setCartCount(prev => prev + 1)}
                      className="w-full bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg text-sm hover:bg-brand-primary-hover transition-colors shadow-sm active:scale-95 transform duration-150"
                    >
                      🛒 أضف للسلة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}