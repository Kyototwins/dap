
import React, { useState, useEffect } from "react";
import { ProfileFormData, AdditionalDataType, ImageUploadState } from "@/types/profile";
import { useProfileOperations } from "@/hooks/useProfileOperations";
import { useForm } from "react-hook-form";
import {
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ImageUploadComponent } from "@/components/profile/ImageUploadComponent";
import { AdditionalInfoSection } from "@/components/profile/AdditionalInfoSection";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface ProfileFormProps {
  profile: any;
  onCancel: () => void;
}

export function ProfileForm({ profile, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    origin: "",
    sexuality: "",
    aboutMe: "",
    university: "",
    department: "",
    year: "",
    hobbies: [],
    languages: [],
    languageLevels: {},
    learning_languages: [],
    photoComment: "",
    hobbyPhotoComment: "",
    petPhotoComment: ""
  });

  const [additionalData, setAdditionalData] = useState<AdditionalDataType>({
    idealDate: "",
    lifeGoal: "",
    superpower: "",
    worstNightmare: "",
    friendActivity: "",
    bestQuality: ""
  });

  const [images, setImages] = useState<ImageUploadState>({
    avatar: { file: null, preview: "", uploading: false },
    image1: { file: null, preview: "", uploading: false },
    image2: { file: null, preview: "", uploading: false },
    hobby: { file: null, preview: "", uploading: false },
    pet: { file: null, preview: "", uploading: false }
  });

  const { loading, handleSubmit } = useProfileOperations();
  const { toast } = useToast();
  const form = useForm();

  useEffect(() => {
    if (profile) {
      // Parse language levels JSON if it's stored as a string
      let languageLevels = {};
      if (profile.language_levels) {
        try {
          languageLevels = typeof profile.language_levels === 'string'
            ? JSON.parse(profile.language_levels)
            : profile.language_levels;
        } catch (e) {
          console.error("Error parsing language levels:", e);
        }
      }

      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        age: profile.age ? profile.age.toString() : "",
        gender: profile.gender || "",
        origin: profile.origin || "",
        sexuality: profile.sexuality || "",
        aboutMe: profile.about_me || "",
        university: profile.university || "",
        department: profile.department || "",
        year: profile.year || "",
        hobbies: profile.hobbies || [],
        languages: profile.languages || [],
        languageLevels: languageLevels,
        learning_languages: profile.learning_languages || [],
        photoComment: profile.photo_comment || "",
        hobbyPhotoComment: profile.hobby_photo_comment || "",
        petPhotoComment: profile.pet_photo_comment || ""
      });

      setAdditionalData({
        idealDate: profile.ideal_date || "",
        lifeGoal: profile.life_goal || "",
        superpower: profile.superpower || "",
        worstNightmare: profile.worst_nightmare || "",
        friendActivity: profile.friend_activity || "",
        bestQuality: profile.best_quality || ""
      });

      setImages({
        avatar: { file: null, preview: profile.avatar_url || "", uploading: false },
        image1: { file: null, preview: profile.image_url_1 || "", uploading: false },
        image2: { file: null, preview: profile.image_url_2 || "", uploading: false },
        hobby: { file: null, preview: profile.hobby_photo_url || "", uploading: false },
        pet: { file: null, preview: profile.pet_photo_url || "", uploading: false }
      });
    }
  }, [profile]);

  const languageOptions = [
    { value: "english", label: "英語" },
    { value: "japanese", label: "日本語" },
    { value: "spanish", label: "スペイン語" },
    { value: "french", label: "フランス語" },
    { value: "german", label: "ドイツ語" },
    { value: "chinese", label: "中国語" },
    { value: "korean", label: "韓国語" },
    { value: "italian", label: "イタリア語" },
    { value: "russian", label: "ロシア語" },
    { value: "arabic", label: "アラビア語" },
  ];

  const universityOptions = [
    { value: "doshisha", label: "同志社大学" },
    { value: "ritsumeikan", label: "立命館大学" },
    { value: "kansai", label: "関西大学" },
    { value: "kwangaku", label: "関西学院大学" },
  ];

  const yearOptions = [
    { value: "1", label: "1回生" },
    { value: "2", label: "2回生" },
    { value: "3", label: "3回生" },
    { value: "4", label: "4回生" },
    { value: "graduate", label: "大学院生" },
    { value: "other", label: "その他" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleAdditionalDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdditionalData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageLevelChange = (language: string, level: number) => {
    setFormData(prev => {
      const updatedLanguageLevels = { ...prev.languageLevels, [language]: level };
      return { ...prev, languageLevels: updatedLanguageLevels };
    });
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, formData, additionalData, images);
  };

  return (
    <div className="container py-12 pb-32">
      <Form {...form}>
        <form 
          onSubmit={onSubmitForm}
          className="space-y-8"
        >
          {/* Avatar Upload */}
          <div className="flex justify-center mb-8">
            <AvatarUpload image={images.avatar} setImage={(img) => setImages(prev => ({ ...prev, avatar: img }))} />
          </div>

          {/* Image Uploads */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">写真</h2>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadComponent label="Image 1" image={images.image1} setImage={(img) => setImages(prev => ({ ...prev, image1: img }))} />
              <ImageUploadComponent label="Image 2" image={images.image2} setImage={(img) => setImages(prev => ({ ...prev, image2: img }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadComponent label="Hobby Photo" image={images.hobby} setImage={(img) => setImages(prev => ({ ...prev, hobby: img }))} />
              <ImageUploadComponent label="Pet Photo" image={images.pet} setImage={(img) => setImages(prev => ({ ...prev, pet: img }))} />
            </div>
          </div>

          {/* Photo Comments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>写真コメント</Label>
              <Input
                name="photoComment"
                value={formData.photoComment}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>趣味写真コメント</Label>
              <Input
                name="hobbyPhotoComment"
                value={formData.hobbyPhotoComment}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>ペット写真コメント</Label>
              <Input
                name="petPhotoComment"
                value={formData.petPhotoComment}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">基本情報</h2>
              <Separator />
              <div>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Age</Label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Origin</Label>
                <Input
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Sexuality</Label>
                <Input
                  name="sexuality"
                  value={formData.sexuality}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* University Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">学歴</h2>
              <Separator />
              <div>
                <Label>University</Label>
                <Select 
                  value={formData.university} 
                  onValueChange={(value) => handleSelectChange("university", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department</Label>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label>Year</Label>
                <Select 
                  value={formData.year} 
                  onValueChange={(value) => handleSelectChange("year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">自己紹介</h2>
            <Separator />
            <div>
              <Label>About Me</Label>
              <Textarea
                className="resize-none"
                placeholder="Tell us about yourself"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Hobbies and Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">趣味</h2>
              <Separator />
              <div>
                <Label>Hobbies</Label>
                <MultiSelect
                  options={[
                    { value: "reading", label: "読書" },
                    { value: "sports", label: "スポーツ" },
                    { value: "travel", label: "旅行" },
                    { value: "music", label: "音楽" },
                    { value: "movies", label: "映画" },
                    { value: "gaming", label: "ゲーム" },
                    { value: "cooking", label: "料理" },
                    { value: "photography", label: "写真" },
                    { value: "art", label: "アート" },
                    { value: "coding", label: "プログラミング" },
                  ]}
                  value={formData.hobbies}
                  onChange={(values) => handleMultiSelectChange("hobbies", values)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">言語</h2>
              <Separator />
              <div>
                <Label>Languages</Label>
                <MultiSelect
                  options={languageOptions}
                  value={formData.languages}
                  onChange={(values) => handleMultiSelectChange("languages", values)}
                />
              </div>
            </div>
          </div>

          {/* Language Levels */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">言語レベル</h2>
            <Separator />
            {formData.languages.map((language) => (
              <div key={language} className="space-y-2">
                <Label htmlFor={`${language}-level`}>{languageOptions.find(opt => opt.value === language)?.label}</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id={`${language}-level`}
                    defaultValue={[formData.languageLevels[language] || 1]}
                    max={5}
                    step={1}
                    onValueChange={(value) => handleLanguageLevelChange(language, value[0])}
                  />
                  <span>{formData.languageLevels[language] || 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Languages */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">学習中の言語</h2>
            <Separator />
            <div>
              <Label>Learning Languages</Label>
              <MultiSelect
                options={languageOptions}
                value={formData.learning_languages}
                onChange={(values) => handleMultiSelectChange("learning_languages", values)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <AdditionalInfoSection 
            additionalData={additionalData} 
            onChange={handleAdditionalDataChange} 
            loading={loading} 
          />

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "送信中..." : "送信"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
