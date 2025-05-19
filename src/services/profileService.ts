
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UpdateProfileRequest } from "@/types/UserProfile";
import { useToast } from "@/hooks/use-toast";

export async function getProfileById(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    // Get blog count for stats
    const { count: postsCount, error: countError } = await supabase
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Error getting post count:", countError);
    }

    // Ensure we return a properly typed UserProfile with default values for missing fields
    return {
      ...data,
      expertise: data.expertise || [],
      social_links: data.social_links || {},
      verified: data.verified ?? false,
      stats: {
        posts: postsCount || 0,
        followers: 0,
        following: 0
      }
    };
  } catch (error) {
    console.error("Error in getProfileById:", error);
    return null;
  }
}

export async function updateProfile(
  profile: UpdateProfileRequest
): Promise<UserProfile | null> {
  const { toast } = useToast();
  
  try {
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session.session) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
      });
      return null;
    }

    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message,
      });
      return null;
    }

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });

    // Ensure we return a properly typed UserProfile with default values for missing fields
    return {
      ...data,
      expertise: data.expertise || [],
      social_links: data.social_links || {},
      verified: data.verified ?? false,
      stats: {
        posts: 0,
        followers: 0,
        following: 0
      }
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
}

export async function getProfilesByExpertise(expertise: string): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .contains('expertise', [expertise]);

    if (error) {
      console.error("Error fetching profiles by expertise:", error);
      return [];
    }

    // Ensure we return properly typed UserProfile objects with default values for missing fields
    return data.map(profile => ({
      ...profile,
      expertise: profile.expertise || [],
      social_links: profile.social_links || {},
      verified: profile.verified ?? false,
      stats: {
        posts: 0,
        followers: 0, 
        following: 0
      }
    })) || [];
  } catch (error) {
    console.error("Error in getProfilesByExpertise:", error);
    return [];
  }
}
