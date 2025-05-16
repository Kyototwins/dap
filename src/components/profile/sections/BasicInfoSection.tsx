
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
  const universityOptions = [
    { value: "doshisha", label: "同志社大学" },
    { value: "ritsumeikan", label: "立命館大学" },
    { value: "kansai", label: "関西大学" },
    { value: "kwangaku", label: "関西学院大学" },
  ];

  const yearOptions = [
    { value: "1", label: "1回生" },
    { value: "2", label: "2回生" },
    { value: "3", label: "3回生" },
    { value: "4", label: "4回生" },
    { value: "graduate", label: "大学院生" },
    { value: "other", label: "その他" },
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
        <Label>大学</Label>
        <Select 
          value={university} 
          onValueChange={(value) => onSelectChange("university", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="大学を選択" />
          </SelectTrigger>
          <SelectContent>
            {universityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Input
          name="sexuality"
          value={sexuality}
          onChange={onInputChange}
          placeholder="性的指向を入力（任意）"
          disabled={loading}
        />
      </div>
      
      <div>
        <Label>About Me</Label>
        <Textarea
          className="resize-none"
          placeholder="自己紹介を書いてください"
          name="aboutMe"
          value={aboutMe}
          onChange={onInputChange}
          disabled={loading}
        />
      </div>
    </div>
  );
}
