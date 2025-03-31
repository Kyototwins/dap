
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENT_OPTIONS, YEAR_OPTIONS } from "../constants/profileOptions";

interface UniversityFieldsProps {
  university: string;
  department: string;
  year: string;
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function UniversityFields({ 
  university, 
  department, 
  year, 
  onChange, 
  loading 
}: UniversityFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="university">大学</Label>
        <Input
          id="university"
          placeholder="〇〇大学"
          value={university}
          onChange={(e) => onChange("university", e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">学部</Label>
        <Select
          value={department}
          onValueChange={(value) => onChange("department", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="学部を選択" />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="year">学年</Label>
        <Select
          value={year}
          onValueChange={(value) => onChange("year", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="学年を選択" />
          </SelectTrigger>
          <SelectContent>
            {YEAR_OPTIONS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
