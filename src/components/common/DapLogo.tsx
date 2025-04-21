
import React from "react";

interface DapLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// 画像を幅120px・高さ48pxに縮小し、左マージン-5に調整
export const DapLogo: React.FC<DapLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/78b54ef9-c522-4028-bca2-1864dd1be91f.png"
    alt="DAP Logo"
    style={{ width: 120, height: 48, objectFit: "contain", marginLeft: -5, ...style }}
    className={className}
    draggable={false}
  />
);
