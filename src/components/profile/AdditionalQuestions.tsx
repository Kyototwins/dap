
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalQuestionsData {
  idealDate: string;
  lifeGoal: string;
  superpower: string;
}

interface AdditionalQuestionsProps {
  data: AdditionalQuestionsData;
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function AdditionalQuestions({ data, onChange, loading }: AdditionalQuestionsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>理想のデートは？</Label>
        <Select
          value={data.idealDate}
          onValueChange={(value) => onChange("idealDate", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="理想のデートを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinner">レストランでディナー</SelectItem>
            <SelectItem value="cafe">カフェでゆっくり</SelectItem>
            <SelectItem value="activity">アクティビティを楽しむ</SelectItem>
            <SelectItem value="nature">自然の中でピクニック</SelectItem>
            <SelectItem value="other">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>人生の目標は？</Label>
        <Textarea
          placeholder="あなたの人生の目標について教えてください"
          value={data.lifeGoal}
          onChange={(e) => onChange("lifeGoal", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>もし超能力が使えるとしたら？</Label>
        <Select
          value={data.superpower}
          onValueChange={(value) => onChange("superpower", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="超能力を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teleportation">瞬間移動</SelectItem>
            <SelectItem value="invisibility">透明化</SelectItem>
            <SelectItem value="mindreading">読心術</SelectItem>
            <SelectItem value="timetravel">時間旅行</SelectItem>
            <SelectItem value="flying">空を飛ぶ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
