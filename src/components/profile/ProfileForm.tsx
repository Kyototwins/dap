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
      <h1 className="text-3xl font-bold text-center mb-2">Profile Setup</h1>
      <p className="text-center text-gray-600 mb-8">Tell us about yourself</p>
      
      <Form {...form}>
        <form onSubmit={onSubmitForm} className="space-y-8">
          {/* Profile Photos Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Photos</h2>
            <Separator />
            
            {/* Profile Photo (Avatar) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Profile Photo</h3>
              <div className="flex justify-center">
                <AvatarUpload 
                  image={images.avatar} 
                  setImage={(img) => setImages(prev => ({ ...prev, avatar: img }))} 
                />
              </div>
            </div>
            
            {/* Other Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Header Photo</h3>
                <ImageUploadComponent 
                  label="Image 1" 
                  image={images.image1} 
                  setImage={(img) => setImages(prev => ({ ...prev, image1: img }))} 
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Additional Photo 2</h3>
                <ImageUploadComponent 
                  label="Image 2" 
                  image={images.image2} 
                  setImage={(img) => setImages(prev => ({ ...prev, image2: img }))} 
                />
              </div>
            </div>
            
            {/* Hobby Photo */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Photo of me enjoying my hobby</h3>
              <ImageUploadComponent 
                label="Hobby Photo" 
                image={images.hobby} 
                setImage={(img) => setImages(prev => ({ ...prev, hobby: img }))} 
              />
              
              <div className="mt-3">
                <Label>Photo Comment</Label>
                <Textarea
                  name="hobbyPhotoComment"
                  placeholder="Share something about this photo..."
                  value={formData.hobbyPhotoComment}
                  onChange={handleInputChange}
                  className="resize-none"
                />
              </div>
            </div>
            
            {/* Pet Photo */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Photo of my pet</h3>
              <ImageUploadComponent 
                label="Pet Photo" 
                image={images.pet} 
                setImage={(img) => setImages(prev => ({ ...prev, pet: img }))} 
              />
              
              <div className="mt-3">
                <Label>Photo Comment</Label>
                <Textarea
                  name="petPhotoComment"
                  placeholder="Share something about this photo..."
                  value={formData.petPhotoComment}
                  onChange={handleInputChange}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>姓</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="山田"
                />
              </div>
              <div>
                <Label>名</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="太郎"
                />
              </div>
            </div>
            
            <div>
              <Label>大学</Label>
              <Select 
                value={formData.university} 
                onValueChange={(value) => handleSelectChange("university", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="大学を選択" />
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
              <Label>学部</Label>
              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="学部を入力"
              />
            </div>
            
            <div>
              <Label>学年</Label>
              <Select 
                value={formData.year} 
                onValueChange={(value) => handleSelectChange("year", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="学年を選択" />
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
            
            <div>
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="年齢を入力"
              />
            </div>
            
            <div>
              <Label>Gender</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="性別を選択" />
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
                placeholder="出身地を入力"
              />
            </div>
            
            <div>
              <Label>Sexuality</Label>
              <Input
                name="sexuality"
                value={formData.sexuality}
                onChange={handleInputChange}
                placeholder="性的指向を入力（任意）"
              />
            </div>
            
            <div>
              <Label>About Me</Label>
              <Textarea
                className="resize-none"
                placeholder="自己紹介を書いてください"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Language Skills */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Language Skills</h2>
            <Separator />
            
            <div>
              <Label>Languages</Label>
              <MultiSelect
                options={languageOptions}
                value={formData.languages}
                onChange={(values) => handleMultiSelectChange("languages", values)}
              />
            </div>
            
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
            
            <div>
              <h3 className="text-lg font-medium mb-2">Currently Learning</h3>
              <MultiSelect
                options={languageOptions}
                value={formData.learning_languages}
                onChange={(values) => handleMultiSelectChange("learning_languages", values)}
              />
            </div>
          </div>
          
          {/* Hobbies & Interests */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Hobbies & Interests</h2>
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
                  { value: "hiking", label: "ハイキング" },
                ]}
                value={formData.hobbies}
                onChange={(values) => handleMultiSelectChange("hobbies", values)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Additional Information</h2>
            <Separator />
            
            <div className="space-y-4">
              <div>
                <Label>My worst nightmare is...</Label>
                <Textarea
                  name="worstNightmare"
                  placeholder="Tell us about your worst nightmare..."
                  value={additionalData.worstNightmare}
                  onChange={handleAdditionalDataChange}
                  className="resize-none"
                />
              </div>
              
              <div>
                <Label>If we become friends, I want to do...</Label>
                <Textarea
                  name="friendActivity"
                  placeholder="What would you like us to do together as friends?"
                  value={additionalData.friendActivity}
                  onChange={handleAdditionalDataChange}
                  className="resize-none"
                />
              </div>
              
              <div>
                <Label>My best quality is...</Label>
                <Textarea
                  name="bestQuality"
                  placeholder="Tell us about your best quality..."
                  value={additionalData.bestQuality}
                  onChange={handleAdditionalDataChange}
                  className="resize-none"
                />
              </div>
              
              <div>
                <Label>If you could have a superpower, what would it be?</Label>
                <Textarea
                  name="superpower"
                  placeholder="Tell us about your desired superpower..."
                  value={additionalData.superpower}
                  onChange={handleAdditionalDataChange}
                  className="resize-none"
                />
              </div>
              
              <div>
                <Label>My life goal...</Label>
                <Textarea
                  name="lifeGoal"
                  placeholder="Tell us about your life goal..."
                  value={additionalData.lifeGoal}
                  onChange={handleAdditionalDataChange}
                  className="resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-full"
            >
              {loading ? "送信中..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
