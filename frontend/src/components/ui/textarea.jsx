import React, { forwardRef } from "react";

export const Textarea = forwardRef(({ className = "", ...props }, ref) => (
  <textarea ref={ref} className={`ui-textarea ${className}`} {...props} />
));

Textarea.displayName = "Textarea";

export default Textarea;
