export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          answer: string | null
          question_id: string
        }
        Insert: {
          answer?: string | null
          question_id: string
        }
        Update: {
          answer?: string | null
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "quiz_question"
            referencedColumns: ["question_answer_id"]
          },
        ]
      }
      chat: {
        Row: {
          chat_id: string
          chat_title: string | null
          created_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_id: string
          chat_title?: string | null
          created_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string
          chat_title?: string | null
          created_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      deck: {
        Row: {
          date_created: string | null
          deck_id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          date_created?: string | null
          deck_id: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          date_created?: string | null
          deck_id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      deck_card: {
        Row: {
          answer: string | null
          card_id: string
          card_with_answer: string
          chunk_index: number | null
          correct_count: number | null
          date_created: string | null
          deck_id: string | null
          is_bookmarked: boolean | null
          is_studied: boolean | null
          last_reviewed: string | null
          question: string | null
          source_chunk: string | null
          source_summary: string | null
          times_reviewed: number | null
          user_id: string | null
          wrong_count: number | null
        }
        Insert: {
          answer?: string | null
          card_id: string
          card_with_answer: string
          chunk_index?: number | null
          correct_count?: number | null
          date_created?: string | null
          deck_id?: string | null
          is_bookmarked?: boolean | null
          is_studied?: boolean | null
          last_reviewed?: string | null
          question?: string | null
          source_chunk?: string | null
          source_summary?: string | null
          times_reviewed?: number | null
          user_id?: string | null
          wrong_count?: number | null
        }
        Update: {
          answer?: string | null
          card_id?: string
          card_with_answer?: string
          chunk_index?: number | null
          correct_count?: number | null
          date_created?: string | null
          deck_id?: string | null
          is_bookmarked?: boolean | null
          is_studied?: boolean | null
          last_reviewed?: string | null
          question?: string | null
          source_chunk?: string | null
          source_summary?: string | null
          times_reviewed?: number | null
          user_id?: string | null
          wrong_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_card_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "deck"
            referencedColumns: ["deck_id"]
          },
          {
            foreignKeyName: "deck_card_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      flashcard_attempt: {
        Row: {
          attempt_id: string
          attempt_number: number | null
          attempt_time: string | null
          card_id: string | null
          correct: boolean | null
          hint_used: boolean | null
          time_taken_seconds: number | null
          user_id: string | null
        }
        Insert: {
          attempt_id: string
          attempt_number?: number | null
          attempt_time?: string | null
          card_id?: string | null
          correct?: boolean | null
          hint_used?: boolean | null
          time_taken_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          attempt_id?: string
          attempt_number?: number | null
          attempt_time?: string | null
          card_id?: string | null
          correct?: boolean | null
          hint_used?: boolean | null
          time_taken_seconds?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_attempt_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "deck_card"
            referencedColumns: ["card_id"]
          },
          {
            foreignKeyName: "flashcard_attempt_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      model_response: {
        Row: {
          chat_id: string | null
          date_sent: string | null
          model_response: string
          query_id: string | null
          response_id: string
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          date_sent?: string | null
          model_response: string
          query_id?: string | null
          response_id: string
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          date_sent?: string | null
          model_response?: string
          query_id?: string | null
          response_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "model_response_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "model_response_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "user_prompt"
            referencedColumns: ["query_id"]
          },
          {
            foreignKeyName: "model_response_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quiz: {
        Row: {
          best_score: number | null
          date_created: string | null
          quiz_id: string
          user_id: string | null
        }
        Insert: {
          best_score?: number | null
          date_created?: string | null
          quiz_id: string
          user_id?: string | null
        }
        Update: {
          best_score?: number | null
          date_created?: string | null
          quiz_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quiz_question: {
        Row: {
          question_answer: string
          question_answer_id: string
          quiz_id: string | null
          user_id: string | null
        }
        Insert: {
          question_answer: string
          question_answer_id: string
          quiz_id?: string | null
          user_id?: string | null
        }
        Update: {
          question_answer?: string
          question_answer_id?: string
          quiz_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["quiz_id"]
          },
          {
            foreignKeyName: "quiz_question_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quizzer: {
        Row: {
          correct_answers: number | null
          date_created: string | null
          difficulty: string | null
          quiz_id: string
          status: string | null
          topic: string
          total_questions: number | null
          user_id: string | null
        }
        Insert: {
          correct_answers?: number | null
          date_created?: string | null
          difficulty?: string | null
          quiz_id: string
          status?: string | null
          topic: string
          total_questions?: number | null
          user_id?: string | null
        }
        Update: {
          correct_answers?: number | null
          date_created?: string | null
          difficulty?: string | null
          quiz_id?: string
          status?: string | null
          topic?: string
          total_questions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quizzer_question: {
        Row: {
          choices: string
          correct_answer: string
          difficulty: string
          explanation: string | null
          is_correct: number | null
          question_id: string
          question_text: string
          quiz_id: string | null
          topic: string
          user_answer: string | null
          user_id: string | null
        }
        Insert: {
          choices: string
          correct_answer: string
          difficulty: string
          explanation?: string | null
          is_correct?: number | null
          question_id: string
          question_text: string
          quiz_id?: string | null
          topic: string
          user_answer?: string | null
          user_id?: string | null
        }
        Update: {
          choices?: string
          correct_answer?: string
          difficulty?: string
          explanation?: string | null
          is_correct?: number | null
          question_id?: string
          question_text?: string
          quiz_id?: string | null
          topic?: string
          user_answer?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzer_question_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quiz"
            referencedColumns: ["quiz_id"]
          },
          {
            foreignKeyName: "quizzer_question_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      refresh_tokens: {
        Row: {
          expires_at: string | null
          id: string
          token: string
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          id: string
          token: string
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          token?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      reinforced_card: {
        Row: {
          card_id: string
          original_card_id: string | null
          reason: string | null
        }
        Insert: {
          card_id: string
          original_card_id?: string | null
          reason?: string | null
        }
        Update: {
          card_id?: string
          original_card_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reinforced_card_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: true
            referencedRelation: "deck_card"
            referencedColumns: ["card_id"]
          },
          {
            foreignKeyName: "reinforced_card_original_card_id_fkey"
            columns: ["original_card_id"]
            isOneToOne: false
            referencedRelation: "deck_card"
            referencedColumns: ["card_id"]
          },
        ]
      }
      revoked_tokens: {
        Row: {
          expires_at: string
          token: string
          user_id: string
        }
        Insert: {
          expires_at: string
          token: string
          user_id: string
        }
        Update: {
          expires_at?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revoked_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user: {
        Row: {
          age: number | null
          educational_level: string | null
          email: string
          firstname: string | null
          gender: string | null
          lastname: string | null
          password: string
          user_id: string
        }
        Insert: {
          age?: number | null
          educational_level?: string | null
          email: string
          firstname?: string | null
          gender?: string | null
          lastname?: string | null
          password: string
          user_id: string
        }
        Update: {
          age?: number | null
          educational_level?: string | null
          email?: string
          firstname?: string | null
          gender?: string | null
          lastname?: string | null
          password?: string
          user_id?: string
        }
        Relationships: []
      }
      user_prompt: {
        Row: {
          chat_id: string | null
          date_sent: string | null
          query: string
          query_id: string
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          date_sent?: string | null
          query: string
          query_id: string
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          date_sent?: string | null
          query?: string
          query_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_prompt_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["chat_id"]
          },
          {
            foreignKeyName: "user_prompt_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["user_id"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
