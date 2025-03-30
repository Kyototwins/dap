
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw, Filter, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserCard } from "@/components/profile/UserCard";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileLoading } from "@/components/profile/ProfileLoading";
import type { Profile } from "@/types/messages";

// 言語オプション定義
const LANGUAGE_OPTIONS = [
  { value: "japanese", label: "日本語" },
  { value: "english", label: "英語" },
  { value: "chinese", label: "中国語" },
  { value: "korean", label: "韓国語" },
  { value: "french", label: "フランス語" },
  { value: "spanish", label: "スペイン語" },
];

// 出身国オプション
const COUNTRY_OPTIONS = [
  { value: "japan", label: "日本" },
  { value: "usa", label: "アメリカ" },
  { value: "china", label: "中国" },
  { value: "korea", label: "韓国" },
  { value: "other", label: "その他" },
];

// 趣味オプション
const HOBBY_OPTIONS = [
  "旅行", "料理", "映画鑑賞", "読書", "音楽", "スポーツ", "アート", 
  "写真", "ダンス", "ゲーム", "プログラミング", "語学"
];

// ソートオプション定義
const SORT_OPTIONS = [
  { value: "recent", label: "最新登録順" },
  { value: "active", label: "アクティブ順" },
];

interface FilterState {
  ageRange: [number, number];
  speakingLanguages: string[];
  learningLanguages: string[];
  minLanguageLevel: number;
  hobbies: string[];
  countries: string[];
  sortOption: string;
}

