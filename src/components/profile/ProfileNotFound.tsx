
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wifi } from "lucide-react";

interface ProfileNotFoundProps {
  message: string;
  offline?: boolean;
  connectionError?: boolean;
}

export function ProfileNotFound({ message, offline = false, connectionError = false }: ProfileNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {(offline || connectionError) && (
        <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          <span>インターネット接続に問題があります</span>
        </div>
      )}
      <img 
        src="/placeholder.svg" 
        alt="Profile not found" 
        className="w-32 h-32 mb-6 opacity-30"
      />
      <h2 className="text-xl font-bold mb-2">プロフィールが見つかりません</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="space-x-4">
        <Button onClick={() => navigate("/")}>ホームに戻る</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          再読み込み
        </Button>
      </div>
    </div>
  );
}
