import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Custom IndexedDB storage for large datasets
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('ComfyPhoneDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('storage');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('storage', 'readonly');
        const store = tx.objectStore('storage');
        const getRequest = store.get(name);
        getRequest.onsuccess = () => resolve(getRequest.result || null);
        getRequest.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('ComfyPhoneDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('storage');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('storage', 'readwrite');
        const store = tx.objectStore('storage');
        store.put(value, name);
        tx.oncomplete = () => resolve();
      };
    });
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('ComfyPhoneDB', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('storage', 'readwrite');
        const store = tx.objectStore('storage');
        store.delete(name);
        tx.oncomplete = () => resolve();
      };
    });
  },
};

export interface GalleryImage {

  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  workflow: any;
}

export interface PromptHistoryItem {
  id: string;
  text: string;
  timestamp: number;
}

interface AppState {
  serverUrl: string;
  clientId: string;
  prompt: string;
  isGenerating: boolean;
  progress: number;
  gallery: GalleryImage[];
  promptHistory: PromptHistoryItem[];
  currentImage: string | null;
  models: string[];
  selectedModel: string;
  samplers: string[];
  selectedSampler: string;
  schedulers: string[];
  selectedScheduler: string;
  queueSize: number;
  workflow: any;
  promptNodeId: string;
  negativePromptNodeId: string;
  seedNodeId: string;
  modelNodeId: string;
  
  setServerUrl: (url: string) => void;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setProgress: (progress: number) => void;
  addToGallery: (image: GalleryImage) => void;
  setGallery: (gallery: GalleryImage[]) => void;
  setPromptHistory: (history: PromptHistoryItem[]) => void;
  addPromptToHistory: (prompt: PromptHistoryItem) => void;
  setCurrentImage: (url: string | null) => void;
  setModels: (models: string[]) => void;
  setSelectedModel: (model: string) => void;
  setSamplers: (samplers: string[]) => void;
  setSelectedSampler: (sampler: string) => void;
  setSchedulers: (schedulers: string[]) => void;
  setSelectedScheduler: (scheduler: string) => void;
  setQueueSize: (size: number) => void;
  setWorkflow: (workflow: any) => void;
  setPromptNodeId: (id: string) => void;
  setNegativePromptNodeId: (id: string) => void;
  setSeedNodeId: (id: string) => void;
  setModelNodeId: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      serverUrl: 'http://127.0.0.1:8188',
      clientId: typeof window !== 'undefined' ? uuidv4() : '',
      prompt: '1girl, masterpiece, best quality',
      isGenerating: false,
      progress: 0,
      gallery: [],
      promptHistory: [],
      currentImage: null,
      models: [],
      selectedModel: 'novaAnimeXL_ilV140.safetensors',
      samplers: [],
      selectedSampler: 'euler_ancestral',
      schedulers: [],
      selectedScheduler: 'beta',
      queueSize: 1,
      workflow: null,
      promptNodeId: "6",
      negativePromptNodeId: "7",
      seedNodeId: "15",
      modelNodeId: "4",

      setServerUrl: (url) => set({ serverUrl: url }),
      setPrompt: (prompt) => set({ prompt }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setProgress: (progress) => set({ progress }),
      addToGallery: (image) => set((state) => {
        // Sync with server
        if (typeof window !== 'undefined') {
          fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(image),
          });
        }
        return {
          gallery: [image, ...state.gallery],
          currentImage: image.url
        };
      }),
      setGallery: (gallery) => set({ gallery }),
      setPromptHistory: (promptHistory) => set({ promptHistory }),
      addPromptToHistory: (item) => set((state) => {
        const exists = state.promptHistory.some(p => p.text === item.text);
        if (exists) return state;
        return { promptHistory: [item, ...state.promptHistory] };
      }),
      setCurrentImage: (url) => set({ currentImage: url }),
      setModels: (models) => set({ models }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setSamplers: (samplers) => set({ samplers }),
      setSelectedSampler: (selectedSampler) => set({ selectedSampler }),
      setSchedulers: (schedulers) => set({ schedulers }),
      setSelectedScheduler: (selectedScheduler) => set({ selectedScheduler }),
      setQueueSize: (queueSize) => set({ queueSize }),
      setWorkflow: (workflow) => set({ workflow }),
      setPromptNodeId: (promptNodeId) => set({ promptNodeId }),
      setNegativePromptNodeId: (negativePromptNodeId) => set({ negativePromptNodeId }),
      setSeedNodeId: (seedNodeId) => set({ seedNodeId }),
      setModelNodeId: (modelNodeId) => set({ modelNodeId }),
    }),
    {
      name: 'comfy-phone-storage',
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ 
        serverUrl: state.serverUrl, 
        gallery: state.gallery,
        promptHistory: state.promptHistory,
        prompt: state.prompt,
        selectedModel: state.selectedModel,
        selectedSampler: state.selectedSampler,
        selectedScheduler: state.selectedScheduler,
        queueSize: state.queueSize,
        workflow: state.workflow,
        promptNodeId: state.promptNodeId,
        negativePromptNodeId: state.negativePromptNodeId,
        seedNodeId: state.seedNodeId,
        modelNodeId: state.modelNodeId,
      }),
    }
  )
);

