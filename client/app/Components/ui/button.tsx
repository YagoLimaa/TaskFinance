import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "outline" | "solid";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  size = "md",
  asChild = false,
  className,
  children,
  ...props
}) => {
  const Component = asChild ? "span" : "button";

  const classes = clsx(
    "inline-flex items-center justify-center font-medium rounded-md transition",
    {
      "bg-blue-600 text-white hover:bg-blue-700": variant === "solid",
      "border border-gray-300 text-gray-700 hover:bg-gray-100": variant === "outline",
      "text-gray-600 hover:text-blue-600": variant === "ghost",
      "px-4 py-2 text-sm": size === "sm",
      "px-6 py-3 text-md": size === "md",
      "px-8 py-4 text-lg": size === "lg",
      "p-2": size === "icon",
    },
    className
  );

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Button;
