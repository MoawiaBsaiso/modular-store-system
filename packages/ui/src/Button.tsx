import * as React from "react";

// تعريف الخصائص المتاحة للزر الذكي
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    
    // الستايل الأساسي المشترك لكل الأزرار (تتضمن دعم الـ Dark Mode تلقائياً)
    const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
    
    // ستايلات الألوان المتغيرة (Variants)
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-650 dark:text-white shadow-sm",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
      danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800/50",
    };

    // ستايلات الأحجام المتغيرة (Sizes)
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3.5 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>جاري التحميل...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";