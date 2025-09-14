export interface Profile {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  avatar_url: string | null;
  created_at: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: string;
  user_id: string | null;
  created_at: string;
  profiles?: Profile;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
  profiles?: Profile;
}