
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
import { Badge } from "@/components/ui/badge";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  origin: string;
  sexuality: string;
  aboutMe: string;
  university: string;
  hobbies: string[];
  languages: string[];
  learning_languages: string[];
}

interface ProfileFormProps {
  formData: ProfileFormData;
  onChange: (name: string, value: string | string[]) => void;
  loading?: boolean;
}

const HOBBY_OPTIONS = [
  "写真",
  "ハイキング",
  "アート",
  "読書",
  "料理",
  "旅行",
  "音楽",
  "スポーツ",
  "ゲーム",
  "プログラミング"
];

const LANGUAGE_OPTIONS = [
  "日本語",
  "英語",
  "中国語",
  "韓国語",
  "スペイン語",
  "フランス語"
];

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

      {/* 趣味タグ */}
      <div className="space-y-2">
        <Label>趣味・興味</Label>
        <div className="flex flex-wrap gap-2">
          {HOBBY_OPTIONS.map((hobby) => (
            <Badge
              key={hobby}
              variant={formData.hobbies?.includes(hobby) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const newHobbies = formData.hobbies?.includes(hobby)
                  ? formData.hobbies.filter(h => h !== hobby)
                  : [...(formData.hobbies || []), hobby];
                onChange("hobbies", newHobbies);
              }}
            >
              {hobby}
            </Badge>
          ))}
        </div>
      </div>

      {/* 言語 */}
      <div className="space-y-2">
        <Label>使用言語</Label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <Badge
              key={lang}
              variant={formData.languages?.includes(lang) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const newLangs = formData.languages?.includes(lang)
                  ? formData.languages.filter(l => l !== lang)
                  : [...(formData.languages || []), lang];
                onChange("languages", newLangs);
              }}
            >
              {lang}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>学習中の言語</Label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <Badge
              key={lang}
              variant={formData.learning_languages?.includes(lang) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const newLangs = formData.learning_languages?.includes(lang)
                  ? formData.learning_languages.filter(l => l !== lang)
                  : [...(formData.learning_languages || []), lang];
                onChange("learning_languages", newLangs);
              }}
            >
              {lang}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
