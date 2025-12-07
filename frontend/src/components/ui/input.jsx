import React, { forwardRef } from "react";

export const Input = forwardRef(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`ui-input ${className}`} {...props} />
));

Input.displayName = "Input";

export default Input;
