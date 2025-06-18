import React, { useEffect } from "react";

type ToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  duration?: number;
};

export const Toast = ({ message, open, onClose, duration = 2000 }: ToastProps) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#111827",
        color: "#fff",
        padding: "14px 32px",
        borderRadius: 24,
        fontSize: 16,
        fontWeight: 500,
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        zIndex: 2000,
        opacity: 0.95,
      }}
    >
      {message}
    </div>
  );
};