import { useQuery, useMutation } from "convex/react";
// استدعاء الدوال السحابية التي كتبناها ونقحناها معاً
import { api } from "../../../convex/_generated/api"; 
import { Button } from "@modular/ui";
import { Product } from "@modular/types";

// مكون فرعي لعرض كرت المنتج بشكل نظيف
const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
    <div>
      <div className="aspect-square w-full bg-gray-50 rounded-md mb-4 overflow-hidden flex items-center justify-center border border-gray-100">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-400 text-sm">لا توجد صورة</span>
        )}
      </div>
      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
        {product.category}
      </span>
      <h3 className="mt-3 text-lg font-bold text-gray-900">{product.title}</h3>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
    </div>
    
    <div className="mt-6 flex items-center justify-between">
      <div>
        <span className="text-xl font-extrabold text-gray-900">${product.price}</span>
        {product.compareAtPrice && (
          <span className="text-sm text-gray-400 line-through ml-2">${product.compareAtPrice}</span>
        )}
      </div>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        المخزن: {product.stock}
      </span>
    </div>
  </div>
);

export default function App() {
  // 1. جلب المنتجات حياً من السحاب (Real-time Query)
  const products = useQuery(api.products.get);
  
  // 2. دالة الإضافة السحابية (Mutation)
  const createProduct = useMutation(api.products.create);

  // دالة تجريبية سريعة لإضافة منتج ببيانات حقيقية للتأكد من عمل المنظومة
  const handleAddSampleProduct = async () => {
    try {
      await createProduct({
        title: `منتج سحابي #${Math.floor(Math.random() * 1000)}`,
        description: "هذا المنتج تم إنشاؤه وضخه مباشرة من لوحة التحكم إلى قاعدة بيانات Convex السحابية بنجاح.",
        price: 99,
        compareAtPrice: 149,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
        category: "إلكترونيات",
        stock: 45,
        sku: `PROD-${Date.now().toString().slice(-5)}`
      });
      console.log("تم إضافة المنتج بنجاح إلى السحاب!");
    } catch (error) {
      console.error("خطأ أثناء إضافة المنتج:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* الهيدر */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">لوحة تحكم النظام الموديولاري</h1>
            <p className="mt-2 text-sm text-gray-600">إدارة المنتجات المتصلة بقاعدة البيانات الحية في الوقت الفعلي.</p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* استخدام زر الـ UI المشترك من حزمة packages/ui */}
            <Button  onClick={handleAddSampleProduct}>
              ➕ إضافة منتج تجريبي للسحاب
            </Button>
          </div>
        </div>

        {/* حالة التحميل البصري */}
        {products === undefined && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">جاري الاتصال بالسحاب وجلب البيانات الحية...</p>
          </div>
        )}

        {/* حالة عدم وجود منتجات */}
        {products !== undefined && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 p-12">
            <p className="text-xl font-medium text-gray-600">لا توجد منتجات في قاعدة البيانات حالياً.</p>
            <p className="mt-2 text-sm text-gray-400">اضغط على زر "إضافة منتج تجريبي" بالأعلى لضخ أول عنصر.</p>
          </div>
        )}

        {/* شبكة المنتجات الحية */}
        {products && products.length > 0 && (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product as unknown as Product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}