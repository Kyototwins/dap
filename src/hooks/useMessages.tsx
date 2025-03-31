
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Match, Message } from "@/types/messages";

export function useMessages() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Set up realtime subscription whenever the component mounts
  useEffect(() => {
    fetchMatches();
    
    // Set up a realtime subscription independent of selectedMatch
    const messagesSubscription = supabase
      .channel('messages-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async payload => {
        console.log("New message received:", payload.new);
        
        // Get current user for comparison
        const { data: { user } } = await supabase.auth.getUser();
        
        // Only process if relevant to the selected match 
        if (payload.new && 
            (selectedMatch?.id === payload.new.match_id)) {
          
          // Get sender information
          const { data: senderData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single();
          
          if (senderData) {
            console.log("Sender data found:", senderData);
            const newMessage: Message = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              match_id: payload.new.match_id,
              sender_id: payload.new.sender_id,
              sender: {
                id: senderData.id,
                first_name: senderData.first_name,
                last_name: senderData.last_name,
                avatar_url: senderData.avatar_url,
                about_me: senderData.about_me,
                age: senderData.age,
                gender: senderData.gender,
                ideal_date: senderData.ideal_date,
                image_url_1: senderData.image_url_1,
                image_url_2: senderData.image_url_2,
                life_goal: senderData.life_goal,
                origin: senderData.origin,
                sexuality: senderData.sexuality,
                superpower: senderData.superpower || '',
                university: senderData.university,
                department: senderData.department || '',
                year: senderData.year || '',
                hobbies: senderData.hobbies || [],
                languages: senderData.languages || [],
                language_levels: senderData.language_levels as Record<string, number> || {},
                learning_languages: senderData.learning_languages || [],
                created_at: senderData.created_at
              }
            };
            
            // Add message if it's for the selected match
            setMessages(prev => {
              // Avoid duplicate messages
              if (prev.some(msg => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          }
        }
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedMatch]);

  const fetchMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data: matchesData, error } = await supabase
        .from("matches")
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, ideal_date, image_url_1, image_url_2, life_goal, origin, sexuality, superpower, university, created_at),
          user2:profiles!matches_user2_id_fkey (id, first_name, last_name, avatar_url, about_me, age, gender, ideal_date, image_url_1, image_url_2, life_goal, origin, sexuality, superpower, university, created_at),
          messages (content, created_at)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processedMatches = matchesData.map((match) => {
        const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
        
        return {
          ...match,
          otherUser: {
            ...otherUser,
            department: '',
            year: '',
            hobbies: [],
            languages: [],
            language_levels: {},
            superpower: otherUser.superpower || '',
            learning_languages: [],
          },
          lastMessage: match.messages[0],
        };
      });

      setMatches(processedMatches);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (*)
        `)
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      console.log("Fetched messages:", data);
      
      const validMessages = (data || [])
        .filter(message => message.sender)
        .map(message => {
          return {
            id: message.id,
            content: message.content,
            created_at: message.created_at,
            match_id: message.match_id,
            sender_id: message.sender_id,
            sender: {
              ...message.sender,
              department: message.sender.department || '',
              year: message.sender.year || '',
              hobbies: message.sender.hobbies || [],
              languages: message.sender.languages || [],
              language_levels: message.sender.language_levels as Record<string, number> || {},
              superpower: message.sender.superpower || '',
              learning_languages: message.sender.learning_languages || [],
            }
          };
        });

      setMessages(validMessages);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    fetchMessages(match.id);
  };

  return {
    matches,
    selectedMatch,
    messages,
    loading,
    handleSelectMatch,
    setMessages,
  };
}
