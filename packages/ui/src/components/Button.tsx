import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// قمنا بتعريف الـ Props صراحة لضمان الاستقرار الكامل بعيداً عن تغيرات المكتبة الخارجية
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent';
  className?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', className, children, ref, ...rest } = props;

  // قواعد توكنز الألوان والـ Spacing المأخوذة من ملف الـ JSON الخاص بنا
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 px-lg py-sm rounded-button";
  
  const variants: Record<'primary' | 'accent', string> = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover",
    accent: "bg-brand-accent text-neutralTokens-text-main hover:opacity-90"
  };

  return (
    <button
      ref={ref}
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.displayName = 'Button';