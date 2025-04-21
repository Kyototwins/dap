
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// ※ 基本サイズ: 横220px/縦88pxに拡大し、左寄せのため余白なしに調整
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/78b54ef9-c522-4028-bca2-1864dd1be91f.png"
    alt="DAP Logo"
    style={{ width: 220, height: 88, objectFit: "contain", ...style }}
    className={className + " ml-0"}
    draggable={false}
  />
);
