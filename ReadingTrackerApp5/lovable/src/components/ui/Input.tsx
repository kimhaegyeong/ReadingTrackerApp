import React from "react";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
};

export const Input = ({ value, onChange, placeholder, style }: InputProps) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        padding: 10,
        borderRadius: 8,
        border: "1px solid #D1D5DB",
        fontSize: 15,
        outline: "none",
        ...style,
      }}
    />
  );
};
