
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoSectionProps {
  university: string;
  department: string;
  year: string;
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function BasicInfoSection({
  university,
  department,
  year,
  age,
  gender,
  origin,
  sexuality,
  onInputChange,
  onSelectChange,
  loading
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Basic Information</h2>
      <Separator />
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              name="university"
              value={university}
              onChange={onInputChange}
              placeholder="Enter your university"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              name="department"
              value={department}
              onChange={onInputChange}
              placeholder="Enter your department"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={year}
              onValueChange={(value) => onSelectChange("year", value)}
              disabled={loading}
            >
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Year 1</SelectItem>
                <SelectItem value="2">Year 2</SelectItem>
                <SelectItem value="3">Year 3</SelectItem>
                <SelectItem value="4">Year 4</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={age}
              onChange={onInputChange}
              placeholder="Enter your age"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={gender}
              onValueChange={(value) => onSelectChange("gender", value)}
              disabled={loading}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin">Country of Origin</Label>
            <Input
              id="origin"
              name="origin"
              value={origin}
              onChange={onInputChange}
              placeholder="Enter your country of origin"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sexuality">Sexuality</Label>
            <Select
              value={sexuality}
              onValueChange={(value) => onSelectChange("sexuality", value)}
              disabled={loading}
            >
              <SelectTrigger id="sexuality">
                <SelectValue placeholder="Select sexuality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="gay">Gay</SelectItem>
                <SelectItem value="lesbian">Lesbian</SelectItem>
                <SelectItem value="bisexual">Bisexual</SelectItem>
                <SelectItem value="pansexual">Pansexual</SelectItem>
                <SelectItem value="queer">Queer</SelectItem>
                <SelectItem value="asexual">Asexual</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
