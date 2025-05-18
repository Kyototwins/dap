
import { useAuthOperations } from "./useAuthOperations";

export type { AuthFormData } from "@/types/auth";

export function useAuth() {
  const authOperations = useAuthOperations();
  
  return {
    ...authOperations
  };
}
