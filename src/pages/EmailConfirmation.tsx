
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DapLogo } from "@/components/common/DapLogo";

export default function EmailConfirmation() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Check if there's a session - this means email was already confirmed
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session) {
          setStatus("success");
          return;
        }
        
        // If no session, we need to process the email confirmation
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error verifying email:", error);
          setErrorMessage(error.message);
          setStatus("error");
          return;
        }
        
        if (data?.user?.email_confirmed_at) {
          setStatus("success");
        } else {
          setErrorMessage("メールアドレスの確認が完了していないようです。");
          setStatus("error");
        }
      } catch (error: any) {
        console.error("Error during verification:", error);
        setErrorMessage(error.message || "確認処理中にエラーが発生しました。");
        setStatus("error");
      }
    };

    handleEmailConfirmation();
  }, []);

  return (
    <AuthLayout
      title="Email Confirmation"
      subtitle="Verifying your email address"
    >
      <div className="flex flex-col items-center justify-center space-y-6 text-center animate-fade-up">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 text-[#7f1184] animate-spin" />
            <h2 className="text-lg font-semibold">確認中...</h2>
            <p className="text-gray-500">メールアドレスの確認を処理しています。</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">DAPへようこそ!</h2>
            <p className="text-gray-600 mb-4">
              メールアドレスの確認が完了しました。<br />
              同志社大学での国際交流を楽しみましょう！
            </p>
            <DapLogo className="w-24 h-24 my-4" />
            <div className="flex flex-col space-y-3 w-full max-w-xs">
              <Button 
                onClick={() => navigate("/login")}
                className="w-full bg-[#7f1184] hover:bg-[#671073]"
              >
                ログイン
              </Button>
              <Link to="/" className="text-[#7f1184] hover:underline">
                ホームページに戻る
              </Link>
            </div>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">確認エラー</h2>
            <p className="text-gray-600 mb-4">
              {errorMessage || "メールアドレスの確認処理中にエラーが発生しました。"}
            </p>
            <div className="flex flex-col space-y-3 w-full max-w-xs">
              <Button 
                onClick={() => navigate("/login")}
                className="w-full"
              >
                ログイン画面へ
              </Button>
              <Link to="/" className="text-[#7f1184] hover:underline">
                ホームページに戻る
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
