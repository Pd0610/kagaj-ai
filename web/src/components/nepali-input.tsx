"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface NepaliInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  "aria-invalid"?: boolean;
}

interface Suggestion {
  word: string;
  options: string[];
  top: number;
  left: number;
}

async function fetchSuggestions(word: string): Promise<string[]> {
  if (!word || word.length < 1) return [];
  try {
    const res = await fetch(
      `/api/transliterate?text=${encodeURIComponent(word)}`,
    );
    return (await res.json()) as string[];
  } catch {
    return [];
  }
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
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const inputClassName =
    className ??
    (multiline
      ? "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
      : "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive");

  const getLastWord = useCallback((text: string) => {
    const parts = text.split(/\s/);
    return parts[parts.length - 1] ?? "";
  }, []);

  const getInputPosition = useCallback(() => {
    const el = inputRef.current;
    if (!el) return { top: 0, left: 0 };
    const rect = el.getBoundingClientRect();
    return { top: rect.bottom + 4, left: rect.left };
  }, []);

  const commitSuggestion = useCallback(
    (selected: string) => {
      const parts = value.split(/\s/);
      parts[parts.length - 1] = selected;
      const newValue = parts.join(" ");
      onChange(newValue);
      setSuggestion(null);
      setActiveIndex(0);
    },
    [value, onChange],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      const lastWord = getLastWord(newValue);

      if (lastWord && /^[a-zA-Z]+$/.test(lastWord)) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          const options = await fetchSuggestions(lastWord);
          if (options.length > 0) {
            const pos = getInputPosition();
            setSuggestion({ word: lastWord, options, ...pos });
            setActiveIndex(0);
          } else {
            setSuggestion(null);
          }
        }, 150);
      } else {
        setSuggestion(null);
      }
    },
    [onChange, getLastWord, getInputPosition],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!suggestion) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestion.options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (suggestion.options.length > 0) {
          e.preventDefault();
          commitSuggestion(suggestion.options[activeIndex] ?? suggestion.options[0]!);
        }
      } else if (e.key === "Escape") {
        setSuggestion(null);
      } else if (e.key === " ") {
        if (suggestion.options.length > 0) {
          e.preventDefault();
          commitSuggestion(
            (suggestion.options[activeIndex] ?? suggestion.options[0]!) + " ",
          );
        }
      }
    },
    [suggestion, activeIndex, commitSuggestion],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSuggestion(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={rows}
          className={inputClassName}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={inputClassName}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
        />
      )}

      {suggestion && suggestion.options.length > 0 && (
        <ul
          className="fixed z-[9999] max-h-60 w-auto min-w-[180px] overflow-auto rounded-md border bg-white py-1 shadow-lg"
          role="listbox"
          style={{ top: suggestion.top, left: suggestion.left }}
        >
          {suggestion.options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-3 py-1.5 text-sm ${
                index === activeIndex
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                commitSuggestion(option);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
