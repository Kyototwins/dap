
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Profile } from "@/types/messages";

interface ProfileAvatarProps {
  profile: Profile;
  onEditClick: () => void;
}

export function ProfileAvatar({ profile, onEditClick }: ProfileAvatarProps) {
  const genderText = {
    male: "男性",
    female: "女性",
    other: "その他",
    prefer_not_to_say: "回答しない",
  }[profile.gender || ""] || profile.gender;

  const originText = {
    japan: "日本",
    usa: "アメリカ",
    korea: "韓国",
    china: "中国",
    other: "その他",
  }[profile.origin || ""] || profile.origin;

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <Avatar className="w-32 h-32">
          <AvatarImage
            src={profile.avatar_url || "/placeholder.svg"}
            alt="Profile"
          />
          <AvatarFallback>
            {profile.first_name?.[0]}
            {profile.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={onEditClick}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
      <h1 className="mt-4 text-2xl font-bold">
        {profile.first_name} {profile.last_name}
      </h1>
      <div className="mt-2 flex justify-center gap-2 flex-wrap">
        {profile.age && <Badge variant="secondary">{profile.age}歳</Badge>}
        {profile.gender && <Badge variant="secondary">{genderText}</Badge>}
        {profile.origin && <Badge variant="secondary">{originText}</Badge>}
      </div>
    </div>
  );
}
