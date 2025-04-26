
export interface CodeReviewFeedback {
  type: 'error' | 'suggestion' | 'optimization' | 'style';
  message: string;
  line?: number;
  code?: string;
}

export interface CodeSubmission {
  code: string;
  language: string;
  problemStatement?: string;
  reviewType: 'dsa' | 'general';
  timestamp: number;
  review?: CodeReviewFeedback[];
}
