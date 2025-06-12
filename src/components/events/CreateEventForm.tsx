import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/profile/ImageUpload";
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { format } from "date-fns";
import { FormSectionTitle } from "./form/FormSectionTitle";
import { EventMapLinkInput } from "./form/EventMapLinkInput";
import { EventParticipantsInput } from "./form/EventParticipantsInput";
import { EventCategorySelect } from "./form/EventCategorySelect";
import { EventParticipationFormInput } from "./form/EventParticipationFormInput";
import { FormButtons } from "./form/FormButtons";

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

  // Format today's date for the min attribute
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd'T'HH:mm");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg">
      <div className="space-y-2">
        <FormSectionTitle htmlFor="title">Title</FormSectionTitle>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border-gray-300 rounded-md focus-visible:ring-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <FormSectionTitle htmlFor="description">Description</FormSectionTitle>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border-gray-300 rounded-md focus-visible:ring-gray-500 min-h-[120px]"
          required
        />
      </div>

      <div className="space-y-2">
        <FormSectionTitle>Event Image</FormSectionTitle>
        <ImageUpload
          label="Upload Image"
          image={image}
          onChange={handleImageChange}
          loading={loading}
        />
      </div>

      <div className="space-y-2">
        <FormSectionTitle htmlFor="location">Location</FormSectionTitle>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border-gray-300 rounded-md focus-visible:ring-gray-500"
          required
        />
      </div>
      
      <EventMapLinkInput 
        value={formData.map_link} 
        onChange={(value) => setFormData({ ...formData, map_link: value })}
      />

      <EventParticipationFormInput
        value={formData.participation_form}
        onChange={(value) => setFormData({ ...formData, participation_form: value })}
      />

      <div className="space-y-2">
        <FormSectionTitle htmlFor="startDate">Date & Time</FormSectionTitle>
        <Input
          id="startDate"
          type="datetime-local"
          min={formattedToday}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border-gray-300 rounded-md focus-visible:ring-gray-500"
          required
        />
      </div>

      <EventCategorySelect
        value={formData.category}
        onChange={(value) => setFormData({ ...formData, category: value })}
      />

      <EventParticipantsInput
        value={formData.max_participants}
        onChange={(value) => setFormData({ ...formData, max_participants: value })}
      />

      <FormButtons 
        loading={loading} 
        onCancel={() => window.history.back()}
      />
    </form>
  );
}
