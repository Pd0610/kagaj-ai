import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { CompanyUserIdChangeDocument } from "./templates/company-userid-password-change";
import { BoardMeetingMinuteDocument } from "./templates/board-meeting-minute";
import { HouseRentalAgreementDocument } from "./templates/house-rental-agreement";

type PdfDocumentFactory = (
  data: Record<string, unknown>,
) => ReactElement<DocumentProps>;

const registry: Record<string, PdfDocumentFactory> = {
  "company-userid-password-change": (data) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <CompanyUserIdChangeDocument data={data as any} />
  ),
  "board-meeting-minute": (data) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <BoardMeetingMinuteDocument data={data as any} />
  ),
  "house-rental-agreement": (data) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <HouseRentalAgreementDocument data={data as any} />
  ),
};

export function getPdfDocument(
  slug: string,
  data: Record<string, unknown>,
): ReactElement<DocumentProps> | null {
  const factory = registry[slug];
  if (!factory) return null;
  return factory(data);
}

export function hasPdfTemplate(slug: string): boolean {
  return slug in registry;
}
