"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, Send, Image as ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { useStore } from "@/lib/store";
import { queuePrompt, createWebSocket, getImageUrl, workflowTemplate } from "@/lib/comfy";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTagAutocomplete } from "@/hooks/useTagAutocomplete";
import { TagSuggestions } from "@/components/TagSuggestions";

export function Generator() {
  const serverUrl = useStore((state) => state.serverUrl);
  const clientId = useStore((state) => state.clientId);
  const prompt = useStore((state) => state.prompt);
  const setPrompt = useStore((state) => state.setPrompt);
  const isGenerating = useStore((state) => state.isGenerating);
  const setIsGenerating = useStore((state) => state.setIsGenerating);
  const progress = useStore((state) => state.progress);
  const setProgress = useStore((state) => state.setProgress);
  const addToGallery = useStore((state) => state.addToGallery);
  const currentImage = useStore((state) => state.currentImage);
  const setCurrentImage = useStore((state) => state.setCurrentImage);
  const selectedModel = useStore((state) => state.selectedModel);
  const customWorkflow = useStore((state) => state.workflow);
  const promptNodeId = useStore((state) => state.promptNodeId);
  const modelNodeId = useStore((state) => state.modelNodeId);
  const seedNodeId = useStore((state) => state.seedNodeId);

  const { suggestions, isLoading, updateActiveWord, insertTag } = useTagAutocomplete();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [prompt]);

  const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    updateActiveWord(target.value, target.selectionStart);
  };

  const handleTagSelect = (tag: any) => {
    const { text, newCursorPosition } = insertTag(tag);
    setPrompt(text);
    updateActiveWord(text, newCursorPosition);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }
  };

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for values used in the WebSocket callback to avoid reconnection on every change
  const stateRef = useRef({
    customWorkflow,
    prompt,
    selectedModel,
    promptNodeId,
    modelNodeId,
    serverUrl
  });

  useEffect(() => {
    stateRef.current = {
      customWorkflow,
      prompt,
      selectedModel,
      promptNodeId,
      modelNodeId,
      serverUrl
    };
  }, [customWorkflow, prompt, selectedModel, promptNodeId, modelNodeId, serverUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = createWebSocket(serverUrl, clientId, (data) => {
      console.log("WS Message:", data);
      
      if (data.type === "progress") {
        const p = (data.data.value / data.data.max) * 100;
        setProgress(p);
      }
      
      if (data.type === "executing" && data.data.node === null) {
        setIsGenerating(false);
        setProgress(0);
      }

      if (data.type === "executed") {
        if (data.data.output.images) {
          const img = data.data.output.images[0];
          const url = getImageUrl(stateRef.current.serverUrl, img.filename, img.subfolder, img.type);
          
          const finalWorkflow = JSON.parse(JSON.stringify(stateRef.current.customWorkflow || workflowTemplate));
          if (finalWorkflow[stateRef.current.promptNodeId]) {
            finalWorkflow[stateRef.current.promptNodeId].inputs.text = stateRef.current.prompt;
          }
          if (finalWorkflow[stateRef.current.modelNodeId]) {
            finalWorkflow[stateRef.current.modelNodeId].inputs.ckpt_name = stateRef.current.selectedModel;
          }

          addToGallery({
            id: uuidv4(),
            url,
            prompt: stateRef.current.prompt,
            timestamp: Date.now(),
            workflow: finalWorkflow
          });

          setCurrentImage(url);
          setIsGenerating(false);
          setProgress(0);
        }
      }
    });

    socket.onerror = () => setError("WebSocket connection failed. Check Server URL.");
    socket.onopen = () => setError(null);
    
    setWs(socket);

    return () => socket.close();
  }, [serverUrl, clientId]);

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setError(null);
    setIsGenerating(true);
    setProgress(0);

    try {
      await queuePrompt(serverUrl, clientId, prompt, selectedModel, customWorkflow, {
        promptNodeId,
        modelNodeId,
        seedNodeId
      });
    } catch (err) {
      setError("Failed to queue prompt. Is ComfyUI running?");
      setIsGenerating(false);
    }
  };


  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative">
      {/* Immersive Background / Image Area */}
      <div className="absolute inset-0 z-0 bg-background/50">
        <AnimatePresence mode="wait">
          {currentImage ? (
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Blurred background for atmosphere */}
              <div
                className="absolute inset-0 opacity-30 blur-[100px] scale-110"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              {/* Main Image - Centered and contained */}
              <div className="absolute inset-0 flex items-center justify-center pb-48 lg:pb-32 pt-12 lg:pt-20 px-4">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={currentImage}
                  alt="Generated"
                  className="w-full h-full object-contain max-h-[75vh] lg:max-h-[85vh] drop-shadow-2xl rounded-lg"
                />
              </div>

            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-foreground/10">
              <ImageIcon size={120} strokeWidth={0.5} />
            </div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8">
            <Loader2 className="text-accent animate-spin mb-6" size={64} />
            <div className="flex flex-col items-center gap-2">
              <p className="font-display text-3xl font-bold uppercase italic tracking-tighter text-accent">
                Creating
              </p>
              <p className="text-sm font-medium tracking-widest text-white/50">{Math.round(progress)}%</p>
            </div>
            <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
              <motion.div
                className="h-full bg-accent shadow-[0_0_20px_var(--color-accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* HUD Controls Overlay */}
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[100dvh] pointer-events-none">
        
        {/* Top Bar */}
        <div className="p-6 lg:p-10 pointer-events-auto flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pt-[calc(1.5rem+env(safe-area-inset-top))]">
          <div>
            <h1 className="font-display text-2xl lg:text-5xl font-bold tracking-tighter uppercase italic text-accent/80">
              Generate
            </h1>
          </div>
          {/* Status Indicator or Mini Settings could go here */}
        </div>

        {/* Bottom Controls */}
        <div className="pointer-events-auto p-4 lg:p-10 pb-[calc(7.5rem+env(safe-area-inset-bottom))] lg:pb-12 pt-12 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex flex-col gap-3 max-w-xl lg:max-w-4xl mx-auto w-full">
            
            <div className="relative group">

              <div className="absolute bottom-full left-0 w-full mb-4 z-50">
                <TagSuggestions 
                  suggestions={suggestions} 
                  isLoading={isLoading} 
                  onSelect={handleTagSelect} 
                  className="bottom-0"
                />
              </div>
              <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-xl group-focus-within:bg-accent/10 transition-colors" />
              <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-colors duration-300 focus-within:bg-white/10 focus-within:border-white/20">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    handleInput(e);
                  }}
                  onSelect={handleInput}
                  onClick={handleInput}
                  onKeyUp={handleInput}
                  placeholder="Describe your imagination..."
                  className="flex-1 bg-transparent border-none text-base font-medium text-white placeholder:text-white/20 focus:ring-0 resize-none min-h-[56px] max-h-[160px] py-4 px-3 overflow-y-auto no-scrollbar leading-tight"
                  rows={1}
                />
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center transition-all shrink-0 mb-1",
                    isGenerating || !prompt.trim()
                      ? "bg-white/5 text-white/20 cursor-not-allowed"
                      : "bg-accent text-black hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                  )}
                >
                  {isGenerating ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} className={cn("rotate-[-45deg] ml-1", prompt.trim() && "animate-pulse")} />
                  )}
                </button>
              </div>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs font-bold uppercase tracking-wide text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
