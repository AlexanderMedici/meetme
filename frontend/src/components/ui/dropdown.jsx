import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const DropdownContext = createContext(null);

export const Dropdown = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = useState(open ?? false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback((next) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleClickOutside = (e) => {
      if (
        contentRef.current?.contains(e.target) ||
        triggerRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, setOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, setOpen, triggerRef, contentRef }}>
      <div className="ui-dropdown">{children}</div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger = ({ as: Comp = "button", className = "", ...props }) => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownTrigger must be used inside Dropdown");
  const { isOpen, setOpen, triggerRef } = ctx;
  return (
    <Comp
      ref={triggerRef}
      className={`ui-dropdown__trigger ${className}`}
      aria-expanded={isOpen}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(!isOpen);
      }}
      {...props}
    />
  );
};

export const DropdownContent = ({
  align = "end",
  className = "",
  style,
  children,
  width = 220,
}) => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("DropdownContent must be used inside Dropdown");
  const { isOpen, contentRef } = ctx;

  const computedStyle = {
    minWidth: width,
    ...style,
  };

  const alignmentClass = align === "start" ? "ui-dropdown__content--start" : "ui-dropdown__content--end";

  if (!isOpen) return null;

  return (
    <div className="ui-dropdown__portal">
      <div
        className={`ui-dropdown__content ${alignmentClass} ${className}`}
        ref={contentRef}
        data-align={align}
        style={computedStyle}
      >
        {children}
      </div>
    </div>
  );
};

export const DropdownItem = ({ as: Comp = "button", className = "", ...props }) => (
  <Comp className={`ui-dropdown__item ${className}`} {...props} />
);

export const DropdownSeparator = () => <div className="ui-dropdown__separator" />;

export default Dropdown;
