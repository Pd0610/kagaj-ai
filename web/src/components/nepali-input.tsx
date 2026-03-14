"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GOOGLE_INPUT_TOOLS_URL =
  "https://inputtools.google.com/request?text={TEXT}&itc=ne-t-i0-und&num=5&cp=0&cs=1&ie=utf-8&app=demopage";

interface NepaliInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  "aria-invalid"?: boolean;
}

const inputClassName =
  "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

const textareaClassName =
  "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

async function fetchSuggestions(word: string): Promise<string[]> {
  if (!word.trim()) return [];
  try {
    const url = GOOGLE_INPUT_TOOLS_URL.replace("{TEXT}", encodeURIComponent(word));
    const res = await fetch(url);
    const data = await res.json();
    if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]) {
      return data[1][0][1] as string[];
    }
  } catch {
    // ignore
  }
  return [];
}

export function NepaliInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  className,
  "aria-invalid": ariaInvalid,
}: NepaliInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [wordStart, setWordStart] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeSuggestions = useCallback(() => {
    setSuggestions([]);
    setCurrentWord("");
    setActiveIndex(0);
  }, []);

  // Fetch suggestions when current word changes
  useEffect(() => {
    if (!currentWord) {
      setSuggestions([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchSuggestions(currentWord);
      setSuggestions(results);
      setActiveIndex(0);
    }, 150);

    return () => clearTimeout(debounceRef.current);
  }, [currentWord]);

  const applySuggestion = useCallback(
    (suggestion: string) => {
      const before = value.slice(0, wordStart);
      const after = value.slice(wordStart + currentWord.length);
      onChange(before + suggestion + after);
      closeSuggestions();
    },
    [value, wordStart, currentWord, onChange, closeSuggestions],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      const cursorPos = e.target.selectionStart ?? newValue.length;
      // Extract the word being typed at cursor position
      const textBeforeCursor = newValue.slice(0, cursorPos);
      const match = textBeforeCursor.match(/[a-zA-Z]+$/);

      if (match) {
        setCurrentWord(match[0]);
        setWordStart(cursorPos - match[0].length);
      } else {
        closeSuggestions();
      }
    },
    [onChange, closeSuggestions],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (suggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (suggestions[activeIndex]) {
          e.preventDefault();
          applySuggestion(suggestions[activeIndex]);
        }
      } else if (e.key === "Escape") {
        closeSuggestions();
      } else if (e.key === " ") {
        // On space, auto-apply the first suggestion
        if (suggestions[activeIndex]) {
          e.preventDefault();
          const before = value.slice(0, wordStart);
          const after = value.slice(wordStart + currentWord.length);
          onChange(before + suggestions[activeIndex] + " " + after);
          closeSuggestions();
        }
      }
    },
    [suggestions, activeIndex, applySuggestion, closeSuggestions, value, wordStart, currentWord, onChange],
  );

  const sharedProps = {
    ref: inputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>,
    value,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onBlur: () => {
      // Delay to allow click on suggestion
      setTimeout(closeSuggestions, 200);
    },
    placeholder,
    "aria-invalid": ariaInvalid,
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          {...sharedProps}
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          className={className ?? textareaClassName}
        />
      ) : (
        <input
          {...sharedProps}
          ref={inputRef as React.Ref<HTMLInputElement>}
          type="text"
          className={className ?? inputClassName}
        />
      )}

      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-lg border bg-popover shadow-md"
        >
          {suggestions.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applySuggestion(s);
              }}
              className={`block w-full px-3 py-1.5 text-left text-sm transition-colors ${
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
