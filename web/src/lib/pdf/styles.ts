import { StyleSheet } from "@react-pdf/renderer";

export const baseStyles = StyleSheet.create({
  page: {
    fontFamily: "Mukta",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#000",
    paddingTop: 15,
    paddingRight: 18,
    paddingBottom: 15,
    paddingLeft: 18,
  },
  h2: {
    fontFamily: "Mukta",
    fontWeight: 700,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 6,
  },
  h3: {
    fontFamily: "Mukta",
    fontWeight: 700,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 6,
  },
  p: {
    marginBottom: 7,
    textAlign: "justify",
  },
  bold: {
    fontWeight: 700,
  },
  letterhead: {
    textAlign: "center",
    marginBottom: 14,
  },
  date: {
    textAlign: "right",
    marginBottom: 12,
  },
  addressee: {
    marginBottom: 12,
  },
  subject: {
    marginBottom: 10,
  },
  signatureBlock: {
    marginTop: 24,
    textAlign: "right",
  },
  resolutionHeader: {
    textAlign: "center",
    marginBottom: 14,
  },
  // Table styles
  table: {
    width: "100%",
    marginVertical: 12,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    border: "1px solid #000",
    padding: "6px 10px",
    flex: 1,
  },
  tableCellHeader: {
    border: "1px solid #000",
    padding: "6px 10px",
    flex: 1,
    fontWeight: 700,
  },
  // Sections
  section: {
    marginVertical: 12,
  },
  newCredentials: {
    marginVertical: 12,
    padding: 12,
    border: "1px solid #000",
  },
  ol: {
    paddingLeft: 24,
  },
  olItem: {
    marginBottom: 6,
  },
});
