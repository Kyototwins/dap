
import { AuthLayout } from "@/components/auth/AuthLayout";

export function ProfileLoading() {
  return (
    <AuthLayout
      title="プロフィール設定"
      subtitle="読み込み中..."
    >
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </AuthLayout>
  );
}
