
import { FrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProfileNotFoundProps {
  message: string;
  offline?: boolean;
  connectionError?: boolean;
}

export function ProfileNotFound({ message, offline = false, connectionError = false }: ProfileNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FrownIcon className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">プロフィールが見つかりません</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      
      {offline && (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md mb-6 max-w-md">
          インターネット接続がオフラインのようです。接続を確認してください。
        </div>
      )}
      
      {connectionError && (
        <div className="p-4 bg-red-50 text-red-800 rounded-md mb-6 max-w-md">
          サーバー接続エラーが発生しました。しばらくしてからもう一度お試しください。
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.location.reload()}>
          再読み込み
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          ホームに戻る
        </Button>
      </div>
    </div>
  );
}
