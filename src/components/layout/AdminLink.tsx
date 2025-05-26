
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function AdminLink() {
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  if (!isAdmin) {
    return null;
  }

  const handleAdminClick = () => {
    console.log("Navigating to admin page");
    navigate("/admin");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleAdminClick}
      className="text-doshisha-purple hover:text-doshisha-purple hover:bg-purple-50"
    >
      <Shield className="w-4 h-4 mr-1" />
      管理者
    </Button>
  );
}
