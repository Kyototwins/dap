
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// ※ 基本サイズ: 横120px/縦48px、親で必要に応じ調整してください
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/9797c959-5651-45e5-b6fc-2d1ff0c0b223.png"
    alt="DAP Logo"
    style={{ width: 120, height: 48, objectFit: "contain", ...style }}
    className={className}
    draggable={false}
  />
);
