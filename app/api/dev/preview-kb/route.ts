import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

async function readIfExists(p: string) {
  try {
    return await readFile(p, "utf8");
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const university = url.searchParams.get("university") || "unilag";
    const q = url.searchParams.get("q") || "";

    const kbDir = path.resolve(process.cwd(), "knowledge-base", university);
    const files = [
      "admission-requirements.txt",
      "faq.txt",
      "school-fees.txt",
      "academic-procedures.txt",
      "general-info.txt",
      "leadership.txt",
      "unilag-leadership.txt",
      "unilag-general.txt",
    ];

    const fileContents: Record<string, { found: boolean; length?: number }> = {};
    let aggregated = "";
    for (const f of files) {
      const p = path.join(kbDir, f);
      const txt = await readIfExists(p);
      fileContents[f] = { found: !!txt, length: txt ? txt.length : undefined };
      if (txt) aggregated += `--- ${f} ---\n` + txt + "\n\n";
    }

    // Very small, local concise heuristics (same ideas as the production extractor)
    const qlow = q.toLowerCase().replace(/\bteh\b/g, "the");
    let concise: string | null = null;

    // VC
    if (/\b(vc|vice\s*-?chancellor|vice\s+chancellor)\b/.test(qlow)) {
      const lead = (await readIfExists(path.join(kbDir, "unilag-leadership.txt"))) || (await readIfExists(path.join(kbDir, "leadership.txt")));
      if (lead) {
        const m = lead.match(/Vice[- ]?Chancellor[:\s\-\n]*([\s\S]{0,200})/i);
        if (m && m[1]) {
          const lines = m[1].split(/[\r\n]+/).map(s => s.trim()).filter(Boolean);
          if (lines.length > 0) concise = lines[0].replace(/^[-\s]*/, '').slice(0, 300);
        }
      }
    }

    // how many faculties — try FAQ then count 'Faculty' headings
    if (!concise && /how\s+many|number\s+of\s+facult/.test(qlow)) {
      const faq = await readIfExists(path.join(kbDir, "faq.txt"));
      if (faq) {
        const m = faq.match(/Q:\s*How\s+many[\s\S]*?A:\s*(.+)/i);
        if (m && m[1]) concise = m[1].trim();
      }
      if (!concise) {
        const lead = await readIfExists(path.join(kbDir, "unilag-leadership.txt")) || await readIfExists(path.join(kbDir, "leadership.txt")) || await readIfExists(path.join(kbDir, "unilag-general.txt"));
        if (lead) {
          const matches = Array.from(new Set((lead.match(/Faculty(?: of)?\s+[A-Z][A-Za-z '&\/]+/g) || []).map(s => s.trim())));
          if (matches.length > 0) concise = `${matches.length} faculties`;
        }
      }
    }

    // JAMB minimum
    if (!concise && /jamb|post[- ]?utme|cut-?off/.test(qlow)) {
      const faq = await readIfExists(path.join(kbDir, "faq.txt"));
      if (faq) {
        const m = faq.match(/minimum\s+JAMB\s+score[\s\S]*?A:\s*([0-9]{2,3})/i);
        if (m && m[1]) concise = `Minimum JAMB score: ${m[1]}`;
        else {
          const m2 = faq.match(/minimum\s+JAMB\s+score\s+to\s+be\s+eligible[\s\S]*?([0-9]{2,3})/i);
          if (m2 && m2[1]) concise = `Minimum JAMB score: ${m2[1]}`;
        }
      }
    }

    // As a final note, return a truncated aggregated KB for inspection (first 8k chars)
    const aggregatedPreview = aggregated ? aggregated.slice(0, 8192) : null;

    return new Response(
      JSON.stringify({
        university,
        query: q,
        concise: concise || null,
        conciseFound: !!concise,
        aggregatedPreview,
        files: fileContents,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
