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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      papers: {
        Row: {
          abstract: string
          assigned_professor_id: string | null
          assigned_professor_name: string | null
          attachments: string[] | null
          author_email: string | null
          author_id: string | null
          author_name: string
          co_authors: string | null
          created_at: string
          discipline: string
          id: string
          keywords: string | null
          manuscript_type: string | null
          paper_type: string
          revision_comments: string | null
          status: string
          submission_date: string
          title: string
          updated_at: string
        }
        Insert: {
          abstract?: string
          assigned_professor_id?: string | null
          assigned_professor_name?: string | null
          attachments?: string[] | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string
          co_authors?: string | null
          created_at?: string
          discipline?: string
          id?: string
          keywords?: string | null
          manuscript_type?: string | null
          paper_type?: string
          revision_comments?: string | null
          status?: string
          submission_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string
          assigned_professor_id?: string | null
          assigned_professor_name?: string | null
          attachments?: string[] | null
          author_email?: string | null
          author_id?: string | null
          author_name?: string
          co_authors?: string | null
          created_at?: string
          discipline?: string
          id?: string
          keywords?: string | null
          manuscript_type?: string | null
          paper_type?: string
          revision_comments?: string | null
          status?: string
          submission_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      professor_submissions: {
        Row: {
          abstract: string | null
          admin_notes: string | null
          authors: string
          cover_image: string | null
          created_at: string
          description: string | null
          discipline: string
          doi: string | null
          edition: string | null
          editors: string | null
          id: string
          isbn: string | null
          issue: string | null
          keywords: string | null
          pages: string | null
          pdf_url: string | null
          professor_id: string
          professor_name: string
          publication_date: string | null
          publication_year: string | null
          publisher: string | null
          purchase_link: string | null
          status: string
          submission_type: string
          title: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          admin_notes?: string | null
          authors?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          discipline?: string
          doi?: string | null
          edition?: string | null
          editors?: string | null
          id?: string
          isbn?: string | null
          issue?: string | null
          keywords?: string | null
          pages?: string | null
          pdf_url?: string | null
          professor_id: string
          professor_name?: string
          publication_date?: string | null
          publication_year?: string | null
          publisher?: string | null
          purchase_link?: string | null
          status?: string
          submission_type?: string
          title: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          admin_notes?: string | null
          authors?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          discipline?: string
          doi?: string | null
          edition?: string | null
          editors?: string | null
          id?: string
          isbn?: string | null
          issue?: string | null
          keywords?: string | null
          pages?: string | null
          pdf_url?: string | null
          professor_id?: string
          professor_name?: string
          publication_date?: string | null
          publication_year?: string | null
          publisher?: string | null
          purchase_link?: string | null
          status?: string
          submission_type?: string
          title?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          degree: string | null
          department: string | null
          email: string
          id: string
          name: string
          phone_number: string | null
          specialization: string | null
          status: string
          university: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree?: string | null
          department?: string | null
          email?: string
          id: string
          name?: string
          phone_number?: string | null
          specialization?: string | null
          status?: string
          university?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          phone_number?: string | null
          specialization?: string | null
          status?: string
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      published_books: {
        Row: {
          authors: string
          cover_image: string | null
          created_at: string
          description: string | null
          discipline: string
          edition: string | null
          editors: string | null
          id: string
          isbn: string | null
          keywords: string | null
          pdf_url: string | null
          publication_year: string | null
          publisher: string | null
          purchase_link: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          authors?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          discipline?: string
          edition?: string | null
          editors?: string | null
          id?: string
          isbn?: string | null
          keywords?: string | null
          pdf_url?: string | null
          publication_year?: string | null
          publisher?: string | null
          purchase_link?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          authors?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          discipline?: string
          edition?: string | null
          editors?: string | null
          id?: string
          isbn?: string | null
          keywords?: string | null
          pdf_url?: string | null
          publication_year?: string | null
          publisher?: string | null
          purchase_link?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      published_journals: {
        Row: {
          abstract: string | null
          authors: string
          cover_image: string | null
          created_at: string
          discipline: string
          doi: string | null
          id: string
          issue: string | null
          keywords: string | null
          pages: string | null
          pdf_url: string | null
          publication_date: string | null
          status: string
          title: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          authors?: string
          cover_image?: string | null
          created_at?: string
          discipline?: string
          doi?: string | null
          id?: string
          issue?: string | null
          keywords?: string | null
          pages?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          status?: string
          title: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          authors?: string
          cover_image?: string | null
          created_at?: string
          discipline?: string
          doi?: string | null
          id?: string
          issue?: string | null
          keywords?: string | null
          pages?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id: string
          user_name?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      upload_requests: {
        Row: {
          admin_notes: string | null
          authors: string | null
          created_at: string
          description: string | null
          id: string
          isbn: string | null
          link: string | null
          publisher: string | null
          request_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          authors?: string | null
          created_at?: string
          description?: string | null
          id?: string
          isbn?: string | null
          link?: string | null
          publisher?: string | null
          request_type?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          authors?: string | null
          created_at?: string
          description?: string | null
          id?: string
          isbn?: string | null
          link?: string | null
          publisher?: string | null
          request_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "professor" | "user"
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
      app_role: ["admin", "professor", "user"],
    },
  },
} as const
