export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          total_questions_answered: number;
          total_correct: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'total_questions_answered' | 'total_correct'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          started_at: string;
          ended_at: string | null;
          questions_answered: number;
          correct_count: number;
          wrong_count: number;
          partial_count: number;
          ai_model_used: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      question_attempts: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          topic: string;
          question_type: string;
          difficulty: string;
          question_text: string;
          correct_answer: string;
          user_answer: string | null;
          result: string | null;
          hints_used: number;
          ai_model: string | null;
          answered_at: string;
        };
        Insert: Omit<Database['public']['Tables']['question_attempts']['Row'], 'id' | 'answered_at'>;
        Update: Partial<Database['public']['Tables']['question_attempts']['Insert']>;
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          question_text: string;
          correct_answer: string;
          topic: string;
          difficulty: string;
          question_type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookmarks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bookmarks']['Insert']>;
      };
    };
  };
}
