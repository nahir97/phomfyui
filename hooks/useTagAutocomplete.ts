import { useState, useEffect } from 'react';
import { Tag } from '@/lib/tags';

export function useTagAutocomplete() {
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWord, setActiveWord] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [isCompletedTag, setIsCompletedTag] = useState(false);

  // Update active word based on text and cursor
  const updateActiveWord = (text: string, cursor: number) => {
    setTextValue(text);
    setCursorPosition(cursor);
    
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
    
    setActiveWord(trimmedWord);
    setIsCompletedTag(isCompleted);
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      // Only fetch if > 2 characters and not already completed with a comma
      if (activeWord.length > 2 && !isCompletedTag) {
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
    // Re-calculate boundaries based on commas
    let start = cursorPosition;
    while (start > 0 && textValue[start - 1] !== ',') {
      start--;
    }
    let end = cursorPosition;
    while (end < textValue.length && textValue[end] !== ',') {
      end++;
    }
    
    // Check if there's a leading space in the segment we are replacing to preserve it if needed
    // or just ensure clean insertion with standard ", " suffix
    const before = textValue.substring(0, start);
    let after = textValue.substring(end);
    
    // If the segment had leading spaces, preserve one
    const leadingSpace = (textValue[start] === ' ') ? ' ' : '';
    
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
