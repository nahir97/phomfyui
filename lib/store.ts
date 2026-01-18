import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface GalleryImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  workflow: any;
}

interface AppState {
  serverUrl: string;
  clientId: string;
  prompt: string;
  isGenerating: boolean;
  progress: number;
  gallery: GalleryImage[];
  currentImage: string | null;
  models: string[];
  selectedModel: string;
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
  setCurrentImage: (url: string | null) => void;
  setModels: (models: string[]) => void;
  setSelectedModel: (model: string) => void;
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
      currentImage: null,
      models: [],
      selectedModel: 'novaAnimeXL_ilV140.safetensors',
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
      setCurrentImage: (url) => set({ currentImage: url }),
      setModels: (models) => set({ models }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      setWorkflow: (workflow) => set({ workflow }),
      setPromptNodeId: (promptNodeId) => set({ promptNodeId }),
      setNegativePromptNodeId: (negativePromptNodeId) => set({ negativePromptNodeId }),
      setSeedNodeId: (seedNodeId) => set({ seedNodeId }),
      setModelNodeId: (modelNodeId) => set({ modelNodeId }),
    }),
    {
      name: 'comfy-phone-storage',
      partialize: (state) => ({ 
        serverUrl: state.serverUrl, 
        gallery: state.gallery,
        prompt: state.prompt,
        selectedModel: state.selectedModel,
        workflow: state.workflow,
        promptNodeId: state.promptNodeId,
        negativePromptNodeId: state.negativePromptNodeId,
        seedNodeId: state.seedNodeId,
        modelNodeId: state.modelNodeId,
      }),
    }
  )
);

