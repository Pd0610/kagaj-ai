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
  group?: string;
  display_order?: number;
  default?: unknown;
  ai_hint?: string;
  min_items?: number;
  max_items?: number;
}

export interface SlotGroup {
  key: string;
  label_en: string;
  label_ne?: string;
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

export interface PdfConfig {
  margins: { top: number; right: number; bottom: number; left: number };
  page_size: "A4" | "Legal" | "Letter";
  default_font: string;
}

export interface Document {
  uuid: string;
  title: string;
  template_slug: string;
  template_name?: string;
  template_name_ne?: string;
  status: DocumentStatus;
  language: Language;
  is_watermarked: boolean;
  slot_data?: Record<string, unknown>;
  pdf_config?: PdfConfig | null;
  created_at: string;
  updated_at: string;
}

export type CompanyType =
  | "pvt_ltd"
  | "public_ltd"
  | "partnership"
  | "sole_prop"
  | "ngo"
  | "cooperative";

export type MemberRole =
  | "director"
  | "shareholder"
  | "secretary"
  | "auditor"
  | "partner"
  | "proprietor";

export interface Company {
  uuid: string;
  name_en: string;
  name_ne: string | null;
  registration_number: string | null;
  pan_number: string | null;
  vat_number: string | null;
  company_type: CompanyType;
  incorporation_date: string | null;
  district_en: string | null;
  district_ne: string | null;
  municipality_en: string | null;
  municipality_ne: string | null;
  ward: string | null;
  tole_en: string | null;
  tole_ne: string | null;
  authorized_capital: number | null;
  paid_up_capital: number | null;
  share_value: number | null;
  total_shares: number | null;
  fiscal_year_start: string | null;
  fiscal_year_end: string | null;
  sector: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_branch: string | null;
  auditor_name: string | null;
  auditor_firm: string | null;
  auditor_ican_number: string | null;
  members?: CompanyMember[];
  documents_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CompanyMember {
  uuid: string;
  role: MemberRole;
  name_en: string;
  name_ne: string | null;
  father_name_en: string | null;
  father_name_ne: string | null;
  grandfather_name_en: string | null;
  grandfather_name_ne: string | null;
  citizenship_number: string | null;
  citizenship_issued_district: string | null;
  citizenship_issued_date: string | null;
  district_en: string | null;
  district_ne: string | null;
  municipality_en: string | null;
  municipality_ne: string | null;
  ward: string | null;
  phone: string | null;
  email: string | null;
  share_count: number | null;
  share_percentage: number | null;
  appointment_date: string | null;
  resignation_date: string | null;
  is_chairperson: boolean;
  is_managing_director: boolean;
  created_at: string;
  updated_at: string;
}

export const COMPANY_TYPE_LABELS: Record<CompanyType, string> = {
  pvt_ltd: "Private Limited",
  public_ltd: "Public Limited",
  partnership: "Partnership",
  sole_prop: "Sole Proprietorship",
  ngo: "NGO",
  cooperative: "Cooperative",
};

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  director: "Director",
  shareholder: "Shareholder",
  secretary: "Secretary",
  auditor: "Auditor",
  partner: "Partner",
  proprietor: "Proprietor",
};

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
