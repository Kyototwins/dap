
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserCard } from "@/components/profile/UserCard";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import type { Profile } from "@/types/messages";

// 言語オプション定義
const LANGUAGE_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "japanese", label: "日本語学習者" },
  { value: "english", label: "英語学習者" },
  { value: "chinese", label: "中国語学習者" },
  { value: "korean", label: "韓国語学習者" },
  { value: "french", label: "フランス語学習者" },
  { value: "nearby", label: "近くの大学" },
];

// ソートオプション定義
const SORT_OPTIONS = [
  { value: "recent", label: "最新登録順" },
  { value: "active", label: "アクティブ順" },
];

export default function Matches() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortOption, setSortOption] = useState("recent");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 10;
  const pageRef = useRef(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  // プロフィールデータ取得
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("認証されていません");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (error) throw error;
      setProfiles(data || []);
      applyFilters(data || [], searchQuery, languageFilter);
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

  // 検索とフィルタリングの適用
  const applyFilters = (data: Profile[], query: string, language: string) => {
    let result = [...data];

    // 検索クエリによるフィルタリング
    if (query) {
      const searchLower = query.toLowerCase();
      result = result.filter((profile) => {
        return (
          profile.first_name?.toLowerCase().includes(searchLower) ||
          profile.last_name?.toLowerCase().includes(searchLower) ||
          profile.about_me?.toLowerCase().includes(searchLower) ||
          profile.university?.toLowerCase().includes(searchLower) ||
          profile.department?.toLowerCase().includes(searchLower)
        );
      });
    }

    // 言語によるフィルタリング
    if (language !== "all") {
      if (language === "nearby") {
        // 近くの大学のロジックは将来実装
        // 今はダミーとして自分の大学と同じ大学のユーザーをフィルタリング
        const myUniversity = "東京大学"; // 将来的にはログインユーザーの大学を取得
        result = result.filter(profile => profile.university === myUniversity);
      } else {
        // 言語学習者フィルタリング
        const languageMap: Record<string, string> = {
          "japanese": "日本語",
          "english": "英語",
          "chinese": "中国語",
          "korean": "韓国語",
          "french": "フランス語"
        };
        
        const targetLanguage = languageMap[language];
        result = result.filter(profile => 
          profile.learning_languages?.includes(targetLanguage)
        );
      }
    }

    // ソートの適用
    if (sortOption === "recent") {
      // 最新登録順 (created_atが新しい順)
      result.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === "active") {
      // アクティブ順のソートは将来実装
      // 現在はダミーとして名前でソート
      result.sort((a, b) => {
        const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
        const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
        return nameA.localeCompare(nameB);
      });
    }

    setFilteredProfiles(result);
    pageRef.current = 1;
    setVisibleProfiles(result.slice(0, pageSize));
  };

  // 初期ロード
  useEffect(() => {
    fetchProfiles();
  }, []);

  // フィルター変更時
  useEffect(() => {
    applyFilters(profiles, searchQuery, languageFilter);
  }, [searchQuery, languageFilter, sortOption]);

  // 検索クエリ変更ハンドラ
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 言語フィルター変更ハンドラ
  const handleLanguageFilterChange = (value: string) => {
    setLanguageFilter(value);
  };

  // フィルター保存ハンドラ
  const handleSaveFilter = () => {
    setIsFilterSheetOpen(false);
    // フィルターは既に適用されているので追加の処理は不要
  };

  // さらに表示ボタンのハンドラ
  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const start = (nextPage - 1) * pageSize;
    const end = nextPage * pageSize;
    
    setTimeout(() => {
      setVisibleProfiles(prev => [
        ...prev, 
        ...filteredProfiles.slice(start, end)
      ]);
      pageRef.current = nextPage;
      setLoadingMore(false);
    }, 500); // UIフィードバックのための短い遅延
  };

  // データ更新ハンドラ
  const handleRefresh = () => {
    fetchProfiles();
  };

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-amber-600">マッチング</h1>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="outline"
            onClick={handleRefresh}
            className="bg-white/70 backdrop-blur-sm border-amber-200"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 text-amber-600 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                variant="outline" 
                className="bg-white/70 backdrop-blur-sm border-amber-200"
              >
                <Filter className="h-4 w-4 text-amber-600" />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>フィルター設定</SheetTitle>
                <SheetDescription>
                  マッチング条件を設定してください
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">表示順</h3>
                  <RadioGroup 
                    value={sortOption} 
                    onValueChange={setSortOption}
                    className="space-y-1"
                  >
                    {SORT_OPTIONS.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <label htmlFor={option.value} className="text-sm">{option.label}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {/* 将来的に他のフィルターオプションをここに追加 */}
              </div>
              
              <SheetFooter>
                <Button onClick={handleSaveFilter}>
                  適用する
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="名前、大学、自己紹介で検索..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 border-amber-200 focus-visible:ring-amber-500 bg-white/70 backdrop-blur-sm"
          />
        </div>
        
        <Tabs
          defaultValue="all"
          value={languageFilter}
          onValueChange={handleLanguageFilterChange}
          className="w-full"
        >
          <div className="border-b border-amber-100 overflow-x-auto pb-1">
            <TabsList className="bg-transparent p-0 h-auto">
              {LANGUAGE_OPTIONS.map(option => (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  className="data-[state=active]:bg-amber-100/50 data-[state=active]:text-amber-900 rounded-full px-4 py-1.5 text-muted-foreground"
                >
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>

      {loading ? (
        <ProfileLoading />
      ) : (
        <>
          {visibleProfiles.length > 0 ? (
            <div className="grid gap-4 md:gap-6">
              {visibleProfiles.map((profile) => (
                <UserCard key={profile.id} profile={profile} />
              ))}
              
              {visibleProfiles.length < filteredProfiles.length && (
                <Button
                  variant="outline"
                  className="w-full py-6 mt-2 border-dashed border-amber-200 text-amber-600 hover:bg-amber-50"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      読み込み中...
                    </>
                  ) : (
                    <>さらに表示</>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <ProfileNotFound message="条件に一致するユーザーが見つかりませんでした" />
          )}
        </>
      )}
    </div>
  );
}
