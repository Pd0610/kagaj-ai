// Transliterate English text to Nepali using Google Input Tools API
// Same API that react-transliterate uses under the hood

const GOOGLE_INPUT_TOOLS_URL =
  "https://inputtools.google.com/request?text={TEXT}&itc=ne-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage";

export async function transliterateToNepali(text: string): Promise<string> {
  if (!text.trim()) return "";

  // Split into words, transliterate each
  const words = text.trim().split(/\s+/);
  const results: string[] = [];

  for (const word of words) {
    try {
      const url = GOOGLE_INPUT_TOOLS_URL.replace("{TEXT}", encodeURIComponent(word));
      const res = await fetch(url);
      const data = await res.json();

      // Response format: ["SUCCESS", [["word", ["transliteration1", ...], ...]]]
      if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]?.[0]) {
        results.push(data[1][0][1][0]);
      } else {
        results.push(word);
      }
    } catch {
      results.push(word);
    }
  }

  return results.join(" ");
}
