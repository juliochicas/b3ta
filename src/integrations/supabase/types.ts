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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      consultation_reports: {
        Row: {
          conclusions: string | null
          consultant_name: string
          consultant_signature: string | null
          created_at: string
          created_by: string
          current_situation: string | null
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          findings: string | null
          id: string
          lead_id: string | null
          public_slug: string | null
          recommendations: string | null
          report_number: string
          sections_config: Json
          status: string
          updated_at: string
        }
        Insert: {
          conclusions?: string | null
          consultant_name: string
          consultant_signature?: string | null
          created_at?: string
          created_by?: string
          current_situation?: string | null
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          findings?: string | null
          id?: string
          lead_id?: string | null
          public_slug?: string | null
          recommendations?: string | null
          report_number: string
          sections_config?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          conclusions?: string | null
          consultant_name?: string
          consultant_signature?: string | null
          created_at?: string
          created_by?: string
          current_situation?: string | null
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          findings?: string | null
          id?: string
          lead_id?: string | null
          public_slug?: string | null
          recommendations?: string | null
          report_number?: string
          sections_config?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_reports_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_consultation_reports_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          created_by: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          created_by: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          created_by?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expense_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          item_name: string
          quantity: number
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          item_name: string
          quantity?: number
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          item_name?: string
          quantity?: number
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency: string
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          payment_date: string | null
          payment_status: string
          quotation_id: string | null
          sent_at: string | null
          stripe_charge_id: string | null
          stripe_payment_intent: string | null
          subtotal: number
          tax_amount: number
          tax_rate: number
          terms_conditions: string | null
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: string
          quotation_id?: string | null
          sent_at?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent?: string | null
          subtotal: number
          tax_amount?: number
          tax_rate?: number
          terms_conditions?: string | null
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          payment_date?: string | null
          payment_status?: string
          quotation_id?: string | null
          sent_at?: string | null
          stripe_charge_id?: string | null
          stripe_payment_intent?: string | null
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          terms_conditions?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          lead_id: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          lead_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          lead_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lead_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lead_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_b3ta: {
        Row: {
          ai_score: number | null
          ai_summary: string | null
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          last_contact: string | null
          message: string | null
          name: string
          notes: string | null
          phone: string | null
          priority: string | null
          service_interest: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          ai_score?: number | null
          ai_summary?: string | null
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          last_contact?: string | null
          message?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          ai_score?: number | null
          ai_summary?: string | null
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          last_contact?: string | null
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          priority?: string | null
          service_interest?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      meetings: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          duration_minutes: number
          id: string
          lead_id: string | null
          meeting_type: string
          notes: string | null
          reminder_sent: boolean | null
          scheduled_at: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          meeting_type?: string
          notes?: string | null
          reminder_sent?: boolean | null
          scheduled_at: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          meeting_type?: string
          notes?: string | null
          reminder_sent?: boolean | null
          scheduled_at?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meetings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
        ]
      }
      products_services: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotation_expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string
          description: string
          expense_date: string
          id: string
          notes: string | null
          quotation_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          notes?: string | null
          quotation_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          notes?: string | null
          quotation_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotation_expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_expenses_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number | null
          id: string
          item_name: string
          product_service_id: string | null
          quantity: number
          quotation_id: string
          total: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          item_name: string
          product_service_id?: string | null
          quantity?: number
          quotation_id: string
          total: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          id?: string
          item_name?: string
          product_service_id?: string | null
          quantity?: number
          quotation_id?: string
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_product_service_id_fkey"
            columns: ["product_service_id"]
            isOneToOne: false
            referencedRelation: "products_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          customer_company: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          lead_id: string | null
          notes: string | null
          quotation_number: string
          report_id: string | null
          sent_at: string | null
          status: string
          stripe_payment_link: string | null
          subtotal: number
          tags: string[] | null
          tax_amount: number | null
          tax_rate: number | null
          terms_conditions: string | null
          total: number
          tracking_number: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          currency?: string
          customer_company?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          quotation_number: string
          report_id?: string | null
          sent_at?: string | null
          status?: string
          stripe_payment_link?: string | null
          subtotal?: number
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          customer_company?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          quotation_number?: string
          report_id?: string | null
          sent_at?: string | null
          status?: string
          stripe_payment_link?: string | null
          subtotal?: number
          tags?: string[] | null
          tax_amount?: number | null
          tax_rate?: number | null
          terms_conditions?: string | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotations_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_quotations_report"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "consultation_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "consultation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      report_media: {
        Row: {
          caption: string | null
          created_at: string
          file_size: number | null
          id: string
          is_external: boolean
          report_id: string
          type: string
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          is_external?: boolean
          report_id: string
          type: string
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          is_external?: boolean
          report_id?: string
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_media_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "consultation_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      count_consultation_reports: { Args: never; Returns: number }
      generate_invoice_number: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
      generate_report_number: { Args: never; Returns: string }
      generate_report_slug: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      migrate_customer_data: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "sales" | "user"
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
      app_role: ["admin", "sales", "user"],
    },
  },
} as const
