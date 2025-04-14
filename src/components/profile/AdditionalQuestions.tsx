
import {
  Label 
} from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalQuestionsData {
  lifeGoal: string;
  superpower: string;
  worstNightmare: string;
  friendActivity: string;
  bestQuality: string;
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
        <Label>My worst nightmare is...</Label>
        <Textarea
          placeholder="Tell us about your worst nightmare..."
          value={data.worstNightmare || ""}
          onChange={(e) => onChange("worstNightmare", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>If we become friends, I want to do...</Label>
        <Textarea
          placeholder="What would you like us to do together as friends?"
          value={data.friendActivity || ""}
          onChange={(e) => onChange("friendActivity", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>My best quality is...</Label>
        <Textarea
          placeholder="Tell us about your best quality..."
          value={data.bestQuality || ""}
          onChange={(e) => onChange("bestQuality", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>If you could have a superpower, what would it be?</Label>
        <Textarea
          placeholder="Tell us about your desired superpower..."
          value={data.superpower || ""}
          onChange={(e) => onChange("superpower", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>My life goal...</Label>
        <Textarea
          placeholder="Tell us about your life goal..."
          value={data.lifeGoal || ""}
          onChange={(e) => onChange("lifeGoal", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>
    </div>
  );
}
