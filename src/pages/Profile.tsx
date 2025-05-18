
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { memo, useEffect } from "react";

function ProfileComponent() {
  useEffect(() => {
    console.log("Profile page mounted and ready");
  }, []);

  return <ProfileContainer />;
}

// Create a memoized version and export as default
const Profile = memo(ProfileComponent);
export default Profile;
