
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface FormSectionTitleProps {
  htmlFor?: string;
  children: ReactNode;
  optional?: boolean;
}

export function FormSectionTitle({ htmlFor, children, optional }: FormSectionTitleProps) {
  return (
    <Label htmlFor={htmlFor} className="space-y-2">
      {children}
      {optional && <span className="text-xs text-gray-500 ml-1">(optional)</span>}
    </Label>
  );
}
