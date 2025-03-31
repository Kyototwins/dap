
import { useEffect, useState } from "react";
import { Profile } from "@/types/messages";
import { Card, CardContent } from "@/components/ui/card";
import { fetchUserStats, UserStats } from "@/services/profileStatsService";

interface UserProfileAboutTabProps {
  profile: Profile;
}

export function UserProfileAboutTab({ profile }: UserProfileAboutTabProps) {
  const [stats, setStats] = useState<UserStats>({
    connectionsCount: 0,
    eventsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (profile.id) {
        const userStats = await fetchUserStats(profile.id);
        setStats(userStats);
      }
      setLoading(false);
    };
    
    loadStats();
  }, [profile.id]);

  return (
    <div className="space-y-6">
      {/* About */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">About</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{profile.about_me}</p>
        </CardContent>
      </Card>

      {/* Basic Information */}
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

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Languages I Speak</h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-doshisha-lightPurple/20 text-doshisha-purple rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Languages */}
      {profile.learning_languages && profile.learning_languages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Languages I'm Learning</h3>
            <div className="flex flex-wrap gap-2">
              {profile.learning_languages.map((language, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hobbies */}
      {profile.hobbies && profile.hobbies.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-4">Hobbies & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {hobby}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fun Questions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Fun Questions</h3>
          <div className="space-y-4">
            {profile.ideal_date && (
              <div>
                <p className="text-gray-500 text-sm mb-1">My ideal date would be...</p>
                <p className="text-gray-700">{profile.ideal_date}</p>
              </div>
            )}
            {profile.life_goal && (
              <div>
                <p className="text-gray-500 text-sm mb-1">My life goal is...</p>
                <p className="text-gray-700">{profile.life_goal}</p>
              </div>
            )}
            {profile.superpower && (
              <div>
                <p className="text-gray-500 text-sm mb-1">If I had one superpower, it would be...</p>
                <p className="text-gray-700">{profile.superpower}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">CONNECTIONS</p>
              <p className="text-2xl font-semibold text-doshisha-purple">
                {loading ? "..." : stats.connectionsCount}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">EVENTS</p>
              <p className="text-2xl font-semibold text-doshisha-purple">
                {loading ? "..." : stats.eventsCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
