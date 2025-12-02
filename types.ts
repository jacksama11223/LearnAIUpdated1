
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

export interface SavedChatSession {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
  personaId: string;
}

export interface TutorPersona {
  id: string;
  name: string;
  description: string;
  icon: string;
  systemInstruction: string;
  color: string;
}

export type LearningMethod = 'Flashcard' | 'Quiz' | 'Fill-in-the-blanks' | 'Spot the Error' | 'Case Study' | 'Mixed';

// SM-2 Data Structure for individual items
export interface SM2Data {
  repetitions: number;
  interval: number;
  efactor: number;
  nextReviewDate: string; // ISO string for easier serialization
}

// Content structures
export interface FlashcardItem {
  front: string;
  back: string;
  sm2: SM2Data;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
  sm2: SM2Data;
}

export interface FillBlankItem {
  sentence: string; // The sentence with a blank (represented by underscores)
  answer: string;   // The word that fills the blank
  sm2: SM2Data;
}

export interface SpotErrorItem {
  text: string;       // The sentence containing an error
  error: string;      // Explanation of the error
  correction: string; // The corrected sentence
  sm2: SM2Data;
}

export interface CaseStudyItem {
  scenario: string;
  question: string;
  analysis: string;
  sm2: SM2Data;
}

export interface KnowledgeNode {
  id: string;
  title: string;
  type: LearningMethod;
  status: 'new' | 'learning' | 'mastered';
  tags?: string[]; // Smart clustering tags
  x: number; // Coordinate for graph (percentage or relative)
  y: number; // Coordinate for graph (percentage or relative)
  sourceUrl?: string;
  imageUrl?: string; // AI Generated Cover Image
  timestamp: Date;
  
  // Manual connections created by user (Graph View feature)
  connectedNodeIds?: string[];

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
