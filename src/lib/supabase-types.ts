export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          phone: string | null
          first_name: string | null
          last_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      toys: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          price_per_day: number
          min_age: number | null
          max_age: number | null
          categories: string[] | null
          educational_benefits: string[] | null
          safety_info: string | null
          available: boolean
          average_rating: number
          rent_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          price_per_day: number
          min_age?: number | null
          max_age?: number | null
          categories?: string[] | null
          educational_benefits?: string[] | null
          safety_info?: string | null
          available?: boolean
          average_rating?: number
          rent_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          price_per_day?: number
          min_age?: number | null
          max_age?: number | null
          categories?: string[] | null
          educational_benefits?: string[] | null
          safety_info?: string | null
          available?: boolean
          average_rating?: number
          rent_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      rentals: {
        Row: {
          id: string
          user_id: string
          toy_id: string
          start_date: string
          end_date: string
          total_amount: number
          status: string
          payment_status: string
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          toy_id: string
          start_date: string
          end_date: string
          total_amount: number
          status?: string
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          toy_id?: string
          start_date?: string
          end_date?: string
          total_amount?: number
          status?: string
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          pincode: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          pincode: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          pincode?: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}