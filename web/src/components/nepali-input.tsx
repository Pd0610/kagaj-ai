"use client";

import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

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

export function NepaliInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  className,
  "aria-invalid": ariaInvalid,
}: NepaliInputProps) {
  return (
    <ReactTransliterate
      value={value}
      onChangeText={onChange}
      lang="ne"
      renderComponent={(props) =>
        multiline ? (
          <textarea
            {...props}
            rows={rows}
            className={className ?? textareaClassName}
            placeholder={placeholder}
            aria-invalid={ariaInvalid}
          />
        ) : (
          <input
            {...props}
            type="text"
            className={className ?? inputClassName}
            placeholder={placeholder}
            aria-invalid={ariaInvalid}
          />
        )
      }
    />
  );
}
