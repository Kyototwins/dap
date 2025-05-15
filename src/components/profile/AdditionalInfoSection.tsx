
import React from "react";
import { AdditionalQuestions } from "@/components/profile/AdditionalQuestions";
import { Separator } from "@/components/ui/separator";

interface AdditionalInfoSectionProps {
  additionalData: {
    idealDate: string;
    lifeGoal: string;
    superpower: string;
    worstNightmare: string;
    friendActivity: string;
    bestQuality: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  loading?: boolean;
}

export function AdditionalInfoSection({
  additionalData,
  onChange,
  loading
}: AdditionalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">追加情報</h2>
      <Separator />
      <AdditionalQuestions
        data={additionalData}
        onChange={onChange}
        loading={loading}
      />
    </div>
  );
}
