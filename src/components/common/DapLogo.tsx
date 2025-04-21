
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// 画像を幅180px・高さ72pxに縮小し、左寄せで余白なしに調整
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/78b54ef9-c522-4028-bca2-1864dd1be91f.png"
    alt="DAP Logo"
    style={{ width: 180, height: 72, objectFit: "contain", ...style }}
    className={className + " ml-0"}
    draggable={false}
  />
);
