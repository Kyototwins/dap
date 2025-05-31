
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types/events";
import { EditEventForm } from "@/components/events/EditEventForm";

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        navigate("/events");
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Check if user is the creator
        if (data.creator_id !== user.id) {
          toast({
            title: "アクセス権限がありません",
            description: "このイベントを編集する権限がありません。",
            variant: "destructive",
          });
          navigate("/events");
          return;
        }

        setEvent(data);
      } catch (error: any) {
        toast({
          title: "エラーが発生しました",
          description: error.message,
          variant: "destructive",
        });
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="container max-w-2xl mx-auto px-0 py-2">
      <EditEventForm event={event} />
    </div>
  );
}
