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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      doctor_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          full_name: string | null
          id: string
          license_number: string | null
          phone: string | null
          profession: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          license_number?: string | null
          phone?: string | null
          profession?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          license_number?: string | null
          phone?: string | null
          profession?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patient_alerts: {
        Row: {
          acknowledged_at: string | null
          alert_type: string
          created_at: string | null
          doctor_id: string | null
          id: string
          is_acknowledged: boolean | null
          message: string
          patient_id: string
          priority: Database["public"]["Enums"]["alert_priority"] | null
        }
        Insert: {
          acknowledged_at?: string | null
          alert_type: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message: string
          patient_id: string
          priority?: Database["public"]["Enums"]["alert_priority"] | null
        }
        Update: {
          acknowledged_at?: string | null
          alert_type?: string
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          is_acknowledged?: boolean | null
          message?: string
          patient_id?: string
          priority?: Database["public"]["Enums"]["alert_priority"] | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_vitals: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          glucose_level: number | null
          heart_rate: number | null
          id: string
          oxygen_level: number | null
          patient_id: string
          recorded_at: string | null
          respiratory_rate: number | null
          temperature: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          glucose_level?: number | null
          heart_rate?: number | null
          id?: string
          oxygen_level?: number | null
          patient_id: string
          recorded_at?: string | null
          respiratory_rate?: number | null
          temperature?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          glucose_level?: number | null
          heart_rate?: number | null
          id?: string
          oxygen_level?: number | null
          patient_id?: string
          recorded_at?: string | null
          respiratory_rate?: number | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          admission_date: string | null
          age: number
          bed_number: string | null
          created_at: string | null
          diagnosis: string | null
          doctor_id: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          gender: string | null
          id: string
          is_icu: boolean | null
          name: string
          password_given: boolean | null
          registered_by: string | null
          room: string
          status: Database["public"]["Enums"]["patient_status"] | null
          stored_password: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admission_date?: string | null
          age: number
          bed_number?: string | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          is_icu?: boolean | null
          name: string
          password_given?: boolean | null
          registered_by?: string | null
          room: string
          status?: Database["public"]["Enums"]["patient_status"] | null
          stored_password?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admission_date?: string | null
          age?: number
          bed_number?: string | null
          created_at?: string | null
          diagnosis?: string | null
          doctor_id?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          is_icu?: boolean | null
          name?: string
          password_given?: boolean | null
          registered_by?: string | null
          room?: string
          status?: Database["public"]["Enums"]["patient_status"] | null
          stored_password?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      receptionist_profiles: {
        Row: {
          created_at: string
          department: string | null
          full_name: string
          hospital_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          full_name: string
          hospital_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          full_name?: string
          hospital_name?: string | null
          id?: string
          phone?: string | null
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
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_priority: "low" | "moderate" | "high" | "critical"
      app_role: "doctor" | "receptionist" | "patient"
      patient_status: "normal" | "warning" | "critical"
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
      alert_priority: ["low", "moderate", "high", "critical"],
      app_role: ["doctor", "receptionist", "patient"],
      patient_status: ["normal", "warning", "critical"],
    },
  },
} as const
