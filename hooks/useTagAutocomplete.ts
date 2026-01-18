import { useState, useEffect } from 'react';
import { Tag } from '@/lib/tags';

export function useTagAutocomplete() {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWord, setActiveWord] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [textValue, setTextValue] = useState('');

  // Update active word based on text and cursor
  const updateActiveWord = (text: string, cursor: number) => {
    setTextValue(text);
    setCursorPosition(cursor);
    
    // Find word boundaries
    // Look backwards from cursor
    let start = cursor;
    while (start > 0 && !/[\s,]/.test(text[start - 1])) {
      start--;
    }
    
    // Look forwards from cursor to capture the rest of the word being typed/edited
    let end = cursor;
    while (end < text.length && !/[\s,]/.test(text[end])) {
      end++;
    }
    
    const word = text.substring(start, end);
    setActiveWord(word);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      // Only fetch if > 2 characters
      if (activeWord.length > 2) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/tags?q=${encodeURIComponent(activeWord)}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.tags || []);
          } else {
            setSuggestions([]);
          }
        } catch (e) {
          console.error("Tag fetch error:", e);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [activeWord]);

  const insertTag = (tag: Tag) => {
    // Re-calculate boundaries to replace the current active word
    let start = cursorPosition;
    while (start > 0 && !/[\s,]/.test(textValue[start - 1])) {
      start--;
    }
    let end = cursorPosition;
    while (end < textValue.length && !/[\s,]/.test(textValue[end])) {
      end++;
    }
    
    const before = textValue.substring(0, start);
    const after = textValue.substring(end);
    
    // Add space after tag if it's not at the very end or doesn't already have one
    const spacer = after.startsWith(' ') ? '' : ' ';
    
    const newText = `${before}${tag.name}${spacer}${after}`;
    const newCursorPosition = before.length + tag.name.length + spacer.length;

    return { text: newText, newCursorPosition };
  };

  return {
    suggestions,
    isLoading,
    updateActiveWord,
    insertTag,
    activeWord,
    hasSuggestions: suggestions.length > 0
  };
}
