
import { API_BASE_URL, getAuthHeaders, getFileUploadHeaders } from './apiConfig';

export interface FlashcardDeck {
  deck_id: string;
  title: string;
  date_created: string;
  card_count?: number;
}

export interface FlashcardCard {
  card_id: string;
  deck_id?: string;
  question: string;
  answer?: string;
  times_reviewed?: number;
  correct_count?: number;
  wrong_count?: number;
  is_bookmarked?: boolean;
  is_studied?: boolean;
  last_reviewed?: string;
}

export interface PracticeCard {
  card_id: string;
  question: string;
  answer: string; // Add answer to the initial fetch
}

export interface RevealedCard {
  card_id: string;
  answer: string;
}

export interface SubmitResponse {
  message: string;
  card_id: string;
  is_correct: boolean;
  times_reviewed: number;
  correct_count: number;
  wrong_count: number;
  last_reviewed: string;
}

export interface GenerateResponse {
  message: string;
  cards: Array<{
    question: string;
    answer: string;
  }>;
  summary_points: string[];
  status: string;
}

export interface QuizCard {
  card_id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
}

export interface QuizStart {
  deck_id: string;
  cards: QuizCard[];
}

export interface QuizResponse {
  card_id: string;
  user_answer: string;
  is_correct: boolean;
}

export interface QuizResult {
  total_questions: number;
  correct: number;
  wrong: number;
  detailed_results: Array<{
    card_id: string;
    your_answer: string;
    correct_answer: string;
    correct: boolean;
  }>;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  deck_id: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  final_score: number;
  final_rank: string;
  max_streak: number;
  time_taken_seconds?: number;
  created_at: string;
}

