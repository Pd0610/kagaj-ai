import { Font } from "@react-pdf/renderer";

const FONT_BASE = "/fonts";

Font.register({
  family: "Mukta",
  fonts: [
    { src: `${FONT_BASE}/Mukta-Regular.ttf`, fontWeight: 400 },
    { src: `${FONT_BASE}/Mukta-Bold.ttf`, fontWeight: 700 },
  ],
});

// Disable hyphenation — critical for Devanagari text
Font.registerHyphenationCallback((word) => [word]);
