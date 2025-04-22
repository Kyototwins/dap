
interface ProfileFormProps {
  formData: ProfileFormData;
  additionalData: AdditionalDataType;
  images: ImageUploadState;
  onChange: (name: string, value: string | string[] | Record<string, number>) => void;
  onAdditionalChange: (name: string, value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'image1' | 'image2' | 'hobby' | 'pet') => void;
  onPhotoCommentChange: (field: string, comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}
