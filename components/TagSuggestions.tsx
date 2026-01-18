import { Tag } from "@/lib/tags";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSuggestionsProps {
  suggestions: Tag[];
  onSelect: (tag: Tag) => void;
  isLoading: boolean;
  className?: string;
}

export function TagSuggestions({ suggestions, onSelect, isLoading, className }: TagSuggestionsProps) {
  if (!suggestions.length && !isLoading) return null;

  const getTypeColor = (type: string) => {
    // Standard booru tag colors
    switch (type) {
      case 'artist': return 'text-yellow-400';
      case 'copyright': return 'text-purple-400';
      case 'character': return 'text-green-400';
      case 'metadata': return 'text-orange-400';
      case 'circle': return 'text-blue-400';
      default: return 'text-neutral-200'; // General tags
    }
  };

  return (
    <div className={cn(
      "absolute z-50 w-64 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-60 animate-in fade-in zoom-in-95 duration-100", 
      className
    )}>
      {isLoading && suggestions.length === 0 && (
        <div className="p-3 flex justify-center items-center text-white/50">
          <Loader2 className="animate-spin mr-2" size={14} />
          <span className="text-xs">Searching tags...</span>
        </div>
      )}
      
      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {suggestions.map((tag, idx) => (
          <button
            key={`${tag.name}-${idx}`}
            onClick={(e) => {
              e.preventDefault(); // Prevent focus loss if needed
              onSelect(tag);
            }}
            className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors flex justify-between items-center group border-b border-white/5 last:border-0"
          >
            <span className={cn("font-medium truncate text-sm", getTypeColor(tag.tag_type))}>
              {tag.name}
            </span>
            <span className="text-[10px] text-white/30 font-mono group-hover:text-white/50 ml-2 shrink-0">
              {tag.post_count >= 1000 ? `${(tag.post_count / 1000).toFixed(1)}k` : tag.post_count}
            </span>
          </button>
        ))}
      </div>
      
      {isLoading && suggestions.length > 0 && (
        <div className="h-1 bg-white/10 overflow-hidden w-full">
            <div className="h-full bg-accent/50 w-full animate-progress-indeterminate"></div>
        </div>
      )}
    </div>
  );
}
