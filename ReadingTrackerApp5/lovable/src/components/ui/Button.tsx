import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export const Button = ({ children, onClick, style, disabled }: ButtonProps) => {
  return (
    <button
      style={{
        padding: 12,
        borderRadius: 8,
        background: disabled ? "#E5E7EB" : "#4F46E5",
        color: disabled ? "#A3A3A3" : "#fff",
        border: "none",
        fontWeight: 600,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
