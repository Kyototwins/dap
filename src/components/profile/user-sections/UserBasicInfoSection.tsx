
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";

interface UserBasicInfoSectionProps {
  profile: Profile;
}

export function UserBasicInfoSection({ profile }: UserBasicInfoSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">Basic Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Age</span>
            <span>{profile.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Gender</span>
            <span>{profile.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">From</span>
            <span>{profile.origin}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">University</span>
            <span>{profile.university}</span>
          </div>
          {profile.department && (
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span>{profile.department}</span>
            </div>
          )}
          {profile.year && (
            <div className="flex justify-between">
              <span className="text-gray-500">Year</span>
              <span>{profile.year}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
