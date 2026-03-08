// Mirrors Laravel enums and models

export type Language = "en" | "ne";
export type UserTier = "free" | "pro" | "business";
export type DocumentStatus = "draft" | "generating" | "completed" | "failed";
export type ConversationStatus = "active" | "completed" | "abandoned";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentType = "subscription" | "one_time";
export type PaymentProvider = "esewa" | "khalti" | "connect_ips";
export type MessageRole = "user" | "assistant" | "system";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  language_preference: Language;
  tier: UserTier;
  email_verified_at: string | null;
  created_at: string;
}

export interface Template {
  slug: string;
  name: string;
  name_ne: string;
  category: string;
  description: string | null;
  description_ne: string | null;
  price: number;
  is_free_eligible: boolean;
  version: number;
  schema?: TemplateSchema;
}

export interface TemplateSchema {
  slots: TemplateSlot[];
  groups?: SlotGroup[];
  conditionals?: Conditional[];
  computed?: ComputedSlot[];
}

export interface TemplateSlot {
  key: string;
  label_en: string;
  label_ne: string;
  type: string;
  required: boolean;
  fields?: TemplateSlot[];
  validation?: Record<string, unknown>;
}

export interface SlotGroup {
  key: string;
  label_en: string;
  order: number;
}

export interface Conditional {
  if: { slot: string; op: string; value: unknown };
  show_section: string;
}

export interface ComputedSlot {
  key: string;
  formula: string;
}

export interface Document {
  uuid: string;
  title: string;
  template_slug: string;
  status: DocumentStatus;
  language: Language;
  is_watermarked: boolean;
  slot_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  uuid: string;
  status: ConversationStatus;
  template: Template | null;
  messages: ConversationMessage[];
  filled_slots: Record<string, unknown>;
  remaining_slots: string[];
}

export interface ConversationMessage {
  role: MessageRole;
  content: string;
}

export interface Subscription {
  tier: UserTier;
  status: SubscriptionStatus;
  starts_at: string;
  ends_at: string;
  auto_renew: boolean;
}

export interface Payment {
  uuid: string;
  type: PaymentType;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface UsageStats {
  period: string;
  documents_generated: number;
  limit: number;
  remaining: number;
  tier: UserTier;
}
