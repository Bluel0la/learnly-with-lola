
import { QueryClient } from '@tanstack/react-query';
import { ErrorRecoveryService } from '@/services/errorRecovery';

// Default stale time: 5 minutes
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

// Default cache time: 10 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_CACHE_TIME,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408, 429
        if (error instanceof Error) {
          const status = error.message.match(/\b4\d{2}\b/)?.[0];
          if (status && !['408', '429'].includes(status)) {
            return false;
          }
        }
        
        return ErrorRecoveryService.isRetryableError(error as Error) && failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error) => {
        return ErrorRecoveryService.isRetryableError(error as Error) && failureCount < 2;
      },
      retryDelay: 1000,
    },
  },
});

// Query keys factory for better organization
export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  chat: {
    sessions: ['chat', 'sessions'] as const,
    messages: (chatId: string) => ['chat', 'messages', chatId] as const,
  },
  quiz: {
    topics: ['quiz', 'topics'] as const,
    performance: ['quiz', 'performance'] as const,
    history: ['quiz', 'history'] as const,
    session: (sessionId: string) => ['quiz', 'session', sessionId] as const,
  },
  flashcards: {
    decks: ['flashcards', 'decks'] as const,
    deck: (deckId: string) => ['flashcards', 'deck', deckId] as const,
    cards: (deckId: string) => ['flashcards', 'cards', deckId] as const,
  },
} as const;
