"use client";

import { IndicTransliterate } from "@ai4bharat/indic-transliterate";

interface NepaliInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  "aria-invalid"?: boolean;
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
  const inputClassName =
    className ??
    (multiline
      ? "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
      : "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive");

  return (
    <IndicTransliterate
      value={value}
      onChangeText={onChange}
      lang="ne"
      maxOptions={5}
      showCurrentWordAsLastSuggestion
      renderComponent={(props) =>
        multiline ? (
          <textarea
            {...props}
            rows={rows}
            className={inputClassName}
            placeholder={placeholder}
            aria-invalid={ariaInvalid}
          />
        ) : (
          <input
            {...props}
            type="text"
            className={inputClassName}
            placeholder={placeholder}
            aria-invalid={ariaInvalid}
          />
        )
      }
    />
  );
}
