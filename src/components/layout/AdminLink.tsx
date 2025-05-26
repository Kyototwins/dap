
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function AdminLink() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 特定のメールアドレスのみに表示
  if (!user || user.email !== "takerinauni@gmail.com") {
    return null;
  }

  const handleDigestClick = () => {
    console.log("Navigating to digest page");
    navigate("/digest");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleDigestClick}
      className="text-doshisha-purple hover:text-doshisha-purple hover:bg-purple-50"
    >
      <Mail className="w-4 h-4 mr-1" />
      digest
    </Button>
  );
}
