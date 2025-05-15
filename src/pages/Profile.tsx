
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "アクセスエラー",
        description: "プロフィールを表示するにはログインが必要です。",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate]);

  return <ProfileContainer />;
}
