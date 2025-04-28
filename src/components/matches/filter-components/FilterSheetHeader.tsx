
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function FilterSheetHeader() {
  return (
    <SheetHeader>
      <SheetTitle>Filter Settings</SheetTitle>
      <SheetDescription>
        Please set your matching criteria
      </SheetDescription>
    </SheetHeader>
  );
}
