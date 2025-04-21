
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// ※ 基本サイズ: 横180px/縦72pxに拡大し、左寄せのため余白なしに調整
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/cf0627b7-21bb-46d7-9945-f300b3511965.png"
    alt="DAP Logo"
    style={{ width: 180, height: 72, objectFit: "contain", ...style }}
    className={className + " ml-0"}
    draggable={false}
  />
);
