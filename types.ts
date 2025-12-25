
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface AppState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