export default function Matches() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // フィルター状態
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [18, 50],
    speakingLanguages: [],
    learningLanguages: [],
    minLanguageLevel: 1,
    hobbies: [],
    countries: [],
    sortOption: "recent"
  });
  
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
      
      // Explicitly handle language_levels to match the Profile type
      const typedProfiles = data?.map(profile => ({
        ...profile,
        language_levels: profile.language_levels as Record<string, number>
      })) || [];
      
      setProfiles(typedProfiles);
      applyFilters(typedProfiles, searchQuery, filters);
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
  const applyFilters = (data: Profile[], query: string, filterState: FilterState) => {
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

    // 年齢によるフィルタリング
    result = result.filter(profile => {
      if (!profile.age) return true;
      return profile.age >= filterState.ageRange[0] && profile.age <= filterState.ageRange[1];
    });

    // 出身国によるフィルタリング
    if (filterState.countries.length > 0) {
      result = result.filter(profile => 
        !profile.origin || filterState.countries.includes(profile.origin)
      );
    }

    // 話せる言語によるフィルタリング
    if (filterState.speakingLanguages.length > 0) {
      result = result.filter(profile => {
        if (!profile.languages || profile.languages.length === 0) return false;
        
        // 言語レベルの条件も考慮
        return filterState.speakingLanguages.some(lang => {
          const hasLanguage = profile.languages?.includes(lang);
          if (!hasLanguage) return false;
          
          // 言語レベルの確認（languageLevelsがある場合）
          if (profile.language_levels && typeof profile.language_levels === 'object') {
            const level = profile.language_levels[lang];
            return level >= filterState.minLanguageLevel;
          }
          return true;
        });
      });
    }

    // 学習中の言語によるフィルタリング
    if (filterState.learningLanguages.length > 0) {
      result = result.filter(profile => {
        if (!profile.learning_languages || profile.learning_languages.length === 0) return false;
        return filterState.learningLanguages.some(lang => 
          profile.learning_languages?.includes(lang)
        );
      });
    }

    // 趣味によるフィルタリング
    if (filterState.hobbies.length > 0) {
      result = result.filter(profile => {
        if (!profile.hobbies || profile.hobbies.length === 0) return false;
        return filterState.hobbies.some(hobby => 
          profile.hobbies?.includes(hobby)
        );
      });
    }

    // ソートの適用
    if (filterState.sortOption === "recent") {
      // 最新登録順 (created_atが新しい順)
      result.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    } else if (filterState.sortOption === "active") {
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
    if (profiles.length > 0) {
      applyFilters(profiles, searchQuery, filters);
    }
  }, [searchQuery, filters]);

  // 検索クエリ変更ハンドラ
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // フィルター変更ハンドラ
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 言語選択トグルハンドラ
  const toggleLanguage = (list: keyof FilterState, lang: string) => {
    setFilters(prev => {
      const currentList = [...prev[list] as string[]];
      const index = currentList.indexOf(lang);
      
      if (index >= 0) {
        currentList.splice(index, 1);
      } else {
        currentList.push(lang);
      }
      
      return {
        ...prev,
        [list]: currentList
      };
    });
  };

  // 趣味選択トグルハンドラ
  const toggleHobby = (hobby: string) => {
    setFilters(prev => {
      const currentHobbies = [...prev.hobbies];
      const index = currentHobbies.indexOf(hobby);
      
      if (index >= 0) {
        currentHobbies.splice(index, 1);
      } else {
        currentHobbies.push(hobby);
      }
      
      return {
        ...prev,
        hobbies: currentHobbies
      };
    });
  };

  // 出身国選択トグルハンドラ
  const toggleCountry = (country: string) => {
    setFilters(prev => {
      const currentCountries = [...prev.countries];
      const index = currentCountries.indexOf(country);
      
      if (index >= 0) {
        currentCountries.splice(index, 1);
      } else {
        currentCountries.push(country);
      }
      
      return {
        ...prev,
        countries: currentCountries
      };
    });
  };

  // フィルター保存ハンドラ
  const handleSaveFilter = () => {
    setIsFilterSheetOpen(false);
    // フィルターは既に適用されているので追加の処理は不要
  };

  // フィルターリセットハンドラ
  const handleResetFilter = () => {
    setFilters({
      ageRange: [18, 50],
      speakingLanguages: [],
      learningLanguages: [],
      minLanguageLevel: 1,
      hobbies: [],
      countries: [],
      sortOption: "recent"
    });
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

  // 有効なフィルターの数を計算
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.speakingLanguages.length > 0) count++;
    if (filters.learningLanguages.length > 0) count++;
    if (filters.hobbies.length > 0) count++;
    if (filters.countries.length > 0) count++;
    if (filters.ageRange[0] > 18 || filters.ageRange[1] < 50) count++;
    if (filters.minLanguageLevel > 1) count++;
    return count;
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
                variant="outline" 
                className="bg-white/70 backdrop-blur-sm border-amber-200 flex gap-2 items-center"
              >
                <SlidersHorizontal className="h-4 w-4 text-amber-600" />
                フィルター
                {getActiveFilterCount() > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-800">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>フィルター設定</SheetTitle>
                <SheetDescription>
                  マッチング条件を設定してください
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                {/* ソート設定 */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium border-b pb-2">表示順</h3>
                  <RadioGroup 
                    value={filters.sortOption} 
                    onValueChange={(value) => handleFilterChange("sortOption", value)}
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
                
                {/* 年齢範囲 */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium border-b pb-2">年齢範囲</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{filters.ageRange[0]}歳</span>
                      <span>{filters.ageRange[1]}歳</span>
                    </div>
                    <Slider
                      value={filters.ageRange}
                      min={18}
                      max={60}
                      step={1}
                      onValueChange={(value) => handleFilterChange("ageRange", value as [number, number])}
                      className="my-4"
                    />
                  </div>
                </div>
                
                {/* 言語関連フィルター */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium border-b pb-2">言語スキル</h3>
                  
                  {/* 話せる言語 */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium">話せる言語</h4>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map(lang => (
                        <Badge
                          key={lang.value}
                          variant={filters.speakingLanguages.includes(lang.label) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            filters.speakingLanguages.includes(lang.label) 
                              ? "bg-amber-500 text-white hover:bg-amber-600" 
                              : "bg-white text-amber-800 hover:bg-amber-50"
                          }`}
                          onClick={() => toggleLanguage("speakingLanguages", lang.label)}
                        >
                          {lang.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* 言語レベル */}
                  {filters.speakingLanguages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium">最低言語レベル</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>初級</span>
                          <span>中級</span>
                          <span>上級</span>
                          <span>ネイティブ</span>
                        </div>
                        <Slider
                          value={[filters.minLanguageLevel]}
                          min={1}
                          max={4}
                          step={1}
                          onValueChange={(value) => handleFilterChange("minLanguageLevel", value[0])}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 学習中の言語 */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium">学習中の言語</h4>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map(lang => (
                        <Badge
                          key={lang.value}
                          variant={filters.learningLanguages.includes(lang.label) ? "default" : "outline"}
                          className={`cursor-pointer ${
                            filters.learningLanguages.includes(lang.label) 
                              ? "bg-amber-500 text-white hover:bg-amber-600" 
                              : "bg-white text-amber-800 hover:bg-amber-50"
                          }`}
                          onClick={() => toggleLanguage("learningLanguages", lang.label)}
                        >
                          {lang.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 趣味 */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium border-b pb-2">趣味・興味</h3>
                  <div className="flex flex-wrap gap-2">
                    {HOBBY_OPTIONS.map(hobby => (
                      <Badge
                        key={hobby}
                        variant={filters.hobbies.includes(hobby) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.hobbies.includes(hobby) 
                            ? "bg-amber-500 text-white hover:bg-amber-600" 
                            : "bg-white text-amber-800 hover:bg-amber-50"
                        }`}
                        onClick={() => toggleHobby(hobby)}
                      >
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* 出身国 */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium border-b pb-2">出身国</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {COUNTRY_OPTIONS.map(country => (
                      <div key={country.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={country.value} 
                          checked={filters.countries.includes(country.value)}
                          onCheckedChange={() => toggleCountry(country.value)}
                        />
                        <label
                          htmlFor={country.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {country.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <SheetFooter className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilter}
                  className="flex-1"
                >
                  リセット
                </Button>
                <Button 
                  onClick={handleSaveFilter}
                  className="flex-1 bg-amber-500 hover:bg-amber-600"
                >
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
