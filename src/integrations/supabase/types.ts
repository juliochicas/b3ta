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
      client_pages: {
        Row: {
          auto_renew: boolean
          created_at: string
          created_by: string
          currency: string
          custom_domain: string | null
          customer_id: string | null
          domain_status: string
          html_storage_path: string
          id: string
          is_active: boolean
          last_payment_date: string | null
          monthly_fee: number | null
          next_payment_date: string | null
          page_password: string | null
          renewal_conditions: string | null
          service_expiration_date: string | null
          service_start_date: string | null
          service_type: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          created_by?: string
          currency?: string
          custom_domain?: string | null
          customer_id?: string | null
          domain_status?: string
          html_storage_path: string
          id?: string
          is_active?: boolean
          last_payment_date?: string | null
          monthly_fee?: number | null
          next_payment_date?: string | null
          page_password?: string | null
          renewal_conditions?: string | null
          service_expiration_date?: string | null
          service_start_date?: string | null
          service_type?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          created_by?: string
          currency?: string
          custom_domain?: string | null
          customer_id?: string | null
          domain_status?: string
          html_storage_path?: string
          id?: string
          is_active?: boolean
          last_payment_date?: string | null
          monthly_fee?: number | null
          next_payment_date?: string | null
          page_password?: string | null
          renewal_conditions?: string | null
          service_expiration_date?: string | null
          service_start_date?: string | null
          service_type?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_pages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_reports: {
        Row: {
          conclusions: string | null
          consultant_name: string
          consultant_signature: string | null
          created_at: string
          created_by: string
          current_situation: string | null
          customer_id: string
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
          customer_id: string
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
          customer_id?: string
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
            foreignKeyName: "consultation_reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_consultation_reports_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
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
          customer_number: number
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
          customer_number?: number
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
          customer_number?: number
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
      email_accounts: {
        Row: {
          created_at: string
          created_by: string
          display_name: string
          email: string
          id: string
          imap_host: string
          imap_port: number
          is_active: boolean
          is_default: boolean
          password_encrypted: string
          smtp_host: string
          smtp_port: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          display_name: string
          email: string
          id?: string
          imap_host: string
          imap_port?: number
          is_active?: boolean
          is_default?: boolean
          password_encrypted: string
          smtp_host: string
          smtp_port?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          display_name?: string
          email?: string
          id?: string
          imap_host?: string
          imap_port?: number
          is_active?: boolean
          is_default?: boolean
          password_encrypted?: string
          smtp_host?: string
          smtp_port?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_attachments: {
        Row: {
          content_type: string | null
          created_at: string
          email_id: string
          filename: string
          id: string
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          email_id: string
          filename: string
          id?: string
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          email_id?: string
          filename?: string
          id?: string
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          account_id: string | null
          assigned_to: string | null
          bcc_email: string[] | null
          body_html: string | null
          body_text: string | null
          cc_email: string[] | null
          created_at: string
          customer_id: string | null
          email_references: string[] | null
          folder: string
          from_email: string
          has_attachments: boolean | null
          id: string
          imap_uid: string | null
          in_reply_to: string | null
          is_draft: boolean | null
          is_read: boolean | null
          is_sent: boolean | null
          is_starred: boolean | null
          lead_id: string | null
          message_id: string | null
          received_at: string | null
          sent_at: string | null
          subject: string
          thread_id: string | null
          to_email: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          assigned_to?: string | null
          bcc_email?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_email?: string[] | null
          created_at?: string
          customer_id?: string | null
          email_references?: string[] | null
          folder?: string
          from_email: string
          has_attachments?: boolean | null
          id?: string
          imap_uid?: string | null
          in_reply_to?: string | null
          is_draft?: boolean | null
          is_read?: boolean | null
          is_sent?: boolean | null
          is_starred?: boolean | null
          lead_id?: string | null
          message_id?: string | null
          received_at?: string | null
          sent_at?: string | null
          subject: string
          thread_id?: string | null
          to_email: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          assigned_to?: string | null
          bcc_email?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_email?: string[] | null
          created_at?: string
          customer_id?: string | null
          email_references?: string[] | null
          folder?: string
          from_email?: string
          has_attachments?: boolean | null
          id?: string
          imap_uid?: string | null
          in_reply_to?: string | null
          is_draft?: boolean | null
          is_read?: boolean | null
          is_sent?: boolean | null
          is_starred?: boolean | null
          lead_id?: string | null
          message_id?: string | null
          received_at?: string | null
          sent_at?: string | null
          subject?: string
          thread_id?: string | null
          to_email?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
        ]
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
      generated_quotations: {
        Row: {
          client_page_id: string | null
          created_at: string
          created_by: string
          currency: string
          customer_company: string | null
          customer_name: string | null
          id: string
          result_json: Json
          updated_at: string
        }
        Insert: {
          client_page_id?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          customer_company?: string | null
          customer_name?: string | null
          id?: string
          result_json: Json
          updated_at?: string
        }
        Update: {
          client_page_id?: string | null
          created_at?: string
          created_by?: string
          currency?: string
          customer_company?: string | null
          customer_name?: string | null
          id?: string
          result_json?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_quotations_client_page_id_fkey"
            columns: ["client_page_id"]
            isOneToOne: false
            referencedRelation: "client_pages"
            referencedColumns: ["id"]
          },
        ]
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
          customer_id: string
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
          customer_id: string
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
          customer_id?: string
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
            foreignKeyName: "fk_invoices_customer"
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
      meeting_attendees: {
        Row: {
          attendance_status: string
          attendee_type: string
          created_at: string
          customer_id: string | null
          external_email: string | null
          external_name: string | null
          id: string
          lead_id: string | null
          meeting_id: string
          updated_at: string
        }
        Insert: {
          attendance_status?: string
          attendee_type: string
          created_at?: string
          customer_id?: string | null
          external_email?: string | null
          external_name?: string | null
          id?: string
          lead_id?: string | null
          meeting_id: string
          updated_at?: string
        }
        Update: {
          attendance_status?: string
          attendee_type?: string
          created_at?: string
          customer_id?: string | null
          external_email?: string | null
          external_name?: string | null
          id?: string
          lead_id?: string | null
          meeting_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendees_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_attendees_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_attendees_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          created_by: string
          customer_id: string | null
          duration_minutes: number
          id: string
          lead_id: string | null
          meeting_link: string | null
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
          created_by: string
          customer_id?: string | null
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          meeting_link?: string | null
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
          created_by?: string
          customer_id?: string | null
          duration_minutes?: number
          id?: string
          lead_id?: string | null
          meeting_link?: string | null
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
            foreignKeyName: "fk_meetings_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_meetings_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads_b3ta"
            referencedColumns: ["id"]
          },
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
          customer_id: string
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
          customer_id: string
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
          customer_id?: string
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
            foreignKeyName: "fk_quotations_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
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
      showcase_videos: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          display_order: number | null
          duration: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          seo_keywords: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
          views_count: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          display_order?: number | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          seo_keywords?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
          views_count?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          display_order?: number | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          seo_keywords?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
          views_count?: number | null
        }
        Relationships: []
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
      user_settings: {
        Row: {
          created_at: string
          default_terms_conditions: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_terms_conditions?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_terms_conditions?: string | null
          id?: string
          updated_at?: string
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
