
export interface Blog {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  cover_image?: string;
}

export interface BlogWithAuthor extends Blog {
  author: {
    username: string;
    avatar_url?: string;
  };
}

export interface NewBlog {
  title: string;
  content: string;
  cover_image?: string;
}
