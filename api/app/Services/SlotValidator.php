<?php

namespace App\Services;

use App\Models\Template;

class SlotValidator
{
    /**
     * Validate slot_data against template schema.
     *
     * @return array<string, string[]> Validation errors keyed by field
     */
    public function validate(Template $template, array $slotData): array
    {
        $schema = $template->schema;
        $slots = $schema['slots'] ?? [];
        $errors = [];

        foreach ($slots as $slot) {
            $key = $slot['key'];
            $type = $slot['type'] ?? 'text';
            $required = $slot['required'] ?? false;

            if ($type === 'repeatable') {
                $this->validateRepeatable($slot, $slotData[$key] ?? null, $errors);

                continue;
            }

            $value = $slotData[$key] ?? null;

            if ($required && ($value === null || $value === '')) {
                $label = $slot['label_en'] ?? $key;
                $errors[$key][] = "{$label} is required.";

                continue;
            }

            if ($value !== null && $value !== '') {
                $this->validateType($slot, $value, $errors);
            }
        }

        return $errors;
    }

    private function validateRepeatable(array $slot, mixed $value, array &$errors): void
    {
        $key = $slot['key'];
        $label = $slot['label_en'] ?? $key;
        $required = $slot['required'] ?? false;
        $minItems = $slot['min_items'] ?? 0;
        $maxItems = $slot['max_items'] ?? PHP_INT_MAX;

        if (! is_array($value) || empty($value)) {
            if ($required) {
                $errors[$key][] = "{$label} is required.";
            }

            return;
        }

        $count = count($value);

        if ($count < $minItems) {
            $errors[$key][] = "{$label} must have at least {$minItems} items.";
        }

        if ($count > $maxItems) {
            $errors[$key][] = "{$label} must have at most {$maxItems} items.";
        }

        $nestedFields = $slot['fields'] ?? [];

        foreach ($value as $index => $item) {
            if (! is_array($item)) {
                $errors["{$key}.{$index}"][] = "Item must be an object.";

                continue;
            }

            foreach ($nestedFields as $field) {
                $fieldKey = $field['key'];
                $fieldRequired = $field['required'] ?? false;
                $fieldValue = $item[$fieldKey] ?? null;
                $fieldLabel = $field['label_en'] ?? $fieldKey;

                if ($fieldRequired && ($fieldValue === null || $fieldValue === '')) {
                    $errors["{$key}.{$index}.{$fieldKey}"][] = "{$fieldLabel} is required.";
                }
            }
        }
    }

    private function validateType(array $slot, mixed $value, array &$errors): void
    {
        $key = $slot['key'];
        $label = $slot['label_en'] ?? $key;
        $type = $slot['type'] ?? 'text';

        match ($type) {
            'email' => filter_var($value, FILTER_VALIDATE_EMAIL) === false
                ? $errors[$key][] = "{$label} must be a valid email address."
                : null,
            'phone' => ! preg_match('/^[0-9+\-\s()]{7,20}$/', (string) $value)
                ? $errors[$key][] = "{$label} must be a valid phone number."
                : null,
            'number', 'currency' => ! is_numeric($value)
                ? $errors[$key][] = "{$label} must be a number."
                : null,
            default => null,
        };
    }
}
