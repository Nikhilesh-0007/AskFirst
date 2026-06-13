import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatThread, HealthProfile, Message } from "../types/health";

interface HealthState {
  threads: ChatThread[];
  activeThreadId: string | null;
  healthProfile: HealthProfile;
  isTyping: boolean;

  newThread: () => string;
  selectThread: (id: string | null) => void;
  deleteThread: (id: string) => void;
  sendMessage: (text: string) => void;
  updateProfile: (profile: Partial<HealthProfile>) => void;
}

const initialProfile: HealthProfile = {
  name: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  weight: "",
  height: "",
  gender: "",
};

const getAIResponse = (userText: string): string => {
  const query = userText.toLowerCase();
  if (query.includes("headache") || query.includes("migraine")) {
    return "Headaches can be caused by tension, dehydration, stress, or eye strain. Be sure to drink water and rest in a quiet, dark room. If it is accompanied by fever, stiff neck, or confusion, please seek immediate medical care.";
  }
  if (query.includes("fever") || query.includes("temperature")) {
    return "A fever is usually a sign that your body is fighting off an infection. Stay hydrated, rest, and monitor your temperature. Contact a doctor if it stays above 103°F (39.4°C) or lasts more than 3 days.";
  }
  if (query.includes("cough") || query.includes("cold") || query.includes("flu")) {
    return "Coughs and colds are common respiratory symptoms. Hydration, honey (for adults), and steam inhalation can help. If you experience shortness of breath or persistent chest pain, please consult a medical professional.";
  }
  if (query.includes("diet") || query.includes("nutrition") || query.includes("eat")) {
    return "A balanced diet rich in whole foods, vegetables, lean proteins, and fiber supports overall health. Remember to stay hydrated and limit processed foods. Let me know if you have specific dietary goals!";
  }
  return "I've noted that down. As your AI health companion, I can help track symptoms, review habits, and summarize health trends. Please remember to consult a professional for medical diagnoses.";
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      threads: [],
      activeThreadId: null,
      healthProfile: initialProfile,
      isTyping: false,

      newThread: () => {
        const id = Date.now().toString();
        const initialMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "Hi, I'm Clary ✦. Your personal AI health companion. Feel free to ask me about symptoms, lab reports, nutrition, or wellness goals.",
          timestamp: Date.now(),
        };

        const newThreadObj: ChatThread = {
          id,
          title: "New Health Consultation",
          messages: [initialMessage],
          updatedAt: Date.now(),
        };

        set((state) => ({
          threads: [newThreadObj, ...state.threads],
          activeThreadId: id,
        }));
        return id;
      },

      selectThread: (id) => set({ activeThreadId: id }),

      deleteThread: (id) =>
        set((state) => {
          const nextThreads = state.threads.filter((t) => t.id !== id);
          let nextActiveId = state.activeThreadId;
          if (state.activeThreadId === id) {
            nextActiveId = nextThreads.length > 0 ? nextThreads[0].id : null;
          }
          return {
            threads: nextThreads,
            activeThreadId: nextActiveId,
          };
        }),

      sendMessage: (text) => {
        const { activeThreadId, threads } = get();
        if (!activeThreadId) return;

        const timestamp = Date.now();
        const userMsg: Message = {
          id: timestamp.toString(),
          sender: "user",
          text: text.trim(),
          timestamp,
        };

        const currentThread = threads.find((t) => t.id === activeThreadId);
        const userMessagesCount = currentThread
          ? currentThread.messages.filter((m) => m.sender === "user").length
          : 0;
        const newTitle =
          userMessagesCount === 0 && text.trim().length > 0
            ? text.trim()
            : currentThread?.title || "Health Consultation";

        set((state) => ({
          threads: state.threads.map((t) =>
            t.id === activeThreadId
              ? {
                  ...t,
                  title: newTitle,
                  messages: [...t.messages, userMsg],
                  updatedAt: Date.now(),
                }
              : t
          ),
          isTyping: true,
        }));

        setTimeout(() => {
          const aiMsg: Message = {
            id: (Date.now() + 2).toString(),
            sender: "ai",
            text: getAIResponse(text),
            timestamp: Date.now(),
          };

          set((state) => ({
            threads: state.threads.map((t) =>
              t.id === activeThreadId
                ? {
                    ...t,
                    messages: [...t.messages, aiMsg],
                    updatedAt: Date.now(),
                  }
                : t
            ),
            isTyping: false,
          }));
        }, 1500);
      },

      updateProfile: (profile) =>
        set((state) => ({
          healthProfile: {
            ...state.healthProfile,
            ...profile,
          },
        })),
    }),
    {
      name: "health-companion-store",
      partialize: (state) => ({
        threads: state.threads,
        activeThreadId: state.activeThreadId,
        healthProfile: state.healthProfile,
      }),
    }
  )
);
