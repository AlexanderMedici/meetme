import React, { useEffect } from "react";

export const Dialog = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (e.key === "Escape") onOpenChange?.(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="ui-dialog-portal"
      onClick={() => onOpenChange?.(false)}
      role="dialog"
      aria-modal="true"
    >
      <div className="ui-dialog-overlay" />
      <div className="ui-dialog-positioner">
        <div
          className="ui-dialog-content"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const DialogHeader = ({ className = "", children, ...props }) => (
  <div className={`ui-dialog-header ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle = ({ className = "", children, ...props }) => (
  <h3 className={`ui-dialog-title ${className}`} {...props}>
    {children}
  </h3>
);

export const DialogDescription = ({ className = "", children, ...props }) => (
  <p className={`ui-dialog-description ${className}`} {...props}>
    {children}
  </p>
);

export const DialogFooter = ({ className = "", children, ...props }) => (
  <div className={`ui-dialog-footer ${className}`} {...props}>
    {children}
  </div>
);

export const DialogBody = ({ className = "", children, ...props }) => (
  <div className={`ui-dialog-body ${className}`} {...props}>
    {children}
  </div>
);

export default Dialog;
