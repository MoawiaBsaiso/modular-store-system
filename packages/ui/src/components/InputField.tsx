import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = ({ label, error, id, ...props }: InputFieldProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  // تأثير حركي باستخدام GSAP عند تفاعل المستخدم مع الحقل
  const handleFocus = () => {
    gsap.to(labelRef.current, {
      y: -36,
      scale: 1,
      color: "#4f46e5", // لون Indigo 600
      duration: 0.25,
      ease: "power2.out"
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // إذا كان الحقل فارغاً، يعود الـ Label لمكانه الطبيعي
    if (!e.target.value) {
      gsap.to(labelRef.current, {
        y: 0,
        scale: 1,
        color: "#9ca3af", // لون Gray 400
        duration: 0.25,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <div ref={containerRef} className="relative mt-6 mb-4 font-sans" dir="rtl">
      <input
        id={id}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600 transition-colors bg-white shadow-sm text-sm"
        placeholder={label}
      />
      <label
        ref={labelRef}
        htmlFor={id}
        className="absolute right-4 top-3.5 text-sm text-gray-400 pointer-events-none origin-right transform"
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium animate-pulse">{error}</p>
      )}
    </div>
  );
};