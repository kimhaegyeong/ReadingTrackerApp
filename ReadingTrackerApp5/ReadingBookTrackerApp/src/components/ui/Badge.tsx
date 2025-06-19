import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export const Badge = ({ children, color = "#E5E7EB", style, onClick }: BadgeProps) => {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 12,
        background: color,
        color: "#374151",
        fontWeight: 500,
        fontSize: 13,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};