import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api"; 
import ProductForm from "./ProductForm";

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

const ProductCard = ({ product }: { product: ConvexProduct }) => (
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
      </div>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        المخزن: {product.stock}
      </span>
    </div>
  </div>
);

export default function App() {
  const products = useQuery(api.products.get);
  const createProduct = useMutation(api.products.create);

  // دالة الاستقبال الحقيقية التي تأخذ البيانات من الـ Form وتمررها لـ Convex
  const handleAddProduct = async (productData: any) => {
    await createProduct(productData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* الهيدر */}
        <div className="text-center border-b border-gray-200 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">لوحة تحكم النظام الموديولاري</h1>
          <p className="mt-2 text-sm text-gray-600">إدارة ومراقبة المخزن المركزي حياً وبث التحديثات للـ Storefront.</p>
        </div>

        {/* نموذج الإدخال الجديد والمتحرك */}
        <ProductForm onSubmit={handleAddProduct} />

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📦 المنتجات الحالية في المستودع السحابي</h2>

          {/* حالة التحميل البصري */}
          {products === undefined && (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          )}

          {/* شبكة المنتجات الحية */}
          {products && products.length > 0 && (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product as unknown as ConvexProduct} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}