
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface AdditionalQuestionsProps {
  worstNightmare: string;
  friendActivity: string;
  bestQuality: string;
  superpower: string;
  lifeGoal: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  loading?: boolean;
}

export function AdditionalQuestionsSection({
  worstNightmare,
  friendActivity,
  bestQuality,
  superpower,
  lifeGoal,
  onChange,
  loading
}: AdditionalQuestionsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Additional Information</h2>
      <Separator />
      
      <div className="space-y-4">
        <div>
          <Label>My worst nightmare is...</Label>
          <Textarea
            name="worstNightmare"
            placeholder="Tell us about your worst nightmare..."
            value={worstNightmare}
            onChange={onChange}
            className="resize-none"
            disabled={loading}
          />
        </div>
        
        <div>
          <Label>If we become friends, I want to do...</Label>
          <Textarea
            name="friendActivity"
            placeholder="What would you like us to do together as friends?"
            value={friendActivity}
            onChange={onChange}
            className="resize-none"
            disabled={loading}
          />
        </div>
        
        <div>
          <Label>My best quality is...</Label>
          <Textarea
            name="bestQuality"
            placeholder="Tell us about your best quality..."
            value={bestQuality}
            onChange={onChange}
            className="resize-none"
            disabled={loading}
          />
        </div>
        
        <div>
          <Label>If you could have a superpower, what would it be?</Label>
          <Textarea
            name="superpower"
            placeholder="Tell us about your desired superpower..."
            value={superpower}
            onChange={onChange}
            className="resize-none"
            disabled={loading}
          />
        </div>
        
        <div>
          <Label>My life goal...</Label>
          <Textarea
            name="lifeGoal"
            placeholder="Tell us about your life goal..."
            value={lifeGoal}
            onChange={onChange}
            className="resize-none"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
