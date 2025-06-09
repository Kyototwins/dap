import React from "react";

interface DipLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

// Update to use the new DIP logo
export const DipLogo: React.FC<DipLogoProps> = ({ className = "", style }) => (
  <img
    src="/lovable-uploads/54190604-1198-4082-aa3f-3feed91a0a5a.png"
    alt="DIP Logo"
    style={{ width: 120, height: 48, objectFit: "contain", marginLeft: -15, ...style }}
    className={className}
    draggable={false}
  />
);

// Keep backwards compatibility
export const DapLogo = DipLogo;
