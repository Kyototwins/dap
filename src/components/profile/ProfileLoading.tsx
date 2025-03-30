
import { Loader2 } from "lucide-react";

export function ProfileLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}
