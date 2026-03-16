// Mirrors Laravel enums and models exactly.
// Update this file first when API changes — then fix compiler errors.

export enum Plan {
  Free = "free",
  Pro = "pro",
  Enterprise = "enterprise",
}

export const PlanLabels: Record<Plan, string> = {
  [Plan.Free]: "Free",
  [Plan.Pro]: "Pro",
  [Plan.Enterprise]: "Enterprise",
};

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  created_at: string;
  updated_at: string;
}

export enum CompanyType {
  PvtLtd = "pvt_ltd",
  PublicLtd = "public_ltd",
  Partnership = "partnership",
  SoleProprietorship = "sole_proprietorship",
  Ngo = "ngo",
  Cooperative = "cooperative",
}

export const CompanyTypeLabels: Record<CompanyType, string> = {
  [CompanyType.PvtLtd]: "Private Limited",
  [CompanyType.PublicLtd]: "Public Limited",
  [CompanyType.Partnership]: "Partnership",
  [CompanyType.SoleProprietorship]: "Sole Proprietorship",
  [CompanyType.Ngo]: "NGO",
  [CompanyType.Cooperative]: "Cooperative",
};

export interface Company {
  id: string;
  name: string;
  name_ne: string | null;
  type: CompanyType;
  registration_number: string | null;
  pan_number: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

// ── Templates ──────────────────────────────────────────

export enum TemplateCategory {
  CompanyRegistration = "company_registration",
  TaxCompliance = "tax_compliance",
  BoardResolution = "board_resolution",
  LegalAgreement = "legal_agreement",
  HrDocument = "hr_document",
  General = "general",
}

export const TemplateCategoryLabels: Record<TemplateCategory, string> = {
  [TemplateCategory.CompanyRegistration]: "Company Registration",
  [TemplateCategory.TaxCompliance]: "Tax Compliance",
  [TemplateCategory.BoardResolution]: "Board Resolution",
  [TemplateCategory.LegalAgreement]: "Legal Agreement",
  [TemplateCategory.HrDocument]: "HR Document",
  [TemplateCategory.General]: "General",
};

export interface TemplateSlot {
  name: string;
  type: "text" | "textarea" | "number" | "date" | "select";
  label: string;
  label_ne: string;
  required: boolean;
  source?: string;
  options?: string[];
}

export interface TemplateSchema {
  slots: TemplateSlot[];
}

export interface Template {
  id: string;
  name: string;
  name_ne: string | null;
  category: TemplateCategory;
  description: string | null;
  description_ne: string | null;
  is_premium: boolean;
  is_active: boolean;
  is_locked: boolean;
  latest_schema: TemplateSchema | null;
  created_at: string;
  updated_at: string;
}

// ── Documents ─────────────────────────────────────────

export interface Document {
  id: string;
  title: string;
  reference_number: string;
  template_id: string;
  template_version_id: string;
  company_id: string | null;
  slot_data: Record<string, string>;
  has_pdf: boolean;
  created_at: string;
  updated_at: string;
}
