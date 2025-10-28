import Sentiment from 'sentiment';
import { SentimentAnalysis, UserState } from '../types';

export class SentimentService {
  private static sentiment = new Sentiment();

  /**
   * Analyze text sentiment and emotional tone
   */
  static analyzeSentiment(text: string): SentimentAnalysis {
    const result = this.sentiment.analyze(text);
    
    // Normalize score to -1 to 1 range
    const normalizedScore = Math.max(-1, Math.min(1, result.score / 10));
    
    // Calculate magnitude (strength of emotion)
    const magnitude = Math.abs(result.score) / 5;
    
    // Analyze emotions based on keywords and patterns
    const emotions = this.analyzeEmotions(text, result);
    
    // Determine overall tone
    const tone = this.determineTone(normalizedScore, emotions);
    
    return {
      score: normalizedScore,
      magnitude,
      emotions,
      tone
    };
  }

  /**
   * Analyze specific emotions in text
   */
  private static analyzeEmotions(text: string, sentimentResult: any) {
    const lowerText = text.toLowerCase();
    
    // Emotion keywords and patterns
    const emotionPatterns = {
      joy: [
        'happy', 'excited', 'glad', 'thrilled', 'love', 'great', 'wonderful',
        'amazing', 'fantastic', 'excellent', 'good', 'smile', 'laugh', 'fun',
        '😊', '😄', '🎉', '❤️', '😃', '😆'
      ],
      sadness: [
        'sad', 'upset', 'disappointed', 'down', 'blue', 'depressed', 'crying',
        'tears', 'sorry', 'miss', 'lonely', 'hurt', 'pain',
        '😢', '😭', '😔', '😞', '💔'
      ],
      anger: [
        'angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated',
        'pissed', 'hate', 'stupid', 'unfair', 'wrong',
        '😠', '😤', '🤬', '😡'
      ],
      fear: [
        'scared', 'afraid', 'worried', 'anxious', 'nervous', 'panic',
        'terrified', 'concern', 'stress', 'overwhelm', 'help',
        '😨', '😰', '😱', '🙏'
      ],
      surprise: [
        'wow', 'surprised', 'unexpected', 'shocking', 'amazing', 'unbelievable',
        'really', 'seriously', 'what', 'oh my',
        '😮', '😲', '🤯', '😳'
      ]
    };

    const emotions = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0
    };

