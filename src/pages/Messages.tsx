
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MatchList } from "@/components/messages/MatchList";
import { MessageChat } from "@/components/messages/MessageChat";
import type { Match, Message } from "@/types/messages";

export default function Messages() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
    // リアルタイムメッセージ更新をサブスクライブ
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, async payload => {
        if (payload.new && selectedMatch?.id === payload.new.match_id) {
          // 送信者の情報を取得
          const { data: senderData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single();
          
          if (senderData) {
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
                superpower: senderData.superpower,
                university: senderData.university,
                department: senderData.department || '',
                year: senderData.year || '',
                hobbies: senderData.hobbies || [],
                languages: senderData.languages || [],
                language_levels: senderData.language_levels || {},
                learning_languages: senderData.learning_languages || [],
                created_at: senderData.created_at
              }
            };
            setMessages(prev => [...prev, newMessage]);
          }
        }
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedMatch]);

  useEffect(() => {
    // Show the chat view on mobile when a match is selected
    if (selectedMatch) {
      setShowMobileChat(true);
    }
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
              department: '',
              year: '',
              hobbies: [],
              languages: [],
              language_levels: {},
              superpower: message.sender.superpower || '',
              learning_languages: [],
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { error } = await supabase
        .from("messages")
        .insert([
          {
            match_id: selectedMatch.id,
            sender_id: user.id,
            content: newMessage.trim(),
          },
        ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "メッセージの送信に失敗しました",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    fetchMessages(match.id);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  if (loading) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Chat list for larger screens, or when chat isn't shown on mobile */}
        <div className={`${showMobileChat ? 'hidden md:block' : 'w-full'} md:w-1/3 border-r overflow-hidden`}>
          <MatchList 
            matches={matches} 
            selectedMatch={selectedMatch} 
            onSelectMatch={handleSelectMatch}
          />
        </div>
        
        {/* Chat window */}
        <div className={`${!showMobileChat ? 'hidden md:block' : 'w-full'} md:w-2/3 overflow-hidden`}>
          {selectedMatch ? (
            <MessageChat
              selectedMatch={selectedMatch}
              messages={messages}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>メッセージを表示するには、左のリストからユーザーを選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
