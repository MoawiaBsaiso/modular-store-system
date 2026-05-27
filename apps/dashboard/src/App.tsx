import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api"; 
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import ProductForm from "./ProductForm";
import { Button, ThemeToggle } from "@modular/ui";

interface ConvexProduct {
  _id: string;
  _creationTime: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  images: string[];
}

interface ConvexOrder {
  _id: string;
  _creationTime: number;
  customerName: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
  items: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }[];
}

export default function App() {
  const products = useQuery(api.products.get);
  const orders = useQuery(api.orders.getAlldetails);
  const createProduct = useMutation(api.products.create);
  const updateOrderStatus = useMutation(api.orders.updateStatus);

  const handleAddProduct = async (productData: any) => {
    await createProduct(productData);
  };

  const handleStatusChange = async (orderId: any, newStatus: string) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus });
    } catch (error) {
      console.error("خطأ أثناء تحديث حالة الطلب:", error);
    }
  };

  return (
  // 🌌 الخلفية الأساسية أصبحت Slate ناعم ومريح جداً للعين أثناء الليل
  <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 font-sans" dir="rtl">
    
    {/* 🔒 1. الحالة الأولى: إذا كان المستخدم غير مسجل الدخول */}
    <Unauthenticated>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-indigo-950 text-white p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl text-center">
          <span className="text-5xl">🔐</span>
          <h1 className="text-2xl font-black tracking-tight mt-4">بوابة المشرفين المركزية</h1>
          <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
            هذه اللوحة محجوبة ومحمية بالكامل. يرجى تسجيل الدخول بصفتك مديراً للنظام للوصول إلى الجرد والمبيعات.
          </p>
          <div className="mt-8">
            <SignInButton mode="redirect">
              <Button className="w-full" size="lg">
                🔑 تسجيل الدخول الآمن
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>
    </Unauthenticated>

    {/* ✅ 2. الحالة الثانية: المشرف الموثق */}
    <Authenticated>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* هيدر اللوحة اللطيف */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-950 dark:text-slate-100 tracking-tight">لوحة تحكم النظام الموديولاري</h1>
              <p className="mt-2 text-sm text-slate-650 dark:text-slate-400">إدارة المستودع المركزي، مراقبة المبيعات، وتحديث الحالات حياً.</p>
            </div>
            
            {/* صندوق المشرف العلوي بألوان متناغمة */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 px-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
              <ThemeToggle />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المدير الحالي</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* قسم الإدخال والجرد */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <ProductForm onSubmit={handleAddProduct} />
            </div>

            {/* كارت جرد المنتجات بستايل الـ Glassmorphism المظلم الفخم */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/60 dark:backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">📦 جرد المنتجات الحالي بالمخازن</h2>
              {products === undefined ? (
                <div className="text-center py-6 animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-100/70 dark:bg-slate-800/50 rounded-lg">
                      <tr>
                        <th className="px-4 py-3">المنتج</th>
                        <th className="px-4 py-3">SKU</th>
                        <th className="px-4 py-3">السعر</th>
                        <th className="px-4 py-3">المخزون المتبقي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {products.map((p: any) => (
                        <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-200">{p.title}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-400 dark:text-slate-500">{p.sku}</td>
                          <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">${p.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              p.stock > 0 
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" 
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            }`}>
                              {p.stock} قطعة
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* قسم إدارة الطلبات والمبيعات الحية اللطيف */}
          <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">🛒 طلبات الزبائن الواردة حياً</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">تتدفق الطلبات إلى هنا فور نقر الزبون على زر التأكيد في المتجر.</p>
              </div>
              <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
                إجمالي الطلبات: {orders?.length || 0}
              </span>
            </div>

            {orders === undefined && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            )}

            {orders && orders.length === 0 && (
              <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <p className="text-slate-500 dark:text-slate-400 text-sm">لا توجد طلبات مبيعات حتى الآن. جرب شراء منتج من بوابة الزبائن!</p>
              </div>
            )}

            {orders && orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right table-auto">
                  <thead className="bg-slate-100/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg">
                    <tr>
                      <th className="px-4 py-3">الزبون</th>
                      <th className="px-4 py-3">المنتجات المطلوبة</th>
                      <th className="px-4 py-3">إجمالي الحساب</th>
                      <th className="px-4 py-3">حالة الطلب الحالية</th>
                      <th className="px-4 py-3 text-center">الإجراءات والسوقيات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {orders.map((order: ConvexOrder) => (
                      <tr key={order._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-200">{order.customerName}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{order.customerPhone}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="text-sm text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">x{item.quantity}</span>
                                <span>{item.title}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">(${item.price})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-black text-slate-900 dark:text-slate-100">${order.totalPrice}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === "pending" 
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" 
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          }`}>
                            {order.status === "pending" ? "⏳ قيد المعالجة" : "🚚 تم الشحن للعميل"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {order.status === "pending" ? (
                            <Button variant="primary" size="sm" onClick={() => handleStatusChange(order._id as any, "shipped")}>
                              📦 شحن المنتج الآن
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">كامل وجاهز</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </Authenticated>

  </div>
);
}