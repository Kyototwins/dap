
export const getLanguageLevelLabel = (level: number): string => {
  switch (level) {
    case 1: return "初級";
    case 2: return "中級";
    case 3: return "上級";
    case 4: return "ネイティブ";
    default: return "不明";
  }
};
