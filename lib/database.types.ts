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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active_listing_count: number
          created_at: string
          description: string | null
          id: string
          is_indexable: boolean
          launch_phase: number
          name: string
          parent_id: string | null
          pillar: string
          slug: string
          updated_at: string
        }
        Insert: {
          active_listing_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_indexable?: boolean
          launch_phase?: number
          name: string
          parent_id?: string | null
          pillar: string
          slug: string
          updated_at?: string
        }
        Update: {
          active_listing_count?: number
          created_at?: string
          description?: string | null
          id?: string
          is_indexable?: boolean
          launch_phase?: number
          name?: string
          parent_id?: string | null
          pillar?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_pages: {
        Row: {
          body_markdown: string
          category_id: string | null
          content_language: string
          content_type: string
          created_at: string
          expected_release_date: string | null
          id: string
          is_indexable: boolean
          launch_confidence: string | null
          published_at: string | null
          slug: string
          source_url: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          body_markdown: string
          category_id?: string | null
          content_language?: string
          content_type: string
          created_at?: string
          expected_release_date?: string | null
          id?: string
          is_indexable?: boolean
          launch_confidence?: string | null
          published_at?: string | null
          slug: string
          source_url?: string | null
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          body_markdown?: string
          category_id?: string | null
          content_language?: string
          content_type?: string
          created_at?: string
          expected_release_date?: string | null
          id?: string
          is_indexable?: boolean
          launch_confidence?: string | null
          published_at?: string | null
          slug?: string
          source_url?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_pages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_staging: {
        Row: {
          ai_synthesis: Json | null
          fetched_at: string
          id: string
          proposed_category_id: string | null
          raw_payload: Json
          source_name: string
          status: string
          target_table: string
        }
        Insert: {
          ai_synthesis?: Json | null
          fetched_at?: string
          id?: string
          proposed_category_id?: string | null
          raw_payload: Json
          source_name: string
          status?: string
          target_table: string
        }
        Update: {
          ai_synthesis?: Json | null
          fetched_at?: string
          id?: string
          proposed_category_id?: string | null
          raw_payload?: Json
          source_name?: string
          status?: string
          target_table?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_staging_proposed_category_id_fkey"
            columns: ["proposed_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      link_clicks: {
        Row: {
          clicked_at: string
          id: string
          link_id: string
          referrer_path: string | null
          region_detected: string | null
        }
        Insert: {
          clicked_at?: string
          id?: string
          link_id: string
          referrer_path?: string | null
          region_detected?: string | null
        }
        Update: {
          clicked_at?: string
          id?: string
          link_id?: string
          referrer_path?: string | null
          region_detected?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "link_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "links"
            referencedColumns: ["id"]
          },
        ]
      }
      links: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          is_primary: boolean
          label: string | null
          program_name: string | null
          region: string
          url: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          is_primary?: boolean
          label?: string | null
          program_name?: string | null
          region?: string
          url: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_primary?: boolean
          label?: string | null
          program_name?: string | null
          region?: string
          url?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          category_id: string
          cons: string[]
          content_language: string
          created_at: string
          description: string | null
          design_score: number | null
          editorial_notes: string | null
          id: string
          ideal_for: string[]
          is_indexable: boolean
          last_verified_at: string
          price_currency: string | null
          price_from: number | null
          pros: string[]
          published_at: string | null
          related_context_product_id: string | null
          release_year: number | null
          slug: string
          specs: Json
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id: string
          cons?: string[]
          content_language?: string
          created_at?: string
          description?: string | null
          design_score?: number | null
          editorial_notes?: string | null
          id?: string
          ideal_for?: string[]
          is_indexable?: boolean
          last_verified_at?: string
          price_currency?: string | null
          price_from?: number | null
          pros?: string[]
          published_at?: string | null
          related_context_product_id?: string | null
          release_year?: number | null
          slug: string
          specs?: Json
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string
          cons?: string[]
          content_language?: string
          created_at?: string
          description?: string | null
          design_score?: number | null
          editorial_notes?: string | null
          id?: string
          ideal_for?: string[]
          is_indexable?: boolean
          last_verified_at?: string
          price_currency?: string | null
          price_from?: number | null
          pros?: string[]
          published_at?: string | null
          related_context_product_id?: string | null
          release_year?: number | null
          slug?: string
          specs?: Json
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_related_context_product_id_fkey"
            columns: ["related_context_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_items: {
        Row: {
          id: string
          item_id: string
          item_type: string
          note: string | null
          position: number
          setup_id: string
        }
        Insert: {
          id?: string
          item_id: string
          item_type: string
          note?: string | null
          position?: number
          setup_id: string
        }
        Update: {
          id?: string
          item_id?: string
          item_type?: string
          note?: string | null
          position?: number
          setup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_items_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "setups"
            referencedColumns: ["id"]
          },
        ]
      }
      setups: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_indexable: boolean
          published_at: string | null
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_indexable?: boolean
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_indexable?: boolean
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      software: {
        Row: {
          category_id: string
          cons: string[]
          content_language: string
          created_at: string
          description: string | null
          editorial_notes: string | null
          id: string
          ideal_for: string[]
          is_indexable: boolean
          last_verified_at: string
          name: string
          price_currency: string | null
          price_from: number | null
          price_text: string | null
          pricing_model: string | null
          pros: string[]
          published_at: string | null
          release_year: number | null
          slug: string
          status: string
          tags: string[]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category_id: string
          cons?: string[]
          content_language?: string
          created_at?: string
          description?: string | null
          editorial_notes?: string | null
          id?: string
          ideal_for?: string[]
          is_indexable?: boolean
          last_verified_at?: string
          name: string
          price_currency?: string | null
          price_from?: number | null
          price_text?: string | null
          pricing_model?: string | null
          pros?: string[]
          published_at?: string | null
          release_year?: number | null
          slug: string
          status?: string
          tags?: string[]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category_id?: string
          cons?: string[]
          content_language?: string
          created_at?: string
          description?: string | null
          editorial_notes?: string | null
          id?: string
          ideal_for?: string[]
          is_indexable?: boolean
          last_verified_at?: string
          name?: string
          price_currency?: string | null
          price_from?: number | null
          price_text?: string | null
          pricing_model?: string | null
          pros?: string[]
          published_at?: string | null
          release_year?: number | null
          slug?: string
          status?: string
          tags?: string[]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "software_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
