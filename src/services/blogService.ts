
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
            username: profile.username || "Anonymous",
            avatar_url: profile.avatar_url,
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
    const { data: comments, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("blog_id", blogId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Fetch author information for each comment
    const commentsWithAuthors = await Promise.all(
      (comments as Comment[]).map(async (comment) => {
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
