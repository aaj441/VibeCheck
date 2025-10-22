import { LiveSupport } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class LiveSupportService {
  analyzeSentiment(userInput: string): 'positive' | 'neutral' | 'stressed' | 'overwhelmed' {
    const lowerInput = userInput.toLowerCase();
    
    // Overwhelmed indicators
    const overwhelmedWords = ['overwhelmed', 'can\'t handle', 'too much', 'panic', 'shutting down', 'meltdown', 'help'];
    if (overwhelmedWords.some(word => lowerInput.includes(word))) {
      return 'overwhelmed';
    }
    
    // Stressed indicators
    const stressedWords = ['nervous', 'anxious', 'worried', 'stressed', 'uncomfortable', 'awkward', 'confused', 'struggling'];
    if (stressedWords.some(word => lowerInput.includes(word))) {
      return 'stressed';
    }
    
    // Positive indicators
    const positiveWords = ['good', 'great', 'well', 'nice', 'fun', 'enjoy', 'happy', 'excited', 'going well'];
    if (positiveWords.some(word => lowerInput.includes(word))) {
      return 'positive';
    }
    
    return 'neutral';
  }
  
  generateSupport(userInput: string, sentiment: 'positive' | 'neutral' | 'stressed' | 'overwhelmed'): LiveSupport {
    const suggestions: string[] = [];
    let groundingPrompt: string | undefined;
    
    switch (sentiment) {
      case 'overwhelmed':
        suggestions.push('🛑 **Take a break right now.** It\'s okay to excuse yourself.');
        suggestions.push('💬 Say: "Excuse me, I need a moment. I\'ll be right back."');
        suggestions.push('🚶 Step away to a quiet space - bathroom, outside, or your car.');
        groundingPrompt = '**Grounding Exercise:**\n\n1. Place your feet flat on the floor\n2. Take 3 deep breaths: in for 4, hold for 4, out for 4\n3. Name 3 things you can see right now\n4. Remember: You are safe. This will pass. You\'re doing your best.';
        break;
        
      case 'stressed':
        suggestions.push('💨 Take a slow, deep breath. You\'ve got this.');
        suggestions.push('⏸️ If you need a moment, say: "Give me just a second to gather my thoughts."');
        suggestions.push('💧 Take a sip of water - it gives you a natural pause.');
        suggestions.push('🤲 Discreetly use your fidget/comfort item if you have one.');
        groundingPrompt = '**Quick Reset:**\n\n1. Breathe: 4 counts in, 4 counts out\n2. Feel your feet on the ground\n3. You\'re doing well. Stress is normal.';
        break;
        
      case 'neutral':
        suggestions.push('👍 You\'re doing fine. Keep going at your own pace.');
        suggestions.push('💬 If conversation lulls, ask an open question about them.');
        suggestions.push('👂 Remember active listening: nod, make eye contact (or look at their forehead), ask follow-ups.');
        suggestions.push('😊 A genuine smile goes a long way.');
        break;
        
      case 'positive':
        suggestions.push('🎉 You\'re doing great! Keep being yourself.');
        suggestions.push('✨ Your authentic energy is showing through - that\'s wonderful.');
        suggestions.push('💪 You\'re handling this well. Be proud of yourself!');
        suggestions.push('🌟 Continue what you\'re doing - it\'s working!');
        break;
    }
    
    // Context-specific suggestions based on input content
    if (userInput.toLowerCase().includes('don\'t know what to say')) {
      suggestions.push('❓ Try: "Tell me more about [something they mentioned]" or "What do you think about [relevant topic]?"');
    }
    
    if (userInput.toLowerCase().includes('awkward silence') || userInput.toLowerCase().includes('pause')) {
      suggestions.push('🤫 Silences are normal! You can: comment on the environment, ask about their interests, or just smile and relax.');
    }
    
    if (userInput.toLowerCase().includes('want to leave') || userInput.toLowerCase().includes('exit')) {
      suggestions.push('🚪 Graceful exit: "I need to wrap up, but thank you for [specific thing]. Take care!"');
    }
    
    if (userInput.toLowerCase().includes('said something weird') || userInput.toLowerCase().includes('mistake')) {
      suggestions.push('🔄 You can acknowledge it lightly: "That came out weird, what I meant was..." or just move forward. Most people forget small slips immediately!');
    }
    
    return {
      timestamp: new Date(),
      userInput,
      sentiment,
      suggestions,
      groundingPrompt
    };
  }
  
  createLiveSupport(userInput: string): LiveSupport {
    const sentiment = this.analyzeSentiment(userInput);
    return this.generateSupport(userInput, sentiment);
  }
}

export default new LiveSupportService();
