import React from "react";
import { ImageUploadState } from "@/types/profile";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ImageUploadComponent } from "@/components/profile/ImageUploadComponent";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface PhotosSectionProps {
  images: ImageUploadState;
  setImages: React.Dispatch<React.SetStateAction<ImageUploadState>>;
  hobbyPhotoComment: string;
  petPhotoComment: string;
  firstName: string;
  lastName: string;
  aboutMe: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCommentChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  loading?: boolean;
}

export function PhotosSection({
  images,
  setImages,
  hobbyPhotoComment,
  petPhotoComment,
  firstName,
  lastName,
  aboutMe,
  onInputChange,
  onCommentChange,
  loading
}: PhotosSectionProps) {
  return <div className="space-y-6">
      
      <Separator />
      
      {/* Profile Photo (Avatar) */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Profile Photo</h3>
        <div className="flex justify-center">
          <AvatarUpload image={images.avatar} setImage={img => setImages(prev => ({
          ...prev,
          avatar: img
        }))} disabled={loading} />
        </div>
      </div>
      
      {/* Name and About Me - Moved here */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">姓</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="山田"
              value={firstName}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">名</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="太郎"
              value={lastName}
              onChange={onInputChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="aboutMe">About Me</Label>
          <Textarea
            id="aboutMe"
            name="aboutMe"
            placeholder="自己紹介を書いてください"
            value={aboutMe}
            onChange={onInputChange}
            className="resize-none min-h-[120px]"
            disabled={loading}
          />
        </div>
      </div>
      
      {/* Other Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Header Photo</h3>
          <ImageUploadComponent label="Image 1" image={images.image1} setImage={img => setImages(prev => ({
          ...prev,
          image1: img
        }))} disabled={loading} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Additional Photo 2</h3>
          <ImageUploadComponent label="Image 2" image={images.image2} setImage={img => setImages(prev => ({
          ...prev,
          image2: img
        }))} disabled={loading} />
        </div>
      </div>
      
      {/* Hobby Photo */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Photo of me enjoying my hobby</h3>
        <ImageUploadComponent label="Hobby Photo" image={images.hobby} setImage={img => setImages(prev => ({
        ...prev,
        hobby: img
      }))} disabled={loading} />
        
        <div className="mt-3">
          <Label>Photo Comment</Label>
          <Textarea name="hobbyPhotoComment" placeholder="Share something about this photo..." value={hobbyPhotoComment} onChange={onCommentChange} className="resize-none" disabled={loading} />
        </div>
      </div>
      
      {/* Pet Photo */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Photo of my pet</h3>
        <ImageUploadComponent label="Pet Photo" image={images.pet} setImage={img => setImages(prev => ({
        ...prev,
        pet: img
      }))} disabled={loading} />
        
        <div className="mt-3">
          <Label>Photo Comment</Label>
          <Textarea name="petPhotoComment" placeholder="Share something about this photo..." value={petPhotoComment} onChange={onCommentChange} className="resize-none" disabled={loading} />
        </div>
      </div>
    </div>;
}
