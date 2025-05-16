
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoSectionProps {
  firstName: string;
  lastName: string;
  university: string;
  department: string;
  year: string;
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  aboutMe: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function BasicInfoSection({
  firstName,
  lastName,
  university,
  department,
  year,
  age,
  gender,
  origin,
  sexuality,
  aboutMe,
  onInputChange,
  onSelectChange,
  loading
}: BasicInfoSectionProps) {
  const yearOptions = [
    { value: "1", label: "1回生" },
    { value: "2", label: "2回生" },
    { value: "3", label: "3回生" },
    { value: "4", label: "4回生" },
    { value: "graduate", label: "大学院生" },
    { value: "other", label: "その他" },
  ];
  
  const sexualityOptions = [
    { value: "straight", label: "Straight" },
    { value: "gay", label: "Gay" },
    { value: "lesbian", label: "Lesbian" },
    { value: "bisexual", label: "Bisexual" },
    { value: "pansexual", label: "Pansexual" },
    { value: "asexual", label: "Asexual" },
    { value: "queer", label: "Queer" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Information</h2>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>姓</Label>
          <Input
            name="firstName"
            value={firstName}
            onChange={onInputChange}
            placeholder="山田"
            disabled={loading}
          />
        </div>
        <div>
          <Label>名</Label>
          <Input
            name="lastName"
            value={lastName}
            onChange={onInputChange}
            placeholder="太郎"
            disabled={loading}
          />
        </div>
      </div>
      
      <div>
        <Label>About Me</Label>
        <Textarea
          className="resize-none min-h-[120px]"
          placeholder="自己紹介を書いてください"
          name="aboutMe"
          value={aboutMe}
          onChange={onInputChange}
          disabled={loading}
        />
      </div>
      
      <div>
        <Label>大学</Label>
        <Input
          name="university"
          value={university}
          onChange={onInputChange}
          placeholder="大学名を入力"
          disabled={loading}
        />
      </div>
      
      <div>
        <Label>学部</Label>
        <Input
          name="department"
          value={department}
          onChange={onInputChange}
          placeholder="学部を入力"
          disabled={loading}
        />
      </div>
      
      <div>
        <Label>学年</Label>
        <Select 
          value={year} 
          onValueChange={(value) => onSelectChange("year", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="学年を選択" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Age</Label>
        <Input
          type="number"
          name="age"
          value={age}
          onChange={onInputChange}
          placeholder="年齢を入力"
          disabled={loading}
        />
      </div>
      
      <div>
        <Label>Gender</Label>
        <Select 
          value={gender} 
          onValueChange={(value) => onSelectChange("gender", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="性別を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Origin</Label>
        <Input
          name="origin"
          value={origin}
          onChange={onInputChange}
          placeholder="出身地を入力"
          disabled={loading}
        />
      </div>
      
      <div>
        <Label>Sexuality</Label>
        <Select 
          value={sexuality} 
          onValueChange={(value) => onSelectChange("sexuality", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="性的指向を選択（任意）" />
          </SelectTrigger>
          <SelectContent>
            {sexualityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
