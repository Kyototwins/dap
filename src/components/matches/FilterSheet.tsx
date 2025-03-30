
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { FilterState } from "@/types/matches";

// Constants
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

interface FilterSheetProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function FilterSheet({ filters, setFilters, isOpen, setIsOpen }: FilterSheetProps) {
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

  // フィルター変更ハンドラ
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  // 言語選択トグルハンドラ
  const toggleLanguage = (list: keyof FilterState, lang: string) => {
    const currentList = [...filters[list] as string[]];
    const index = currentList.indexOf(lang);
    
    if (index >= 0) {
      currentList.splice(index, 1);
    } else {
      currentList.push(lang);
    }
    
    handleFilterChange(list, currentList);
  };

  // 趣味選択トグルハンドラ
  const toggleHobby = (hobby: string) => {
    const currentHobbies = [...filters.hobbies];
    const index = currentHobbies.indexOf(hobby);
    
    if (index >= 0) {
      currentHobbies.splice(index, 1);
    } else {
      currentHobbies.push(hobby);
    }
    
    handleFilterChange("hobbies", currentHobbies);
  };

  // 出身国選択トグルハンドラ
  const toggleCountry = (country: string) => {
    const currentCountries = [...filters.countries];
    const index = currentCountries.indexOf(country);
    
    if (index >= 0) {
      currentCountries.splice(index, 1);
    } else {
      currentCountries.push(country);
    }
    
    handleFilterChange("countries", currentCountries);
  };

  // フィルター保存ハンドラ
  const handleSaveFilter = () => {
    setIsOpen(false);
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
  );
}
