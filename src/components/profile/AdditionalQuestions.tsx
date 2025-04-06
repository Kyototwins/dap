
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
  worstNightmare: string;
  friendActivity: string;
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
        <Label>What makes you most impatient?</Label>
        <Select
          value={data.idealDate}
          onValueChange={(value) => onChange("idealDate", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose what makes you impatient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiting">Waiting in line</SelectItem>
            <SelectItem value="traffic">Traffic</SelectItem>
            <SelectItem value="slowInternet">Slow internet</SelectItem>
            <SelectItem value="latePeople">People being late</SelectItem>
            <SelectItem value="indecisiveness">Indecisiveness</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>What's your worst nightmare?</Label>
        <Textarea
          placeholder="Tell us about your worst nightmare..."
          value={data.worstNightmare || ""}
          onChange={(e) => onChange("worstNightmare", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>If you could be friends with me, what would you want to do together?</Label>
        <Textarea
          placeholder="What would you like us to do together as friends?"
          value={data.friendActivity || ""}
          onChange={(e) => onChange("friendActivity", e.target.value)}
          className="min-h-[80px]"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>If you could have a superpower, what would it be?</Label>
        <Select
          value={data.superpower}
          onValueChange={(value) => onChange("superpower", value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose your superpower" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="teleportation">Teleportation</SelectItem>
            <SelectItem value="invisibility">Invisibility</SelectItem>
            <SelectItem value="mindreading">Mind Reading</SelectItem>
            <SelectItem value="timetravel">Time Travel</SelectItem>
            <SelectItem value="flying">Flying</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
