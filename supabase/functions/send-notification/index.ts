
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.13.1/index.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

serve(async (req) => {
  // CORS のプリフライトリクエスト処理
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // リクエストから JSON を取得
    const payload = await req.json() as NotificationPayload;
    
    if (!payload.tokens || payload.tokens.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "送信先のトークンが指定されていません" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Firebase Admin SDK の代わりに直接 FCM HTTP v1 API を使用
    const results = await Promise.all(
      payload.tokens.map(token => sendFcmMessage(token, payload))
    );

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("通知送信エラー:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

// FCM HTTP v1 API を使用してメッセージを送信
async function sendFcmMessage(token: string, payload: NotificationPayload) {
  try {
    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/dap-app-381512/messages:send`;
    
    // Firebase サービスアカウントから取得した秘密鍵（Supabase シークレットに保存）
    const serviceAccountKey = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
    
    if (!serviceAccountKey) {
      throw new Error("Firebase サービスアカウントキーが設定されていません");
    }

    // サービスアカウントキーをパース
    const serviceAccount = JSON.parse(serviceAccountKey);

    // 有効期限を設定（1時間）
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;

    // JWT を作成して署名
    const jwt = await new jose.SignJWT({
      iss: serviceAccount.client_email,
      sub: serviceAccount.client_email,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: exp
    })
    .setProtectedHeader({ alg: "RS256" })
    .sign(await jose.importPKCS8(serviceAccount.private_key, "RS256"));

    // アクセストークンを取得
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error("FCM アクセストークンの取得に失敗しました");
    }

    // FCM API にメッセージを送信
    const response = await fetch(fcmEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify({
        message: {
          token: token,
          notification: {
            title: payload.title,
            body: payload.body
          },
          data: payload.data || {}
        }
      })
    });

    const responseData = await response.json();
    return { token, response: responseData };
  } catch (error) {
    console.error(`トークン ${token} への送信に失敗:`, error);
    return { token, error: error.message };
  }
}
