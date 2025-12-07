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

export const DialogHeader = ({ className = "", ...props }) => (
  <div className={`ui-dialog-header ${className}`} {...props} />
);

export const DialogTitle = ({ className = "", ...props }) => (
  <h3 className={`ui-dialog-title ${className}`} {...props} />
);

export const DialogDescription = ({ className = "", ...props }) => (
  <p className={`ui-dialog-description ${className}`} {...props} />
);

export const DialogFooter = ({ className = "", ...props }) => (
  <div className={`ui-dialog-footer ${className}`} {...props} />
);

export const DialogBody = ({ className = "", ...props }) => (
  <div className={`ui-dialog-body ${className}`} {...props} />
);

export default Dialog;
