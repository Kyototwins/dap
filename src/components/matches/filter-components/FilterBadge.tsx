
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
          ? "bg-[#7F1184] text-white hover:bg-[#671073]"
          : "bg-white text-[#7F1184] hover:bg-[#E5DEFF]"
      )}
      onClick={onClick}
    >
      {label}
    </Badge>
  );
}
