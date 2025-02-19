
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  aboutMe: string;
  university: string;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function ProfileForm({ formData, onChange, loading }: ProfileFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">姓</Label>
          <Input
            id="firstName"
            placeholder="山田"
            value={formData.firstName}
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
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">大学</Label>
        <Input
          id="university"
          placeholder="〇〇大学"
          value={formData.university}
          onChange={(e) => onChange("university", e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">年齢</Label>
        <Input
          id="age"
          type="number"
          min="18"
          max="100"
          value={formData.age}
          onChange={(e) => onChange("age", e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>性別</Label>
        <Select
          value={formData.gender}
          onValueChange={(value) => onChange("gender", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="性別を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">男性</SelectItem>
            <SelectItem value="female">女性</SelectItem>
            <SelectItem value="other">その他</SelectItem>
            <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>出身地</Label>
        <Select
          value={formData.origin}
          onValueChange={(value) => onChange("origin", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="出身地を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="japan">日本</SelectItem>
            <SelectItem value="china">中国</SelectItem>
            <SelectItem value="korea">韓国</SelectItem>
            <SelectItem value="usa">アメリカ</SelectItem>
            <SelectItem value="other">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>性的指向</Label>
        <Select
          value={formData.sexuality}
          onValueChange={(value) => onChange("sexuality", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="性的指向を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="heterosexual">異性愛</SelectItem>
            <SelectItem value="homosexual">同性愛</SelectItem>
            <SelectItem value="bisexual">両性愛</SelectItem>
            <SelectItem value="other">その他</SelectItem>
            <SelectItem value="prefer_not_to_say">回答しない</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aboutMe">自己紹介</Label>
        <Textarea
          id="aboutMe"
          placeholder="あなたの興味や趣味について教えてください"
          value={formData.aboutMe}
          onChange={(e) => onChange("aboutMe", e.target.value)}
          className="min-h-[100px]"
          disabled={loading}
        />
      </div>
    </>
  );
}
