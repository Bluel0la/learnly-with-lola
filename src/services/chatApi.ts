import { API_BASE_URL, getAuthHeaders } from './apiConfig';
import { secureTokenStorage } from './secureTokenStorage';

// Chat related types
export interface ChatSession {
  chat_id: string;
  chat_title: string;
  created_at: string;
}

export interface ChatMessage {
  query: string;
  response: string;
  timestamp: string;
}

export interface StartSessionRequest {
  chat_title: string;
}

export interface SendMessageRequest {
  prompt: string;
  chat_id: string;
}

// Image extraction types
export interface ExtractTextResponse {
  text: string;
}

// Chat API service
export const chatApi = {
  // Start a new chat session
  startSession: async (data: StartSessionRequest): Promise<ChatSession> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/start-session`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to start chat session');
      }

      return response.json();
    } catch (error) {
      console.error('Start session error:', error);
      throw error;
    }
  },

  // Send a message in a chat session
  sendMessage: async (data: SendMessageRequest): Promise<ChatMessage> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/send-message`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to send message');
      }

      return response.json();
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  // Get all messages in a chat session
  getSessionMessages: async (chatId: string): Promise<ChatMessage[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/session/${chatId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch chat messages');
      }

      return response.json();
    } catch (error) {
      console.error('Fetch chat messages error:', error);
      throw error;
    }
  },

  // Get all chat sessions for a user
  getSessions: async (): Promise<ChatSession[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
        method: 'GET',
        headers: getAuthHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch chat sessions');
      }

      return response.json();
    } catch (error) {
      console.error('Fetch chat sessions error:', error);
      throw error;
    }
  },

  // Delete a chat session
  deleteSession: async (chatId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/delete-chat/${chatId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete chat session');
      }
    } catch (error) {
      console.error('Delete session error:', error);
      throw error;
    }
  },

  // Extract text from image
  extractText: async (file: File): Promise<ExtractTextResponse> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/chat/extract-text/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secureTokenStorage.getToken()}`,
          'Accept': 'application/json',
        },
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to extract text from image');
      }

      return response.json();
    } catch (error) {
      console.error('Extract text error:', error);
      throw error;
    }
  }
};
