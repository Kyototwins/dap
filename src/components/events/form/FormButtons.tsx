
import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  loading: boolean;
  onCancel: () => void;
}

export function FormButtons({ loading, onCancel }: FormButtonsProps) {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-gray-300 hover:bg-gray-50 flex-1 rounded-md"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={loading}
        className="bg-black text-white hover:bg-gray-800 flex-1 rounded-md"
      >
        {loading ? "Creating..." : "Create Event"}
      </Button>
    </div>
  );
}
