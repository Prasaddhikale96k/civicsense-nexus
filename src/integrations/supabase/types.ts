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
      departments: {
        Row: {
          contact_email: string | null
          created_at: string
          department_name: string
          id: string
          issue_type: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          department_name: string
          id?: string
          issue_type: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          department_name?: string
          id?: string
          issue_type?: string
        }
        Relationships: []
      }
      interaction_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          improvement_suggestions: string | null
          interaction_id: string | null
          is_helpful: boolean | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          improvement_suggestions?: string | null
          interaction_id?: string | null
          is_helpful?: boolean | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          improvement_suggestions?: string | null
          interaction_id?: string | null
          is_helpful?: boolean | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interaction_feedback_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "user_interactions"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_translations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          issue_id: string
          language_code: string
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          issue_id: string
          language_code: string
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          issue_id?: string
          language_code?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issue_translations_issue_id_fkey"
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
          location_lat: number | null
          location_lng: number | null
          longitude: number | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          resolution_notes: string | null
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
          location_lat?: number | null
          location_lng?: number | null
          longitude?: number | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          resolution_notes?: string | null
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
          location_lat?: number | null
          location_lng?: number | null
          longitude?: number | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          resolution_notes?: string | null
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
      knowledge_base: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          priority_score: number | null
          source_url: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          priority_score?: number | null
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          priority_score?: number | null
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
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
          google_id: string | null
          id: string
          issues_reported_count: number | null
          location: string | null
          phone: string | null
          points: number | null
          profile_pic_url: string | null
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
          google_id?: string | null
          id?: string
          issues_reported_count?: number | null
          location?: string | null
          phone?: string | null
          points?: number | null
          profile_pic_url?: string | null
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
          google_id?: string | null
          id?: string
          issues_reported_count?: number | null
          location?: string | null
          phone?: string | null
          points?: number | null
          profile_pic_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          created_at: string
          has_results: boolean | null
          id: string
          query_text: string
          response_quality_score: number | null
          result_count: number | null
          search_context: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          has_results?: boolean | null
          id?: string
          query_text: string
          response_quality_score?: number | null
          result_count?: number | null
          search_context?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          has_results?: boolean | null
          id?: string
          query_text?: string
          response_quality_score?: number | null
          result_count?: number | null
          search_context?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      topic_subscriptions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          keywords: string[] | null
          last_notification_sent: string | null
          notification_frequency: string | null
          topic: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          last_notification_sent?: string | null
          notification_frequency?: string | null
          topic: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          last_notification_sent?: string | null
          notification_frequency?: string | null
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          ai_confidence_score: number | null
          context_used: Json | null
          created_at: string
          id: string
          query_text: string
          response_data: Json | null
          response_text: string | null
          response_time_ms: number | null
          response_type: string | null
          session_id: string | null
          sources_used: Json | null
          user_id: string | null
          user_location: unknown | null
        }
        Insert: {
          ai_confidence_score?: number | null
          context_used?: Json | null
          created_at?: string
          id?: string
          query_text: string
          response_data?: Json | null
          response_text?: string | null
          response_time_ms?: number | null
          response_type?: string | null
          session_id?: string | null
          sources_used?: Json | null
          user_id?: string | null
          user_location?: unknown | null
        }
        Update: {
          ai_confidence_score?: number | null
          context_used?: Json | null
          created_at?: string
          id?: string
          query_text?: string
          response_data?: Json | null
          response_text?: string | null
          response_time_ms?: number | null
          response_type?: string | null
          session_id?: string | null
          sources_used?: Json | null
          user_id?: string | null
          user_location?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allow_data_collection: boolean | null
          created_at: string
          data_retention_days: number | null
          id: string
          language_preference: string | null
          notification_preferences: Json | null
          preferred_response_style: string | null
          topics_of_interest: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          allow_data_collection?: boolean | null
          created_at?: string
          data_retention_days?: number | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          preferred_response_style?: string | null
          topics_of_interest?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          allow_data_collection?: boolean | null
          created_at?: string
          data_retention_days?: number | null
          id?: string
          language_preference?: string | null
          notification_preferences?: Json | null
          preferred_response_style?: string | null
          topics_of_interest?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_recommendations: {
        Row: {
          clicked_at: string | null
          created_at: string
          id: string
          interaction_id: string | null
          is_clicked: boolean | null
          is_dismissed: boolean | null
          recommendation_type: string | null
          recommended_content_id: string | null
          shown_at: string | null
          similarity_score: number | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          id?: string
          interaction_id?: string | null
          is_clicked?: boolean | null
          is_dismissed?: boolean | null
          recommendation_type?: string | null
          recommended_content_id?: string | null
          shown_at?: string | null
          similarity_score?: number | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          id?: string
          interaction_id?: string | null
          is_clicked?: boolean | null
          is_dismissed?: boolean | null
          recommendation_type?: string | null
          recommended_content_id?: string | null
          shown_at?: string | null
          similarity_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_recommendations_interaction_id_fkey"
            columns: ["interaction_id"]
            isOneToOne: false
            referencedRelation: "user_interactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recommendations_recommended_content_id_fkey"
            columns: ["recommended_content_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          updated_at?: string
          user_id?: string | null
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
      analytics_dashboard: {
        Row: {
          active_users: number | null
          avg_resolution_hours: number | null
          department: string | null
          in_progress_issues: number | null
          issue_type: string | null
          report_date: string | null
          reported_issues: number | null
          resolved_issues: number | null
          total_issues: number | null
          verified_issues: number | null
        }
        Relationships: []
      }
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
