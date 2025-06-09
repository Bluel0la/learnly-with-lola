
import { API_BASE_URL, getAuthHeaders } from './apiConfig';

// Types for Quiz API
export interface MathTopic {
  topic_id: string;
  name: string;
}

export interface StartQuizRequest {
  topic: string;
  num_questions: number;
}

export interface StartQuizResponse {
  session_id: string;
  topic: string;
  total_questions: number;
  message: string;
  historical_accuracy: number;
}

export interface QuizQuestion {
  question_id: string;
  question: string;
  choices: string[];
  topic: string;
  difficulty: string;
}

export interface QuestionBatchResponse {
  session_id: string;
  current_batch: QuizQuestion[];
  remaining: number;
}

export interface QuestionResponse {
  question_id: string;
  selected_answer: string;
}

export interface SubmitAnswersRequest {
  responses: QuestionResponse[];
}

export interface GradedAnswer {
  question_id: string;
  correct_answer: string;
  selected_answer: string;
  is_correct: boolean;
  explanation: string;
}

export interface SubmitResultResponse {
  correct: number;
  wrong: number;
  graded: GradedAnswer[];
  total_attempted: number;
  score_percent: number;
  next_difficulty: string;
}

export interface AdaptiveBatchRequest {
  num_questions: number;
  difficulty: string;
}

export interface AdaptiveQuestionBatch {
  session_id: string;
  current_batch: QuizQuestion[];
  remaining: number;
  difficulty_level: string;
  previous_score_percent: number;
}

class QuizApi {
  async getAvailableTopics(): Promise<MathTopic[]> {
    const response = await fetch(`${API_BASE_URL}/quiz/math/topics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch available topics');
    }

    return response.json();
  }

  async startQuizSession(request: StartQuizRequest): Promise<StartQuizResponse> {
    const response = await fetch(`${API_BASE_URL}/quiz/math/start`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to start quiz session');
    }

    return response.json();
  }

  async getQuestionBatch(sessionId: string): Promise<QuestionBatchResponse> {
    const response = await fetch(`${API_BASE_URL}/quiz/math/questions/${sessionId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  }

  async submitAnswers(sessionId: string, request: SubmitAnswersRequest): Promise<SubmitResultResponse> {
    const response = await fetch(`${API_BASE_URL}/quiz/math/${sessionId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answers');
    }

    return response.json();
  }

  async getNextAdaptiveBatch(sessionId: string, request: AdaptiveBatchRequest): Promise<AdaptiveQuestionBatch> {
    const response = await fetch(`${API_BASE_URL}/quiz/math/${sessionId}/next-batch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to get next batch');
    }

    return response.json();
  }
}

export const quizApi = new QuizApi();