export const flashcardApi = {
  // Deck management
  createDeck: async (title: string): Promise<FlashcardDeck> => {
    console.log('API: Creating deck with title:', title);
    console.log('API: Using endpoint:', `${API_BASE_URL}/flashcard/decks`);
    
    const response = await fetch(`${API_BASE_URL}/flashcard/decks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    
    console.log('API: Create deck response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API: Create deck error:', errorText);
      throw new Error(`Failed to create deck: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API: Create deck success:', result);
    return result;
  },

  getDecks: async (): Promise<FlashcardDeck[]> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/decks`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch decks');
    }
    
    const decks = await response.json();
    
    // Fetch card count for each deck using the correct endpoint
    const decksWithCounts = await Promise.all(
      decks.map(async (deck: FlashcardDeck) => {
        try {
          const cardsResponse = await fetch(`${API_BASE_URL}/flashcard/decks/${deck.deck_id}/get-cards`, {
            method: 'GET',
            headers: getAuthHeaders()
          });
          
          if (cardsResponse.ok) {
            const cards = await cardsResponse.json();
            console.log(`Deck ${deck.deck_id} has ${cards.length} cards:`, cards);
            return { ...deck, card_count: Array.isArray(cards) ? cards.length : 0 };
          } else if (cardsResponse.status === 404) {
            // Handle 404 - deck has no cards yet
            console.log(`Deck ${deck.deck_id} has no cards yet (404)`);
            return { ...deck, card_count: 0 };
          }
          console.log(`Failed to fetch cards for deck ${deck.deck_id}: ${cardsResponse.status}`);
          return { ...deck, card_count: 0 };
        } catch (error) {
          console.error(`Error fetching card count for deck ${deck.deck_id}:`, error);
          return { ...deck, card_count: 0 };
        }
      })
    );
    
    return decksWithCounts;
  },

  getDeckCards: async (deckId: string): Promise<FlashcardCard[]> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/get-cards`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch deck cards');
    }
    
    return response.json();
  },

  // Fixed card generation method with proper authentication and validation
  generateFlashcards: async (deckId: string, file: File, maxCards: number = 30): Promise<GenerateResponse> => {
    // Client-side file validation
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size must be less than ${maxSizeInMB}MB`);
    }

    const supportedTypes = ['.pdf', '.pptx', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!supportedTypes.includes(fileExtension)) {
      throw new Error(`Unsupported file type. Please upload: ${supportedTypes.join(', ')}`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('max_cards', maxCards.toString());
    
    console.log(`Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB) to deck ${deckId}`);
    console.log(`API endpoint: ${API_BASE_URL}/flashcard/decks/${deckId}/generate-flashcards`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/generate-flashcards`, {
        method: 'POST',
        headers: getFileUploadHeaders(),
        body: formData
      });
      
      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: response.url
        });
        
        // Provide more specific error messages
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 413) {
          throw new Error('File too large. Please upload a smaller file.');
        } else if (response.status === 415) {
          throw new Error('Unsupported file type. Please upload PDF, PPTX, DOCX, or TXT files.');
        } else if (response.status === 422) {
          throw new Error('Invalid file content. Please check your file and try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Upload failed: ${response.status} - ${errorText || response.statusText}`);
        }
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
      
    } catch (error) {
      console.error('Network error during upload:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  addCards: async (deckId: string, cards: Array<{ question: string; answer: string }>): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/cards/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cards })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add cards');
    }
  },

  // Updated practice mode to fetch both question and answer
  getPracticeCard: async (deckId: string): Promise<PracticeCard> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/practice`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get practice card');
    }
    
    return response.json();
  },

  // Keep the reveal endpoint for compatibility, but it may not be needed anymore
  revealCard: async (cardId: string): Promise<RevealedCard> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/reveal`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to reveal card');
    }
    
    return response.json();
  },

  submitResponse: async (cardId: string, isCorrect: boolean): Promise<SubmitResponse> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/submit-response`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_correct: isCorrect })
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit response');
    }
    
    return response.json();
  },

  // Card actions
  markStudied: async (cardId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/mark-studied`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark card as studied');
    }
  },

  bookmarkCard: async (cardId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to bookmark card');
    }
  },

  unbookmarkCard: async (cardId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/unbookmark`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to unbookmark card');
    }
  },

  toggleBookmark: async (cardId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/toggle-bookmark`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle bookmark');
    }
  },

  resetCard: async (cardId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/${cardId}/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to reset card');
    }
  },

  // Filtered cards
  getBookmarkedCards: async (): Promise<FlashcardCard[]> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/bookmarked`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get bookmarked cards');
    }
    
    return response.json();
  },

  getUnstudiedCards: async (): Promise<FlashcardCard[]> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/unstudied`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get unstudied cards');
    }
    
    return response.json();
  },

  getHardCards: async (): Promise<FlashcardCard[]> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/cards/hard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get hard cards');
    }
    
    return response.json();
  },

  // Fixed quiz mode methods with multiple choice support
  startQuiz: async (deckId: string, limit: number = 5): Promise<QuizStart> => {
    console.log(`Starting quiz for deck ${deckId} with limit ${limit}`);
    const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/quiz?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Quiz start error:', errorText);
      throw new Error(`Failed to start quiz: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Quiz started successfully:', result);
    
    // If backend doesn't provide options yet, generate them from other cards
    if (result.cards && result.cards.length > 0 && !result.cards[0].options) {
      // Get all cards from the deck to generate distractors
      const deckCards = await flashcardApi.getDeckCards(deckId);
      
      result.cards = result.cards.map((quizCard: any, index: number) => {
        // Find the correct answer from deck cards
        const fullCard = deckCards.find(card => card.card_id === quizCard.card_id);
        const correctAnswer = fullCard?.answer || 'Unknown';
        
        // Generate 3 distractors from other cards
        const otherAnswers = deckCards
          .filter(card => card.card_id !== quizCard.card_id && card.answer)
          .map(card => card.answer!)
          .slice(0, 3);
        
        // Fill remaining slots if we don't have enough distractors
        while (otherAnswers.length < 3) {
          otherAnswers.push(`Option ${otherAnswers.length + 1}`);
        }
        
        // Create options array with correct answer at random position
        const correctIndex = Math.floor(Math.random() * 4);
        const options = [...otherAnswers.slice(0, 3)];
        options.splice(correctIndex, 0, correctAnswer);
        
        return {
          card_id: quizCard.card_id,
          question: quizCard.question,
          options: options.slice(0, 4),
          correct_answer_index: correctIndex
        };
      });
    }
    
    return result;
  },

  submitQuiz: async (responses: QuizResponse[]): Promise<QuizResult> => {
    console.log('Submitting quiz responses:', responses);
    const response = await fetch(`${API_BASE_URL}/flashcard/quiz/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(responses)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Quiz submit error:', errorText);
      throw new Error(`Failed to submit quiz: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Quiz submitted successfully:', result);
    return result;
  },

  // Adaptive drill generation methods
  generateAdaptiveDrills: async (deckId: string, mode: 'wrong' | 'bookmark', maxCards: number = 10): Promise<GenerateResponse> => {
    console.log(`Generating adaptive drills for deck ${deckId} with mode ${mode}`);
    const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/regenerate-adaptive-drills/?mode=${mode}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ max_cards: maxCards })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Adaptive drill generation error:', errorText);
      throw new Error(`Failed to generate adaptive drills: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Adaptive drills generated successfully:', result);
    return result;
  },

  // Quiz attempts methods
  getQuizAttempts: async (deckId?: string): Promise<QuizAttempt[]> => {
    let url = `${API_BASE_URL}/flashcard/quiz-attempts`;
    if (deckId) {
      url += `?deck_id=${deckId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz attempts');
    }
    
    return response.json();
  },

  getBestScore: async (deckId: string): Promise<number> => {
    const response = await fetch(`${API_BASE_URL}/flashcard/decks/${deckId}/best-score`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch best score');
    }
    
    const result = await response.json();
    return result.best_score || 0;
  }
};
