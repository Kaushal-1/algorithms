
import { supabase } from "@/integrations/supabase/client";
import { Blog, BlogWithAuthor, Comment, NewBlog, NewComment } from "@/types/Blog";

export async function getBlogs(): Promise<BlogWithAuthor[]> {
  try {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Fetch author information for each blog
    const blogsWithAuthors = await Promise.all(
      (blogs as Blog[]).map(async (blog) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", blog.user_id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return {
            ...blog,
            author: {
              username: "Unknown User",
            },
          };
        }

        return {
          ...blog,
          author: {
            username: profile?.username || "Anonymous",
            avatar_url: profile?.avatar_url,
          },
        };
      })
    );

    return blogsWithAuthors;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

export async function getBlogsByUser(userId: string): Promise<BlogWithAuthor[]> {
  try {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Fetch author information for each blog
    const blogsWithAuthors = await Promise.all(
      (blogs as Blog[]).map(async (blog) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", blog.user_id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return {
            ...blog,
            author: {
              username: "Unknown User",
            },
          };
        }

        return {
          ...blog,
          author: {
            username: profile?.username || "Anonymous",
            avatar_url: profile?.avatar_url,
          },
        };
      })
    );

    return blogsWithAuthors;
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    throw error;
  }
}

export async function getPersonalizedFeed(): Promise<BlogWithAuthor[]> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      // If not logged in, return regular feed
      return getBlogs();
    }

    const userId = userData.session.user.id;
    
    // Get the IDs of users that the current user follows
    const { data: following, error: followingError } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (followingError) {
      throw new Error(followingError.message);
    }

    // If not following anyone, return regular feed with some personalization
    if (!following || following.length === 0) {
      return getBlogs();
    }

    // Extract the user IDs from the following data
    const followingIds = following.map(f => f.following_id);
    
    // Get blogs from followed users
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("*")
      .in("user_id", followingIds)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Fetch author information for each blog
    const blogsWithAuthors = await Promise.all(
      (blogs as Blog[]).map(async (blog) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", blog.user_id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return {
            ...blog,
            author: {
              username: "Unknown User",
            },
          };
        }

        return {
          ...blog,
          author: {
            username: profile?.username || "Anonymous",
            avatar_url: profile?.avatar_url,
          },
        };
      })
    );

    return blogsWithAuthors;
  } catch (error) {
    console.error("Error fetching personalized feed:", error);
    // Fall back to regular feed
    return getBlogs();
  }
}

export async function getTrendingBlogs(): Promise<BlogWithAuthor[]> {
  try {
    // Using joined query with proper type handling
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .order('view_count', { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching trending blogs:", error);
      return [];
    }

    // Transform the data to match the BlogWithAuthor interface with safe type handling
    return blogs.map(blog => {
      // Use any type here temporarily to bypass TypeScript's strict checking
      const blogAny = blog as any;
      return {
        ...blog,
        author: {
          username: blogAny.profiles?.username || "Anonymous",
          avatar_url: blogAny.profiles?.avatar_url,
        }
      };
    });
  } catch (error) {
    console.error("Error in getTrendingBlogs:", error);
    return [];
  }
}

export async function getBlogsByTopic(topic: string): Promise<BlogWithAuthor[]> {
  try {
    // Using joined query with proper type handling
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .ilike('content', `%${topic}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching blogs by topic '${topic}':`, error);
      return [];
    }

    // Transform the data with safe handling of potentially undefined properties
    return blogs.map(blog => {
      // Use any type here temporarily to bypass TypeScript's strict checking
      const blogAny = blog as any;
      return {
        ...blog,
        author: {
          username: blogAny.profiles?.username || "Anonymous",
          avatar_url: blogAny.profiles?.avatar_url,
        }
      };
    });
  } catch (error) {
    console.error(`Error in getBlogsByTopic for '${topic}':`, error);
    return [];
  }
}

