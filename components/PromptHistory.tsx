"use client";

import { Clock, X, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PromptHistoryItem {
  id: string;
  text: string;
  timestamp: number;
}

interface PromptHistoryProps {
  history: PromptHistoryItem[];
  onSelect: (text: string) => void;
  onClose: () => void;
}

export function PromptHistory({ history, onSelect, onClose }: PromptHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden flex flex-col max-h-[40vh] shadow-2xl"
    >
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-accent" />
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white/70">
            Recent Prompts
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={18} className="text-white/40" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-white/20 gap-2">
            <MessageSquare size={32} strokeWidth={1} />
            <p className="text-xs font-medium italic">No history yet</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item.text);
                onClose();
              }}
              className="w-full text-left p-3 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-all group relative border border-transparent hover:border-white/5"
            >
              <p className="text-sm text-white/60 group-hover:text-white line-clamp-2 leading-snug">
                {item.text}
              </p>
              <span className="text-[10px] text-white/20 mt-1 block">
                {new Date(item.timestamp).toLocaleString([], { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}
