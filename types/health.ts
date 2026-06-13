export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface HealthProfile {
  name: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  weight: string; // in kg
  height: string; // in cm
  gender: string;
}
