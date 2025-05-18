
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types/messages";
import { createStandardizedUserObject } from "@/utils/profileDataUtils";

export function useMatchMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const fetchMessages = async (matchId: string) => {
    try {
      console.log(`Fetching messages for match: ${matchId}`);
      
      // モックメッセージを作成
      if (matchId === "mock-match-1") {
        const mockUser = {
          id: "mock-user-id",
          created_at: new Date().toISOString(),
          first_name: "太郎",
          last_name: "同志社",
          avatar_url: "/lovable-uploads/dcec855f-513e-4a70-aae4-fa4c16529c99.png"
        };
        
        const mockMatchUser = {
          id: "mock-match-user-1",
          created_at: new Date().toISOString(),
          first_name: "花子",
          last_name: "京都",
          avatar_url: "/lovable-uploads/dd8c0f48-e885-4658-8781-f1fb6bde0fd3.png"
        };
        
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        const mockMessages: Message[] = [
          {
            id: "mock-msg-1-1",
            content: "こんにちは！よろしくお願いします。",
            created_at: yesterday.toISOString(),
            match_id: matchId,
            sender_id: "mock-match-user-1",
            sender: createStandardizedUserObject(mockMatchUser)
          },
          {
            id: "mock-msg-1-2",
            content: "こんにちは！よろしくお願いします。同志社大学の学生です。",
            created_at: yesterday.toISOString(),
            match_id: matchId,
            sender_id: "mock-user-id",
            sender: createStandardizedUserObject(mockUser)
          },
          {
            id: "mock-msg-1-3",
            content: "私は京都大学の学生です。趣味は何ですか？",
            created_at: now.toISOString(),
            match_id: matchId,
            sender_id: "mock-match-user-1",
            sender: createStandardizedUserObject(mockMatchUser)
          }
        ];
        
        setMessages(mockMessages);
        return mockMessages;
      } 
      else if (matchId === "mock-match-2") {
        const mockUser = {
          id: "mock-user-id",
          created_at: new Date().toISOString(),
          first_name: "太郎",
          last_name: "同志社",
          avatar_url: "/lovable-uploads/dcec855f-513e-4a70-aae4-fa4c16529c99.png"
        };
        
        const mockMatchUser = {
          id: "mock-match-user-2",
          created_at: new Date().toISOString(),
          first_name: "John",
          last_name: "Smith",
          avatar_url: "/lovable-uploads/9797c959-5651-45e5-b6fc-2d1ff0c0b223.png"
        };
        
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        const mockMessages: Message[] = [
          {
            id: "mock-msg-2-1",
            content: "Hi there! Nice to meet you.",
            created_at: yesterday.toISOString(),
            match_id: matchId,
            sender_id: "mock-user-id",
            sender: createStandardizedUserObject(mockUser)
          },
          {
            id: "mock-msg-2-2",
            content: "Hello! Nice to meet you too! I'm an exchange student from the US.",
            created_at: yesterday.toISOString(),
            match_id: matchId,
            sender_id: "mock-match-user-2",
            sender: createStandardizedUserObject(mockMatchUser)
          },
          {
            id: "mock-msg-2-3",
            content: "Do you have any recommendations for places to visit in Kyoto?",
            created_at: now.toISOString(),
            match_id: matchId,
            sender_id: "mock-match-user-2",
            sender: createStandardizedUserObject(mockMatchUser)
          }
        ];
        
        setMessages(mockMessages);
        return mockMessages;
      }
      else {
        // 空のメッセージ配列を返す
        setMessages([]);
        return [];
      }
    } catch (error: any) {
      console.error("Error in fetchMessages:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    messages,
    setMessages,
    fetchMessages
  };
}
