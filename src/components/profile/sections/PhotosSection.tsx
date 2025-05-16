import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ImageUploadComponent } from "@/components/profile/ImageUploadComponent";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ImageUploadState } from "@/types/profile";

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
  // Handler for image uploads
  const handleImageChange = (imageType: keyof ImageUploadState, file: File | null) => {
    setImages(prev => {
      const newImages = { ...prev };
      if (file) {
        const preview = URL.createObjectURL(file);
        newImages[imageType] = { file, preview, uploading: false };
      } else {
        // Keep the preview if no new file is selected
        newImages[imageType] = { ...newImages[imageType], file: null };
      }
      return newImages;
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Photos</h2>
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label>Profile Picture (used as avatar)</Label>
            <AvatarUpload
              image={images.avatar}
              setImage={(newImage) => setImages(prev => ({ ...prev, avatar: newImage }))}
              disabled={loading}
            />

            {/* Name fields below profile photo */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={onInputChange}
                  placeholder="Enter your first name"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={onInputChange}
                  placeholder="Enter your last name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* About Me field */}
            <div className="space-y-2">
              <Label htmlFor="aboutMe">About Me</Label>
              <Textarea
                id="aboutMe"
                name="aboutMe"
                value={aboutMe}
                onChange={onInputChange}
                placeholder="Tell us about yourself"
                disabled={loading}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Additional Photo</Label>
              <ImageUploadComponent
                label="Additional Photo 1"
                image={images.image1}
                setImage={(newImage) => setImages(prev => ({ ...prev, image1: newImage }))}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Additional Photo</Label>
              <ImageUploadComponent
                label="Additional Photo 2"
                image={images.image2}
                setImage={(newImage) => setImages(prev => ({ ...prev, image2: newImage }))}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <Label>Hobby Photo</Label>
            <ImageUploadComponent
              label="Hobby Photo"
              image={images.hobby}
              setImage={(newImage) => setImages(prev => ({ ...prev, hobby: newImage }))}
              disabled={loading}
            />
            <div className="space-y-2">
              <Label htmlFor="hobbyPhotoComment">Photo Comment</Label>
              <Input
                id="hobbyPhotoComment"
                name="hobbyPhotoComment"
                value={hobbyPhotoComment}
                onChange={onCommentChange}
                placeholder="Share something about this photo..."
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Pet Photo</Label>
            <ImageUploadComponent
              label="Pet Photo"
              image={images.pet}
              setImage={(newImage) => setImages(prev => ({ ...prev, pet: newImage }))}
              disabled={loading}
            />
            <div className="space-y-2">
              <Label htmlFor="petPhotoComment">Photo Comment</Label>
              <Input
                id="petPhotoComment"
                name="petPhotoComment"
                value={petPhotoComment}
                onChange={onCommentChange}
                placeholder="Share something about this photo..."
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
