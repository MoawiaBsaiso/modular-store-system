import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api"; 
import { useState } from "react";
import { useCart } from "./context/CartContext"; // استدعاء السلة الذكية
import { ThemeToggle } from "@modular/ui";

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
  const products = useQuery(api.products.get);
  const placeOrder = useAction(api.orders.placeOrder);

  // استهلاك دوال وحالة السلة من الـ Context الأصلي الخاص بك
  const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();

  // حالات التحكم في النوافذ المنبثقة
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // دالة إرسال السلة كاملة كسلة مشتريات مركبة (المنطق الأصلي)
  const handleCartCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert("الرجاء إدخال الاسم ورقم الهاتف!");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        productId: item.id as any,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }));

      await placeOrder({
        customerName,
        customerPhone,
        totalPrice: cartTotal,
        items: orderItems,
      });

      setOrderSuccess(true);
      clearCart(); // تفريغ السلة بعد نجاح الشراء
      
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setOrderSuccess(false);
        setIsCartOpen(false);
        setCustomerName("");
        setCustomerPhone("");
      }, 2500);
    } catch (error: any) {
      alert(error.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌌 الخلفية الأساسية أصبحت Slate ناعم ومريح جداً للعين متناسق مع لوحة التحكم
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 font-sans relative" dir="rtl">
      
      {/* 1. البار العلوي المشترك مع عداد السلة الحي */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider">MODULAR_SHOP</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 px-2.5 py-1 rounded-md font-bold">بوابة الزبائن</span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-2 px-5 border border-transparent dark:border-slate-700 text-sm font-bold"
              >
                <span>🛒 سلة المشتريات</span>
                <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. بانر المتجر العصري */}
      <header className="bg-gradient-to-r from-slate-900 to-indigo-950 py-16 text-center text-white px-4 border-b border-slate-200 dark:border-slate-900">
        <h1 className="text-3xl font-black sm:text-4xl tracking-tight">منظومة التسوق المتكاملة</h1>
        <p className="mt-2 text-indigo-200/80 text-sm max-w-md mx-auto leading-relaxed">
          أضف أكثر من منتج إلى سلتك، واشحنها كلها دفعة واحدة في طلب مركب حقيقي ومراقب حياً.
        </p>
      </header>

      {/* 3. شبكة المنتجات الحية للزبون */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products === undefined && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {products && products.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/40 p-12">
            <p className="text-slate-500 dark:text-slate-400">المتجر فارغ حالياً.</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: ConvexProduct) => (
              <div 
                key={product._id} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex flex-col justify-between p-5 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  <div className="aspect-square w-full bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden mb-4 border border-slate-100/60 dark:border-slate-800/40">
                    <img src={product.images?.[0]} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{product.title}</h3>
                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">المخزن الحالي: {product.stock} قطع</p>
                </div>

                <div className="mt-5">
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4">${product.price}</div>
                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className={`w-full font-bold py-3 px-4 rounded-xl text-sm transition-all active:scale-98 shadow-sm ${
                      product.stock > 0 
                        ? "bg-slate-900 text-white dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700" 
                        : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {product.stock > 0 ? "🛒 أضف إلى السلة" : "❌ نفذت الكمية"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🪟 4. اللوحة الجانبية للسلة (The Cart Sidebar / Drawer) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* الخلفية الشفافة المظلمة اللطيفة */}
            <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"></div>

            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300">
                <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-100 dark:border-slate-800">
                  
                  {/* رأس السلة الجانبية */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">محتويات سلتك ({cartCount})</h3>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg transition-colors font-bold text-base">✕</button>
                  </div>

                  {/* قائمة المنتجات المضافة في السلة */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-20 text-slate-400 text-sm">سلتك فارغة تماماً، أضف بعض المنتجات!</div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100/60 dark:border-slate-800/60">
                          <img src={item.image} className="w-14 h-14 object-cover rounded-lg bg-white dark:bg-slate-950 border border-transparent dark:border-slate-800" />
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">{item.title}</h4>
                            <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mt-1">${item.price}</div>
                          </div>
                          
                          {/* أزرار زيادة ونقصان الكمية الأصلية */}
                          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-600 px-1">+</button>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-600 dark:text-slate-400 font-bold hover:text-rose-600 px-1">-</button>
                          </div>

                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 rounded-lg transition-colors">حذف</button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* فوتر السلة الجانبية */}
                  {cart.length > 0 && (
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex justify-between items-center mb-6 text-slate-900 dark:text-slate-100">
                        <span className="text-sm font-bold text-slate-500">الحساب الإجمالي:</span>
                        <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${cartTotal}</span>
                      </div>
                      <button 
                        onClick={() => setIsCheckoutOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-center text-sm transition-all active:scale-98 shadow-md"
                      >
                        💳 الانتقال لتأكيد الدفع والطلب
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📦 5. نافذة إدخال بيانات الشحن النهائي (Checkout Modal) الملونة ليلياً */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-transparent dark:border-slate-800">
            <button onClick={() => !loading && setIsCheckoutOpen(false)} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-base">✕</button>

            {orderSuccess ? (
              <div className="text-center py-8">
                <span className="text-5xl animate-bounce block">🎉</span>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-4">تم شحن الطلب المركب سحابياً!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">ستظهر السلة الإجمالية للمشرفين في الحال حية.</p>
              </div>
            ) : (
              <form onSubmit={handleCartCheckoutSubmit}>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">إتمام الشراء وتأكيد السلة</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">عدد الأصناف: <strong className="text-slate-900 dark:text-slate-100 font-bold">{cartCount}</strong> | المبلغ الكلي: <strong className="text-indigo-600 dark:text-indigo-400 font-black">${cartTotal}</strong></p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">اسم العميل *</label>
                    <input 
                      type="text" 
                      required 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 px-4 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 transition-colors" 
                      placeholder="مؤيد بسيسو" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">رقم الجوال للتواصل *</label>
                    <input 
                      type="tel" 
                      required 
                      value={customerPhone} 
                      onChange={(e) => setCustomerPhone(e.target.value)} 
                      className="w-full text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 px-4 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 transition-colors text-left font-mono" 
                      placeholder="059XXXXXXXX" 
                      dir="ltr" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all active:scale-98 shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
                >
                  {loading ? "جاري حجز السلة وتحديث المخازن..." : "🚀 تأكيد وشحن الطلب بالكامل"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}