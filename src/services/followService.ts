
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createNotification } from "@/services/notificationService"; // Add import

export interface Follower {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profile?: {
    username: string;
    avatar_url?: string;
  };
}

// Follow a user
export async function followUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("user_follows")
      .insert([
        {
          follower_id: (await supabase.auth.getSession()).data.session?.user.id,
          following_id: userId,
        },
      ]);

    if (error) {
      throw new Error(error.message);
    }

    // Create a notification for the user being followed
    await createNotification({
      user_id: userId,
      type: "new_follower",
      content: {
        follower_id: (await supabase.auth.getSession()).data.session?.user.id,
      },
    });

    return true;
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}

// Unfollow a user
export async function unfollowUser(userId: string): Promise<boolean> {
  try {
    const currentUserId = (await supabase.auth.getSession()).data.session?.user.id;
    
    const { error } = await supabase
      .from("user_follows")
      .delete()
      .match({ 
        follower_id: currentUserId,
        following_id: userId 
      });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}

// Check if current user follows another user
export async function isFollowing(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_follows")
      .select("*")
      .match({
        follower_id: (await supabase.auth.getSession()).data.session?.user.id,
        following_id: userId,
      })
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the not found error
      throw new Error(error.message);
    }

    return !!data;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

// Get followers of a user
export async function getFollowers(userId: string): Promise<Follower[]> {
  try {
    const { data, error } = await supabase
      .from("user_follows")
      .select("*")
      .eq("following_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    // Get profile information for each follower
    const followersWithProfiles = await Promise.all(
      data.map(async (follower) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", follower.follower_id)
          .single();

        if (profileError) {
          return {
            ...follower,
            profile: {
              username: "Unknown User",
            },
          };
        }

        return {
          ...follower,
          profile: {
            username: profile.username || "Anonymous",
            avatar_url: profile.avatar_url,
          },
        };
      })
    );

    return followersWithProfiles;
  } catch (error) {
    console.error("Error getting followers:", error);
    throw error;
  }
}

// Get users that a user is following
export async function getFollowing(userId: string): Promise<Follower[]> {
  try {
    const { data, error } = await supabase
      .from("user_follows")
      .select("*")
      .eq("follower_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    // Get profile information for each following
    const followingWithProfiles = await Promise.all(
      data.map(async (following) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", following.following_id)
          .single();

        if (profileError) {
          return {
            ...following,
            profile: {
              username: "Unknown User",
            },
          };
        }

        return {
          ...following,
          profile: {
            username: profile.username || "Anonymous",
            avatar_url: profile.avatar_url,
          },
        };
      })
    );

    return followingWithProfiles;
  } catch (error) {
    console.error("Error getting following:", error);
    throw error;
  }
}
