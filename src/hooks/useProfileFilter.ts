
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/types/messages";
import type { FilterState } from "@/types/matches";

export function useProfileFilter() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [visibleProfiles, setVisibleProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const pageSize = 10;
  const pageRef = useRef(1);
  const { toast } = useToast();
  
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

  return {
    profiles,
    filteredProfiles,
    visibleProfiles,
    loading,
    loadingMore,
    searchQuery,
    filters,
    isFilterSheetOpen,
    setFilters,
    setIsFilterSheetOpen,
    handleSearchChange,
    handleLoadMore,
    handleRefresh,
  };
}
