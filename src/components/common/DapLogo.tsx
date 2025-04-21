
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// ※ 基本サイズ: 横120px/縦48px、親で必要に応じ調整してください
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/cf0627b7-21bb-46d7-9945-f300b3511965.png"
    alt="DAP Logo"
    style={{ width: 120, height: 48, objectFit: "contain", ...style }}
    className={className}
    draggable={false}
  />
);
