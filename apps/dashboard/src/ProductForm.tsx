import { useState } from "react";
import { InputField } from "@modular/ui";

interface ProductFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    sku: string;
    images: string[];
  }) => Promise<void>;
}

export default function ProductForm({ onSubmit }: ProductFormProps) {
  // إدارة حالة الحقول ببساطة وبشكل محمي
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sku: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.sku) {
      alert("الرجاء تعبئة الحقول الأساسية!");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category || "عام",
        stock: Number(formData.stock) || 0,
        sku: formData.sku,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"], // صورة افتراضية مؤقتاً
      });
      // تصفير الفورم بعد النجاح
      setFormData({ title: "", description: "", price: "", category: "", stock: "", sku: "" });
    } catch (error) {
      console.error("خطأ أثناء إرسال البيانات:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-xl mx-auto mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-3">📦 إضافة منتج جديد للمخزن</h2>
      
      <InputField
        id="title"
        label="اسم المنتج *"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <InputField
        id="sku"
        label="رمز المخزن (SKU) *"
        value={formData.sku}
        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="price"
          label="السعر ($) *"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <InputField
          id="stock"
          label="الكمية في المستودع"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
      </div>

      <InputField
        id="category"
        label="القسم (Category)"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />

      <div className="relative mt-6 mb-4">
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-600 transition-colors text-sm"
          placeholder="وصف تفصيلي عن المنتج..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-gray-300"
      >
        {loading ? "جاري الحفظ وضخ البيانات..." : "💾 حفظ المنتج سحابياً"}
      </button>
    </form>
  );
}