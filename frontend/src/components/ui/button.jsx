import React from "react";

const variantClasses = {
  default: "ui-btn--default",
  outline: "ui-btn--outline",
  ghost: "ui-btn--ghost",
  secondary: "ui-btn--secondary",
};

const sizeClasses = {
  sm: "ui-btn--sm",
  md: "ui-btn--md",
  lg: "ui-btn--lg",
};

export const Button = ({
  as: Comp = "button",
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  return (
    <Comp className={`ui-btn ${variantClass} ${sizeClass} ${className}`} {...props} />
  );
};

export default Button;
