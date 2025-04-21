
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GENDER_OPTIONS, ORIGIN_OPTIONS, SEXUALITY_OPTIONS } from "../constants/profileOptions";

interface PersonalDetailsProps {
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  aboutMe: string;
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function PersonalDetails({
  age,
  gender,
  origin,
  sexuality,
  aboutMe,
  onChange,
  loading
}: PersonalDetailsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="18"
          max="100"
          value={age}
          onChange={(e) => onChange("age", e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <Select
          value={gender}
          onValueChange={(value) => onChange("gender", value)}
          required
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            {/* options from constants will be translated in constants/profileOptions.ts */}
            {GENDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Origin</Label>
        <Select
          value={origin}
          onValueChange={(value) => onChange("origin", value)}
          required
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select origin" />
          </SelectTrigger>
          <SelectContent>
            {ORIGIN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sexuality</Label>
        <Select
          value={sexuality}
          onValueChange={(value) => onChange("sexuality", value)}
          required
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select sexuality" />
          </SelectTrigger>
          <SelectContent>
            {SEXUALITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aboutMe">About Me</Label>
        <Textarea
          id="aboutMe"
          placeholder="Tell us about your interests and hobbies"
          value={aboutMe}
          onChange={(e) => onChange("aboutMe", e.target.value)}
          className="min-h-[100px]"
          disabled={loading}
        />
      </div>
    </>
  );
}
