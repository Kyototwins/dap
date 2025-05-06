
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { format } from "date-fns";
import { Link2 } from "lucide-react";

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
  
  const [unlimitedParticipants, setUnlimitedParticipants] = useState(false);
  
  const categories = [
    "Sports",
    "Study",
    "Meal",
    "Karaoke",
    "Sightseeing",
    "Other",
  ];

  // Format today's date for the min attribute
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd'T'HH:mm");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="border-gray-300 rounded-md focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border-gray-300 rounded-md focus-visible:ring-gray-500 min-h-[120px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Event Image</Label>
        <ImageUpload
          label="Upload Image"
          image={image}
          onChange={handleImageChange}
          loading={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="border-gray-300 rounded-md focus-visible:ring-gray-500"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="map_link">
          Map Link <span className="text-xs text-gray-500">(optional)</span>
        </Label>
        <div className="relative">
          <Input
            id="map_link"
            value={formData.map_link}
            onChange={(e) =>
              setFormData({ ...formData, map_link: e.target.value })
            }
            className="border-gray-300 rounded-md focus-visible:ring-gray-500 pl-9"
            placeholder="https://maps.google.com/..."
          />
          <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          You can add a Google Maps or any other map service link (optional).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Date & Time</Label>
        <Input
          id="startDate"
          type="datetime-local"
          min={formattedToday}
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          className="border-gray-300 rounded-md focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
          required
        >
          <SelectTrigger className="border-gray-300 rounded-md focus-visible:ring-gray-500">
            <SelectValue placeholder="Select a category" />
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

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="unlimited" 
            checked={unlimitedParticipants} 
            onCheckedChange={(checked) => {
              setUnlimitedParticipants(!!checked);
              if (checked) {
                setFormData({ ...formData, max_participants: "0" });
              } else {
                setFormData({ ...formData, max_participants: "" });
              }
            }}
          />
          <label
            htmlFor="unlimited"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Unlimited participants
          </label>
        </div>
        
        {!unlimitedParticipants && (
          <div className="space-y-2">
            <Label htmlFor="max_participants">Maximum Participants</Label>
            <Input
              id="max_participants"
              type="number"
              min="1"
              value={formData.max_participants}
              onChange={(e) =>
                setFormData({ ...formData, max_participants: e.target.value })
              }
              className="border-gray-300 rounded-md focus-visible:ring-gray-500"
              required
            />
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="border-gray-300 hover:bg-gray-50 flex-1 rounded-md"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white hover:bg-gray-800 flex-1 rounded-md"
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
