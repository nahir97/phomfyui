import { useState, useEffect, useRef, useCallback } from 'react';
import { Tag } from '@/lib/tags';

export function useTagAutocomplete() {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWord, setActiveWord] = useState('');
  const [isCompletedTag, setIsCompletedTag] = useState(false);
  
  // Use a ref to track if we've already cleared suggestions to avoid re-renders
  const suggestionsClearedRef = useRef(true);

  // Update active word based on text and cursor
  // Memoize to prevent function recreation on every render
  const updateActiveWord = useCallback((text: string, cursor: number) => {
    // Find boundaries based on commas instead of spaces
    let start = cursor;
    while (start > 0 && text[start - 1] !== ',') {
      start--;
    }
    
    let end = cursor;
    while (end < text.length && text[end] !== ',') {
      end++;
    }
    
    const segment = text.substring(start, end);
    const trimmedWord = segment.trim();
    
    // Check if the word is followed by a comma (ignoring trailing whitespace in the segment)
    // If the segment ends exactly at a comma in the original text, or if the next non-whitespace is a comma
    const isCompleted = end < text.length && text[end] === ',';
    
    // Only update state if changed to avoid renders
    setActiveWord(prev => prev !== trimmedWord ? trimmedWord : prev);
    setIsCompletedTag(prev => prev !== isCompleted ? isCompleted : prev);
  }, []);

  useEffect(() => {
    // Debounce 600ms
    const handler = setTimeout(async () => {
      // Only fetch if > 2 characters and not already completed with a comma
      if (activeWord.length > 2 && !isCompletedTag) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/tags?q=${encodeURIComponent(activeWord)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.tags && data.tags.length > 0) {
              setSuggestions(data.tags);
              suggestionsClearedRef.current = false;
            } else if (!suggestionsClearedRef.current) {
              setSuggestions([]);
              suggestionsClearedRef.current = true;
            }
          } else {
            if (!suggestionsClearedRef.current) {
              setSuggestions([]);
              suggestionsClearedRef.current = true;
            }
          }
        } catch (e) {
          console.error("Tag fetch error:", e);
          if (!suggestionsClearedRef.current) {
            setSuggestions([]);
            suggestionsClearedRef.current = true;
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // Only clear if not already cleared
        if (!suggestionsClearedRef.current) {
          setSuggestions([]);
          suggestionsClearedRef.current = true;
        }
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [activeWord, isCompletedTag]);

  // Pure function that doesn't rely on internal state for text/cursor
  // This avoids the need to store textValue/cursorPosition in state
  const insertTag = useCallback((tag: Tag, currentText: string, currentCursor: number) => {
    // Re-calculate boundaries based on commas
    let start = currentCursor;
    while (start > 0 && currentText[start - 1] !== ',') {
      start--;
    }
    let end = currentCursor;
    while (end < currentText.length && currentText[end] !== ',') {
      end++;
    }
    
    // Check if there's a leading space in the segment we are replacing to preserve it if needed
    // or just ensure clean insertion with standard ", " suffix
    const before = currentText.substring(0, start);
    let after = currentText.substring(end);
    
    // If the segment had leading spaces, preserve one
    const leadingSpace = (currentText[start] === ' ') ? ' ' : '';
    
    // Determine the text to insert and where the cursor should land
    const tagToInsert = leadingSpace + tag.name;
    let suffix = ", ";
    let jumpOffset = 0;

    if (after.startsWith(", ")) {
      suffix = "";
      jumpOffset = 2; // Jump over existing ", "
    } else if (after.startsWith(",")) {
      suffix = " ";
      jumpOffset = 1; // Jump over existing "," and add the missing space
    } else if (after.startsWith(" ")) {
      suffix = ",";
      jumpOffset = 1; // Add comma and jump over existing " "
    }
    
    const newText = `${before}${tagToInsert}${suffix}${after}`;
    const newCursorPosition = before.length + tagToInsert.length + suffix.length + jumpOffset;

    return { text: newText, newCursorPosition };
  }, []);

  return {
    suggestions,
    isLoading,
    updateActiveWord,
    insertTag,
    activeWord,
    hasSuggestions: suggestions.length > 0
  };
}
