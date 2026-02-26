"use client";

import { useRef, useEffect, useState, memo } from "react";
import { Send, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTagAutocomplete } from "@/hooks/useTagAutocomplete";
import { TagSuggestions } from "@/components/TagSuggestions";
import { PromptHistory } from "@/components/PromptHistory";
import { AnimatePresence } from "framer-motion";

interface GeneratorInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  promptHistory: any[];
  setPromptHistory: (history: any[]) => void;
  error: string | null;
  queueSize: number;
  setQueueSize: (size: number) => void;
}

export const GeneratorInput = memo(function GeneratorInput({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate,
  promptHistory,
  setPromptHistory,
  error,
  queueSize,
  setQueueSize
}: GeneratorInputProps) {
  const { suggestions, isLoading, updateActiveWord, insertTag } = useTagAutocomplete();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Auto-expand textarea optimization
  // Using useLayoutEffect would be ideal, but requires SSR check. 
  // We keep useEffect but optimize to avoid thrashing if height hasn't changed substantially
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      // Reset height to auto to get correct scrollHeight
      // This is the unavoidable "read-write" thrash for auto-grow textareas
      // But we can verify if it's needed
      const currentHeight = el.style.height;
      el.style.height = "auto";
      const newHeight = Math.min(el.scrollHeight, 160);
      el.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    updateActiveWord(target.value, target.selectionStart);
  };

  const handleTagSelect = (tag: any) => {
    if (textareaRef.current) {
      const { text, newCursorPosition } = insertTag(tag, prompt, textareaRef.current.selectionStart);
      setPrompt(text);
      updateActiveWord(text, newCursorPosition);
      
      textareaRef.current.focus();
      // Use setSelectionRange directly without requestAnimationFrame if possible, 
      // but React state updates might be async so RAF is safer
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      });
    }
  };

  return (
    <div className="relative z-10 flex flex-col justify-end h-full min-h-[100dvh] pointer-events-none">
      <div className="pointer-events-auto p-4 lg:p-10 pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-8 pt-12 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="flex flex-col gap-3 max-w-xl lg:max-w-4xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute bottom-full left-0 w-full mb-4 z-50">
              <AnimatePresence>
                {showHistory && (
                  <PromptHistory
                    history={promptHistory}
                    onSelect={(text) => setPrompt(text)}
                    onClose={() => setShowHistory(false)}
                  />
                )}
              </AnimatePresence>
              {!showHistory && (
                <TagSuggestions 
                  suggestions={suggestions} 
                  isLoading={isLoading} 
                  onSelect={handleTagSelect} 
                  className="bottom-0"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-xl group-focus-within:bg-accent/10 transition-colors" />
            <div className="relative flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-colors duration-300 focus-within:bg-white/10 focus-within:border-white/20">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-all shrink-0 mb-1",
                  showHistory ? "bg-accent text-black" : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                <Clock size={20} />
              </button>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  handleInput(e);
                }}
                onSelect={handleInput}
                onClick={handleInput}
                placeholder="Describe your imagination..."
                className="flex-1 bg-transparent border-none text-base font-medium text-white placeholder:text-white/20 focus:ring-0 resize-none min-h-[56px] max-h-[160px] py-4 px-3 overflow-y-auto no-scrollbar leading-tight"
                rows={1}
              />
              <button
                onClick={() => {
                  const sizes = [1, 2, 4, 8, 16, 32];
                  const currentIndex = sizes.indexOf(queueSize);
                  const nextIndex = (currentIndex + 1) % sizes.length;
                  setQueueSize(sizes[nextIndex]);
                }}
                className="h-12 min-w-12 px-2 rounded-xl flex items-center justify-center bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all shrink-0 mb-1 font-semibold text-sm"
                title="Queue Size"
              >
                {queueSize}x
              </button>
              
              <button
                onClick={onGenerate}
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
            <div className="text-red-400 text-xs font-bold uppercase tracking-wide text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-bottom-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
