
import { Badge } from "@/components/ui/badge";

const categoryTranslationMap: Record<string, string> = {
  'スポーツ': 'Sports',
  '勉強': 'Study',
  '食事': 'Meal',
  'カラオケ': 'Karaoke',
  '観光': 'Sightseeing',
  'その他': 'Other',
  'Sports': 'Sports',
  'Study': 'Study',
  'Meal': 'Meal',
  'Karaoke': 'Karaoke',
  'Sightseeing': 'Sightseeing',
  'Other': 'Other',
};

interface EventCategoryDisplayProps {
  category: string;
}

export function EventCategoryDisplay({ category }: EventCategoryDisplayProps) {
  const displayCategory = categoryTranslationMap[category] || category;
  
  return (
    <Badge variant="outline" className="bg-gray-100">
      {displayCategory}
    </Badge>
  );
}