    // Count emotion indicators
    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
      patterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          emotions[emotion as keyof typeof emotions] += matches.length;
        }
      });
    });

    // Analyze punctuation and capitalization
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;

    // Adjust emotions based on punctuation
    if (exclamationCount > 1) {
      emotions.surprise += exclamationCount * 0.5;
      if (sentimentResult.score > 0) emotions.joy += exclamationCount * 0.3;
      if (sentimentResult.score < 0) emotions.anger += exclamationCount * 0.3;
    }

    if (questionCount > 2) {
      emotions.fear += questionCount * 0.2;
    }

    if (capsRatio > 0.3) {
      emotions.anger += 1;
      emotions.surprise += 0.5;
    }

    // Normalize emotions to 0-1 scale
    const maxEmotion = Math.max(...Object.values(emotions), 1);
    Object.keys(emotions).forEach(key => {
      emotions[key as keyof typeof emotions] = emotions[key as keyof typeof emotions] / maxEmotion;
    });

    return emotions;
  }

  /**
   * Determine overall tone based on sentiment and emotions
   */
  private static determineTone(
    score: number,
    emotions: Record<string, number>
  ): 'positive' | 'negative' | 'neutral' | 'mixed' {
    const dominantEmotion = Object.entries(emotions)
      .sort(([, a], [, b]) => b - a)[0];

    if (Math.abs(score) < 0.1 && dominantEmotion[1] < 0.3) {
      return 'neutral';
    }

    const positiveEmotions = emotions.joy + emotions.surprise * 0.5;
    const negativeEmotions = emotions.sadness + emotions.anger + emotions.fear;

    if (positiveEmotions > 0.6 && negativeEmotions < 0.3) {
      return 'positive';
    }

    if (negativeEmotions > 0.6 && positiveEmotions < 0.3) {
      return 'negative';
    }

    return 'mixed';
  }

  /**
   * Detect user's emotional state from their message
   */
  static detectUserState(text: string, sentiment: SentimentAnalysis): UserState {
    const lowerText = text.toLowerCase();

    // Check for overwhelm indicators
    if (
      lowerText.includes('overwhelm') ||
      lowerText.includes('too much') ||
      lowerText.includes('can\'t handle') ||
      lowerText.includes('need break') ||
      sentiment.emotions.fear > 0.7
    ) {
      return 'overwhelmed';
    }

    // Check for anxiety
    if (
      lowerText.includes('anxious') ||
      lowerText.includes('nervous') ||
      lowerText.includes('worried') ||
      lowerText.includes('scared') ||
      sentiment.emotions.fear > 0.5
    ) {
      return 'anxious';
    }

    // Check for excitement
    if (
      sentiment.emotions.joy > 0.6 &&
      (lowerText.includes('excited') || lowerText.includes('happy'))
    ) {
      return 'excited';
    }

    // Check for distraction
    if (
      lowerText.includes('distracted') ||
      lowerText.includes('can\'t focus') ||
      lowerText.includes('mind wandering') ||
      lowerText.includes('forgot')
    ) {
      return 'distracted';
    }

    // Check for focus
    if (
      lowerText.includes('focused') ||
      lowerText.includes('ready') ||
      lowerText.includes('prepared')
    ) {
      return 'focused';
    }

    // Default to calm if no strong indicators
    return 'calm';
  }

  /**
   * Generate supportive suggestions based on sentiment and state
   */
  static generateSuggestions(
    sentiment: SentimentAnalysis,
    userState: UserState,
    context?: string
  ): string[] {
    const suggestions: string[] = [];

    // State-specific suggestions
    switch (userState) {
      case 'overwhelmed':
        suggestions.push(
          'Take a moment to breathe. It\'s okay to pause.',
          'You can say: "I need a moment to collect my thoughts"',
          'Consider stepping away briefly - bathroom break or fresh air',
          'Ground yourself: Name 5 things you can see right now'
        );
        break;

      case 'anxious':
        suggestions.push(
          'Remember: You\'re prepared and capable',
          'Try the 4-7-8 breathing technique: Inhale 4, hold 7, exhale 8',
          'Focus on one thing at a time - you don\'t need to be perfect',
          'It\'s okay to acknowledge nerves: "I\'m a bit nervous, thanks for your patience"'
        );
        break;

      case 'distracted':
        suggestions.push(
          'Refocus by making eye contact (or looking at their forehead)',
          'Take notes if it helps you stay engaged',
          'You can say: "Could you repeat that? I want to make sure I understand"',
          'Use active listening: Nod, say "mm-hmm", paraphrase what they said'
        );
        break;

      case 'excited':
        suggestions.push(
          'Channel that energy positively - smile and let enthusiasm show',
          'Remember to pause between thoughts - give others space to respond',
          'Great energy! Keep it balanced with active listening',
          'Your excitement is wonderful - just watch your speaking pace'
        );
        break;

      case 'focused':
        suggestions.push(
          'You\'re doing great! Keep up the good work',
          'Remember to check in with your body - stay comfortable',
          'Good focus! Don\'t forget to show warmth with occasional smiles',
          'Excellent presence - you\'ve got this!'
        );
        break;

      default:
        suggestions.push(
          'You\'re doing well - trust yourself',
          'Remember your prepared topics if conversation lulls',
          'It\'s okay to take things at your own pace',
          'Stay present and authentic - that\'s enough'
        );
    }

    // Tone-specific additions
    if (sentiment.tone === 'negative') {
      suggestions.push(
        'If things feel tense, try redirecting: "Let\'s talk about something else"',
        'Remember: You can always excuse yourself politely if needed'
      );
    }

    if (sentiment.tone === 'mixed') {
      suggestions.push(
        'Mixed feelings are normal - acknowledge them and move forward',
        'Focus on what\'s going well in the interaction'
      );
    }

    return suggestions;
  }

  /**
   * Provide real-time coaching based on conversation context
   */
  static provideRealTimeCoaching(
    userMessage: string,
    theirMessage?: string
  ): {
    analysis: SentimentAnalysis;
    userState: UserState;
    suggestions: string[];
    sampleResponses?: string[];
  } {
    const analysis = this.analyzeSentiment(userMessage);
    const userState = this.detectUserState(userMessage, analysis);
    const suggestions = this.generateSuggestions(analysis, userState);

    const result: any = {
      analysis,
      userState,
      suggestions
    };

    // If we have their message too, provide sample responses
    if (theirMessage) {
      result.sampleResponses = this.generateSampleResponses(theirMessage, userState);
    }

    return result;
  }

  /**
   * Generate sample responses based on the other person's message
   */
  private static generateSampleResponses(
    theirMessage: string,
    userState: UserState
  ): string[] {
    const responses: string[] = [];
    const lowerMessage = theirMessage.toLowerCase();

    // Question detection
    if (theirMessage.includes('?')) {
      if (userState === 'anxious' || userState === 'overwhelmed') {
        responses.push(
          'That\'s a great question. Let me think for a moment...',
          'I appreciate you asking. [Take a breath, then answer]',
          'Hmm, [pause] I think... [your answer]'
        );
      } else {
        responses.push(
          '[Direct answer], and actually that reminds me... [related point]',
          'Good question! [Answer] What about you?',
          '[Answer], though I\'m curious about your thoughts on that too'
        );
      }
    }

    // Compliment detection
    if (
      lowerMessage.includes('nice') ||
      lowerMessage.includes('great') ||
      lowerMessage.includes('love') ||
      lowerMessage.includes('amazing')
    ) {
      responses.push(
        'Thank you so much! That means a lot to me',
        'I really appreciate you saying that!',
        'That\'s very kind of you to say, thank you'
      );
    }

    // Opinion seeking
    if (lowerMessage.includes('what do you think') || lowerMessage.includes('your opinion')) {
      responses.push(
        'I think [your view]. What\'s your take on it?',
        'From my perspective, [opinion]. But I\'d love to hear your thoughts',
        'That\'s interesting to consider. I feel like [opinion], though I\'m open to different viewpoints'
      );
    }

    // Default responses for maintaining conversation
    if (responses.length === 0) {
      responses.push(
        'That\'s interesting! Tell me more about that',
        'I hadn\'t thought about it that way. [Add related thought]',
        'Oh, that reminds me of [related experience/thought]',
        '[Acknowledge their point] + [Add your perspective or question]'
      );
    }

    return responses;
  }
}