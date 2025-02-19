
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: Profile;
  match_id: string;
  sender_id: string;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  otherUser: Profile;
  lastMessage?: {
    content: string;
    created_at: string;
  };
}

export default function Messages() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
            setMessages(prev => [...prev, { ...payload.new, sender: senderData }]);
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

      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select(`
          *,
          user1:profiles!matches_user1_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          user2:profiles!matches_user2_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          messages:messages (
            content,
            created_at
          )
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (matchesError) throw matchesError;

      const processedMatches = matchesData.map(match => ({
        ...match,
        otherUser: match.user1_id === user.id ? match.user2 : match.user1,
        lastMessage: match.messages[0]
      }));

      setMatches(processedMatches);
    } catch (error: any) {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // senderが存在することを確認
      const validMessages = (data || []).filter(message => message.sender);
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

  if (loading) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* マッチ一覧 */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">メッセージ</h2>
          <div className="space-y-2">
            {matches.map((match) => (
              <Card
                key={match.id}
                className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                  selectedMatch?.id === match.id ? "bg-accent" : ""
                }`}
                onClick={() => {
                  setSelectedMatch(match);
                  fetchMessages(match.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={match.otherUser.avatar_url || "/placeholder.svg"}
                      alt={`${match.otherUser.first_name}のアバター`}
                    />
                    <AvatarFallback>
                      {match.otherUser.first_name?.[0]}
                      {match.otherUser.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {match.otherUser.first_name} {match.otherUser.last_name}
                    </p>
                    {match.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {match.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {matches.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                まだマッチしているユーザーがいません
              </p>
            )}
          </div>
        </div>
      </div>

      {/* メッセージ表示エリア */}
      <div className="flex-1 flex flex-col">
        {selectedMatch ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedMatch.otherUser.avatar_url || "/placeholder.svg"}
                    alt={`${selectedMatch.otherUser.first_name}のアバター`}
                  />
                  <AvatarFallback>
                    {selectedMatch.otherUser.first_name?.[0]}
                    {selectedMatch.otherUser.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedMatch.otherUser.first_name} {selectedMatch.otherUser.last_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                message.sender && (  // sender の存在確認を追加
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === selectedMatch.otherUser.id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender.id === selectedMatch.otherUser.id
                          ? "bg-accent"
                          : "bg-primary text-primary-foreground"
                      } rounded-lg p-3`}
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                )
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="メッセージを入力..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            メッセージを表示するには、左のリストからユーザーを選択してください
          </div>
        )}
      </div>
    </div>
  );
}
