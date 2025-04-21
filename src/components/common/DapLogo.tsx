
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// 画像を幅150px・高さ60pxに縮小し、左寄せで余白なしに調整
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/78b54ef9-c522-4028-bca2-1864dd1be91f.png"
    alt="DAP Logo"
    style={{ width: 150, height: 60, objectFit: "contain", ...style }}
    className={className + " ml-0"}
    draggable={false}
  />
);

