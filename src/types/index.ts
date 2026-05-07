export interface Folder {
  id?: number;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Word {
  id?: number;
  folderId: number;
  word: string;
  description: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReview?: Date;
  pronunciation?: string;
}

export interface StudySession {
  id?: number;
  folderId: number;
  date: Date;
  totalCards: number;
  knownCount: number;
  forgotCount: number;
}
