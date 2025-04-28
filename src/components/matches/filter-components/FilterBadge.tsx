
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterBadgeProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function FilterBadge({ label, isSelected, onClick }: FilterBadgeProps) {
  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "cursor-pointer",
        isSelected
          ? "bg-[#7f1184] text-white hover:bg-[#671073]"
          : "bg-white text-[#7f1184] hover:bg-[#f3e8ff]"
      )}
      onClick={onClick}
    >
      {label}
    </Badge>
  );
}

