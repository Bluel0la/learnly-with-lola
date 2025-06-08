
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from './useUserProfile';

interface DeckRank {
  deckId: string;
  bestRank: string;
  bestScore: number;
  lastUpdated: string;
}

export const useDeckRank = (deckId?: string) => {
  const [deckRanks, setDeckRanks] = useState<Record<string, DeckRank>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useUserProfile();

  const calculateRank = (score: number, totalQuestions: number): string => {
    if (totalQuestions === 0) return 'UNRANKED';
    
    const percentage = (score / (totalQuestions * 100)) * 100;
    
    if (percentage >= 90) return 'S+';
    if (percentage >= 75) return 'S';
    if (percentage >= 60) return 'A';
    if (percentage >= 45) return 'B';
    if (percentage >= 35) return 'C';
    if (percentage >= 25) return 'D';
    return 'E';
  };

  const fetchDeckRank = async (targetDeckId: string) => {
    if (!profile?.user_id) return null;

    try {
      // Get the best score from quiz table for this user and deck
      const { data: quizData, error } = await supabase
        .from('quiz')
        .select('best_score, date_created')
        .eq('user_id', profile.user_id)
        .order('best_score', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching quiz data:', error);
        return null;
      }

      if (!quizData || quizData.length === 0) {
        return { deckId: targetDeckId, bestRank: 'UNRANKED', bestScore: 0, lastUpdated: '' };
      }

      // Get total questions in deck to calculate rank properly
      const { data: deckCards, error: cardsError } = await supabase
        .from('deck_card')
        .select('card_id')
        .eq('deck_id', targetDeckId);

      if (cardsError) {
        console.error('Error fetching deck cards:', cardsError);
        return null;
      }

      const totalQuestions = deckCards?.length || 0;
      const bestScore = quizData[0].best_score || 0;
      const rank = calculateRank(bestScore, totalQuestions);

      return {
        deckId: targetDeckId,
        bestRank: rank,
        bestScore,
        lastUpdated: quizData[0].date_created
      };
    } catch (error) {
      console.error('Error in fetchDeckRank:', error);
      return null;
    }
  };

  const fetchAllDeckRanks = async () => {
    if (!profile?.user_id) return;

    setIsLoading(true);
    try {
      // Get all decks for the user
      const { data: decks, error: decksError } = await supabase
        .from('deck')
        .select('deck_id')
        .eq('user_id', profile.user_id);

      if (decksError || !decks) {
        console.error('Error fetching decks:', decksError);
        return;
      }

      // Fetch rank for each deck
      const rankPromises = decks.map(deck => fetchDeckRank(deck.deck_id));
      const ranks = await Promise.all(rankPromises);
      
      const ranksMap: Record<string, DeckRank> = {};
      ranks.forEach(rank => {
        if (rank) {
          ranksMap[rank.deckId] = rank;
        }
      });

      setDeckRanks(ranksMap);
    } catch (error) {
      console.error('Error fetching all deck ranks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDeckRank = async (targetDeckId: string) => {
    const rank = await fetchDeckRank(targetDeckId);
    if (rank) {
      setDeckRanks(prev => ({
        ...prev,
        [targetDeckId]: rank
      }));
    }
  };

  useEffect(() => {
    if (profile?.user_id) {
      if (deckId) {
        refreshDeckRank(deckId);
      } else {
        fetchAllDeckRanks();
      }
    }
  }, [profile?.user_id, deckId]);

  return {
    deckRanks,
    isLoading,
    refreshDeckRank,
    fetchAllDeckRanks,
    getDeckRank: (targetDeckId: string) => deckRanks[targetDeckId] || { deckId: targetDeckId, bestRank: 'UNRANKED', bestScore: 0, lastUpdated: '' }
  };
};
