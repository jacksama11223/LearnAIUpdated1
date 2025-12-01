
export interface Testimonial {
  id: number;
  name: string;
  date: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type LearningMethod = 'Flashcard' | 'Quiz' | 'Fill-in-the-blanks' | 'Spot the Error' | 'Case Study';

// Content structures
export interface FlashcardItem {
  front: string;
  back: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
}

export interface FillBlankItem {
  sentence: string; // The sentence with a blank (represented by underscores)
  answer: string;   // The word that fills the blank
}

export interface SpotErrorItem {
  text: string;       // The sentence containing an error
  error: string;      // Explanation of the error
  correction: string; // The corrected sentence
}

export interface CaseStudyItem {
  scenario: string;
  question: string;
  analysis: string;
}

export interface KnowledgeNode {
  id: string;
  title: string;
  type: LearningMethod;
  status: 'new' | 'learning' | 'mastered';
  x: number; // Coordinate for graph (percentage)
  y: number; // Coordinate for graph (percentage)
  sourceUrl?: string;
  timestamp: Date;
  
  // SM-2 Spaced Repetition Data
  sm2?: {
    repetitions: number; // n: number of successful recalls
    interval: number;    // I: days until next review
    efactor: number;     // EF: easiness factor (min 1.3, default 2.5)
    nextReviewDate: Date; // Calculated date for next review
    lastReviewDate?: Date;
  };

  // Store the generated AI content here
  data?: {
    flashcards?: FlashcardItem[];
    quiz?: QuizItem[];
    fillInBlanks?: FillBlankItem[];
    spotErrors?: SpotErrorItem[];
    caseStudies?: CaseStudyItem[];
    summary?: string;
  };
}
