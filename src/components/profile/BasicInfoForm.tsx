
import { NameFields } from "./BasicInfo/NameFields";
import { UniversityFields } from "./BasicInfo/UniversityFields";
import { PersonalDetails } from "./BasicInfo/PersonalDetails";

interface BasicInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    origin: string;
    sexuality: string;
    aboutMe: string;
    university: string;
    department: string;
    year: string;
  };
  onChange: (name: string, value: string) => void;
  loading?: boolean;
}

export function BasicInfoForm({ formData, onChange, loading }: BasicInfoFormProps) {
  return (
    <>
      <NameFields
        firstName={formData.firstName}
        lastName={formData.lastName}
        onChange={onChange}
        loading={loading}
      />

      <UniversityFields
        university={formData.university}
        department={formData.department}
        year={formData.year}
        onChange={onChange}
        loading={loading}
      />

      <PersonalDetails
        age={formData.age}
        gender={formData.gender}
        origin={formData.origin}
        sexuality={formData.sexuality}
        aboutMe={formData.aboutMe}
        onChange={onChange}
        loading={loading}
      />
    </>
  );
}
