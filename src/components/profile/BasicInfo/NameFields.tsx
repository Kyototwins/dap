
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function NameFields({ firstName, lastName, onChange, loading }: NameFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">姓</Label>
        <Input
          id="firstName"
          placeholder="山田"
          value={firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">名</Label>
        <Input
          id="lastName"
          placeholder="太郎"
          value={lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          required
          disabled={loading}
        />
      </div>
    </div>
  );
}
