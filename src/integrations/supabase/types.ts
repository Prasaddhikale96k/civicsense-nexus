export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          avg_resolution_time: unknown | null
          category: Database["public"]["Enums"]["issue_category"] | null
          count: number | null
          created_at: string
          date: string
          id: string
          location: string | null
        }
        Insert: {
          avg_resolution_time?: unknown | null
          category?: Database["public"]["Enums"]["issue_category"] | null
          count?: number | null
          created_at?: string
          date: string
          id?: string
          location?: string | null
        }
        Update: {
          avg_resolution_time?: unknown | null
          category?: Database["public"]["Enums"]["issue_category"] | null
          count?: number | null
          created_at?: string
          date?: string
          id?: string
          location?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_official: boolean | null
          issue_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_official?: boolean | null
          issue_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_official?: boolean | null
          issue_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          address: string | null
          ai_confidence_score: number | null
          assigned_department: string | null
          assigned_to: string | null
          category: Database["public"]["Enums"]["issue_category"]
          created_at: string
          description: string
          downvotes: number | null
          id: string
          image_urls: string[] | null
          latitude: number | null
          longitude: number | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["issue_status"] | null
          title: string
          updated_at: string
          upvotes: number | null
          user_id: string
          video_urls: string[] | null
          view_count: number | null
          voice_transcript: string | null
        }
        Insert: {
          address?: string | null
          ai_confidence_score?: number | null
          assigned_department?: string | null
          assigned_to?: string | null
          category: Database["public"]["Enums"]["issue_category"]
          created_at?: string
          description: string
          downvotes?: number | null
          id?: string
          image_urls?: string[] | null
          latitude?: number | null
          longitude?: number | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
          video_urls?: string[] | null
          view_count?: number | null
          voice_transcript?: string | null
        }
        Update: {
          address?: string | null
          ai_confidence_score?: number | null
          assigned_department?: string | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["issue_category"]
          created_at?: string
          description?: string
          downvotes?: number | null
          id?: string
          image_urls?: string[] | null
          latitude?: number | null
          longitude?: number | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["issue_status"] | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
          video_urls?: string[] | null
          view_count?: number | null
          voice_transcript?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_issue_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_issue_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_issue_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_issue_id_fkey"
            columns: ["related_issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          points: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          points?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          issue_id: string
          user_id: string
          vote_type: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          issue_id: string
          user_id: string
          vote_type: boolean
        }
        Update: {
          created_at?: string
          id?: string
          issue_id?: string
          user_id?: string
          vote_type?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "votes_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      issue_category:
        | "pothole"
        | "streetlight"
        | "garbage"
        | "water_leak"
        | "damaged_sign"
        | "broken_sidewalk"
        | "other"
      issue_status:
        | "reported"
        | "verified"
        | "in_progress"
        | "resolved"
        | "rejected"
      priority_level: "low" | "medium" | "high" | "critical"
      user_role: "citizen" | "municipal_staff" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      issue_category: [
        "pothole",
        "streetlight",
        "garbage",
        "water_leak",
        "damaged_sign",
        "broken_sidewalk",
        "other",
      ],
      issue_status: [
        "reported",
        "verified",
        "in_progress",
        "resolved",
        "rejected",
      ],
      priority_level: ["low", "medium", "high", "critical"],
      user_role: ["citizen", "municipal_staff", "admin"],
    },
  },
} as const
