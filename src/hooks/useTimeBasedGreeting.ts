
import { useMemo } from 'react';

interface GreetingData {
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  greetings: string[];
}

export const useTimeBasedGreeting = (): GreetingData => {
  return useMemo(() => {
    const hour = new Date().getHours();
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening';
    let baseGreeting: string;
    
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
      baseGreeting = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      timeOfDay = 'afternoon';
      baseGreeting = 'Good afternoon';
    } else {
      timeOfDay = 'evening';
      baseGreeting = 'Good evening';
    }
    
    const greetings = [
      `${baseGreeting}!`,
      timeOfDay === 'morning' 
        ? '¡Buenos días!' // Spanish
        : timeOfDay === 'afternoon'
        ? '¡Buenas tardes!' // Spanish
        : '¡Buenas noches!', // Spanish
      timeOfDay === 'morning'
        ? 'Bonjour!' // French
        : timeOfDay === 'afternoon'
        ? 'Bon après-midi!' // French
        : 'Bonsoir!', // French
      timeOfDay === 'morning'
        ? 'Guten Morgen!' // German
        : timeOfDay === 'afternoon'
        ? 'Guten Tag!' // German
        : 'Guten Abend!', // German
      timeOfDay === 'morning'
        ? 'Buongiorno!' // Italian
        : timeOfDay === 'afternoon'
        ? 'Buon pomeriggio!' // Italian
        : 'Buonasera!', // Italian
      timeOfDay === 'morning'
        ? 'おはよう!' // Japanese
        : timeOfDay === 'afternoon'
        ? 'こんにちは!' // Japanese
        : 'こんばんは!', // Japanese
    ];

    return { timeOfDay, greetings };
  }, []);
};