export async function searchBlogs(query: string): Promise<BlogWithAuthor[]> {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    // Using joined query with proper type handling
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select(`
        *,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error searching blogs for '${query}':`, error);
      return [];
    }

    // Transform the data with safe handling of potentially undefined properties
    return blogs.map(blog => {
      // Use any type here temporarily to bypass TypeScript's strict checking
      const blogAny = blog as any;
      return {
        ...blog,
        author: {
          username: blogAny.profiles?.username || "Anonymous",
          avatar_url: blogAny.profiles?.avatar_url,
        }
      };
    });
  } catch (error) {
    console.error(`Error in searchBlogs for '${query}':`, error);
    return [];
  }
}

export async function incrementBlogViews(blogId: string): Promise<void> {
  try {
    // Use type assertion with unknown as an intermediate step for safer casting
    const { error } = await (supabase.rpc as any)('increment_blog_view', { blog_id: blogId });
    
    if (error) {
      // If the RPC doesn't exist, fall back to a direct update
      console.error("Error incrementing blog view using RPC:", error);
      
      // Direct update fallback
      const { data: blog, error: fetchError } = await supabase
        .from("blogs")
        .select("view_count")
        .eq("id", blogId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching blog for view count update:", fetchError);
        return;
      }
      
      const currentViews = blog?.view_count || 0;
      
      const { error: updateError } = await supabase
        .from("blogs")
        .update({ view_count: currentViews + 1 })
        .eq("id", blogId);
      
      if (updateError) {
        console.error("Error updating blog view count:", updateError);
      }
    }
  } catch (error) {
    console.error("Unexpected error in incrementBlogViews:", error);
  }
}

export async function createBlog(blog: NewBlog): Promise<Blog> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to create a blog");
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          ...blog,
          user_id: userData.session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

export async function deleteBlog(blogId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to delete a blog");
    }

    const userId = userData.session.user.id;
    
    // First check if the blog belongs to the current user
    const { data: blog, error: checkError } = await supabase
      .from("blogs")
      .select("user_id")
      .eq("id", blogId)
      .single();

    if (checkError || !blog) {
      throw new Error("Blog not found");
    }

    if (blog.user_id !== userId) {
      throw new Error("You don't have permission to delete this blog");
    }

    // Delete the blog
    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", blogId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

// Comments functionality

export async function getComments(blogId: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("blog_id", blogId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Fetch author information for each comment
    const commentsWithAuthors = await Promise.all(
      (data as Comment[]).map(async (comment) => {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", comment.user_id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return {
            ...comment,
            author: {
              username: "Unknown User",
            },
          };
        }

        return {
          ...comment,
          author: {
            username: profile.username || "Anonymous",
            avatar_url: profile.avatar_url,
          },
        };
      })
    );

    return commentsWithAuthors;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function createComment(newComment: NewComment): Promise<Comment> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to comment");
    }

    const { data, error } = await supabase
      .from("blog_comments")
      .insert([
        {
          ...newComment,
          user_id: userData.session.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Get the blog to find the author
    const { data: blog, error: blogError } = await supabase
      .from("blogs")
      .select("user_id")
      .eq("id", newComment.blog_id)
      .single();
    
    if (!blogError && blog) {
      // Create a notification for the blog author if the commenter is not the author
      if (blog.user_id !== userData.session.user.id) {
        try {
          await createNotification({
            user_id: blog.user_id,
            type: "new_comment",
            content: {
              blog_id: newComment.blog_id,
              comment_id: data.id,
              commenter_id: userData.session.user.id,
            },
          });
        } catch (notifError) {
          console.error("Error creating notification:", notifError);
          // Continue anyway, notifications are not critical
        }
      }
    }

    // Fetch the author information for the new comment
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userData.session.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return {
        ...data,
        author: {
          username: "Unknown User",
        },
      };
    }

    return {
      ...data,
      author: {
        username: profile.username || "Anonymous",
        avatar_url: profile.avatar_url,
      },
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to delete a comment");
    }

    const userId = userData.session.user.id;
    
    // First check if the comment belongs to the current user
    const { data: comment, error: checkError } = await supabase
      .from("blog_comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (checkError || !comment) {
      throw new Error("Comment not found");
    }

    if (comment.user_id !== userId) {
      throw new Error("You don't have permission to delete this comment");
    }

    // Delete the comment
    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

// Function to import from notificationService.ts
import { createNotification } from './notificationService';
