
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import { FilterState } from "@/types/matches";

interface FilterSheetFooterProps {
  onReset: () => void;
  onClose: () => void;
}

export function FilterSheetFooter({ onReset, onClose }: FilterSheetFooterProps) {
  return (
    <SheetFooter className="flex gap-2 pt-4 border-t">
      <Button 
        variant="outline" 
        onClick={onReset}
        className="flex-1"
      >
        Reset
      </Button>
      <Button 
        onClick={onClose}
        className="flex-1 bg-doshisha-purple hover:bg-doshisha-darkPurple"
      >
        Apply
      </Button>
    </SheetFooter>
  );
}
