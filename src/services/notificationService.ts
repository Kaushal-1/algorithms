
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  content: any;
  is_read: boolean;
  created_at: string;
}

export interface NotificationCreate {
  user_id: string;
  type: string;
  content: any;
}

// Get notifications for the current user
export async function getNotifications(): Promise<Notification[]> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to view notifications");
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userData.session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data as Notification[];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Create a notification
export async function createNotification(notification: NotificationCreate): Promise<Notification> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert([notification])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to update notifications");
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .match({ id: notificationId, user_id: userData.session.user.id });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getSession();
    
    if (userError || !userData.session) {
      throw new Error("User must be logged in to update notifications");
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userData.session.user.id)
      .eq("is_read", false);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}
