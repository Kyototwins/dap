
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/profile/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEvent } from "@/hooks/useCreateEvent";

export function CreateEventForm() {
  const { 
    formData, 
    setFormData, 
    image, 
    setImage,
    loading,
    handleImageChange,
    handleSubmit 
  } = useCreateEvent();
  
  const categories = [
    "スポーツ",
    "勉強会",
    "食事会",
    "カラオケ",
    "観光",
    "その他",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">タイトル</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="border-gray-300 focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border-gray-300 focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>イベント画像</Label>
        <ImageUpload
          label="画像をアップロード"
          image={image}
          onChange={handleImageChange}
          loading={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">場所</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="border-gray-300 focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">日時</Label>
        <Input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          className="border-gray-300 focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">カテゴリー</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
          required
        >
          <SelectTrigger className="border-gray-300 focus-visible:ring-gray-500">
            <SelectValue placeholder="カテゴリーを選択" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max_participants">最大参加人数</Label>
        <Input
          id="max_participants"
          type="number"
          min="1"
          value={formData.max_participants}
          onChange={(e) =>
            setFormData({ ...formData, max_participants: e.target.value })
          }
          className="border-gray-300 focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="border-gray-300 hover:bg-gray-50 flex-1"
        >
          キャンセル
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white hover:bg-gray-800 flex-1"
        >
          {loading ? "作成中..." : "作成する"}
        </Button>
      </div>
    </form>
  );
}
