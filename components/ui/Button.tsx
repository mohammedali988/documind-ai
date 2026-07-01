import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    let variantStyles = "";
    switch (variant) {
      case "default":
        variantStyles =
          "bg-indigo-600 text-white shadow hover:bg-indigo-700 active:bg-indigo-800";
        break;
      case "destructive":
        variantStyles =
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800";
        break;
      case "outline":
        variantStyles =
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900";
        break;
      case "secondary":
        variantStyles = "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200";
        break;
      case "ghost":
        variantStyles = "hover:bg-gray-100 hover:text-gray-900";
        break;
      case "link":
        variantStyles = "text-indigo-600 underline-offset-4 hover:underline";
        break;
    }

    let sizeStyles = "";
    switch (size) {
      case "default":
        sizeStyles = "h-9 px-4 py-2";
        break;
      case "sm":
        sizeStyles = "h-8 rounded-md px-3 text-xs";
        break;
      case "lg":
        sizeStyles = "h-10 rounded-md px-8";
        break;
      case "icon":
        sizeStyles = "h-9 w-9";
        break;
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
