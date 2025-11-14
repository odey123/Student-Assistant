import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { getUniversityById } from "@/app/config/universities";
import { readFile } from "fs/promises";
import path from "path";

async function aggregateLocalKB(universityId: string, userContent?: string) {
  const filesPriority = [
    "admission-requirements.txt",
    "faq.txt",
    "school-fees.txt",
    "academic-procedures.txt",
    "general-info.txt",
  ];
 

  const parts: string[] = [];
  const kbDir = path.resolve(process.cwd(), "knowledge-base", universityId);

  for (const fname of filesPriority) {
    try {
      const p = path.join(kbDir, fname);
      const txt = await readFile(p, "utf-8");
      // Simple relevance filter: if user asked about admission prefer admission file
      if (fname === "admission-requirements.txt" && userContent) {
        if (/admit|admission|apply|requirements/i.test(userContent)) {
          parts.push(`--- ${fname.replace('.txt','').replace(/-/g,' ')} ---\n` + txt);
          // keep adding other files too for context
          continue;
        }
      }
      parts.push(`--- ${fname.replace('.txt','').replace(/-/g,' ')} ---\n` + txt);
    } catch (e) {
      // ignore missing files
    }
  }

  if (parts.length === 0) throw new Error("No local KB files found");
  return parts.join("\n\n");
}

async function findConciseAnswer(universityId: string, userContent?: string) {
  // Improved heuristic extractor for concise answers to common short questions.
  if (!userContent) return null;
  // normalize common typos and reduce noise
  let q = userContent.toLowerCase().trim();
  q = q.replace(/\bteh\b/g, "the");
  q = q.replace(/[“”«»„”]/g, '');
  const kbDir = path.resolve(process.cwd(), "knowledge-base", universityId);

  // Helpers
  const readIfExists = async (fname: string) => {
    try {
      return await readFile(path.join(kbDir, fname), "utf-8");
    } catch (e) {
      return null;
    }
  };

  // 1) Who is the (current) Vice-Chancellor?
  if (/\b(vc|vice\s*-?chancellor|vice\s+chancellor)\b/.test(q)) {
    // Prefer structured leadership file
    const leadTxt = await readIfExists("unilag-leadership.txt") || await readIfExists("leadership.txt");
    if (leadTxt) {
      const lines = leadTxt.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
      for (let i = 0; i < lines.length; i++) {
        const L = lines[i];
        if (/^vice[- ]?chancellor[:]?/i.test(L)) {
          // look at next few lines for a name
          for (let j = i + 1; j <= i + 4 && j < lines.length; j++) {
            const candidate = lines[j];
            // common formats: "- Professor Name", "Professor Name, FAS", or just a line with a name
            // Prefer capturing full name when line is like "- Professor Folasade..."
            // Try explicit patterns in order: dashed list entry, title + name, fallback whole line
            const dashMatch = candidate.match(/^-\s*(.+)$/);
            if (dashMatch && dashMatch[1]) {
              return dashMatch[1].trim().replace(/^Q:\s*/i, '');
            }

            const titledMatch = candidate.match(/^(Professor|Prof\.?|Dr|Mr|Mrs|Ms)\s+(.+)$/i);
            if (titledMatch && titledMatch[2]) {
              // return "Professor Name..."
              return `${titledMatch[1]} ${titledMatch[2]}`.trim();
            }

            // as a last resort, return the whole candidate line if it seems informative
            if (candidate.length > 5 && candidate.length < 200) {
              return candidate.replace(/^Q:\s*/i, '').trim();
            }
            if (candidate.length > 5 && candidate.length < 120) return candidate;
          }
        }
      }
    }

    // fallback: search faq/general files for a line mentioning Vice-Chancellor
    const filesToCheck = ["faq.txt", "general-info.txt", "unilag-general.txt"];
    for (const f of filesToCheck) {
      const txt = await readIfExists(f);
      if (!txt) continue;
      const m = txt.match(/^Q:\s*Who\s+is\s+the\s+Vice[- ]?Chancellor[\s\S]*?A:\s*(.+)$/im);
      if (m && m[1]) return m[1].trim();
      const lineMatch = txt.split(/[\r\n]+/).find((ln) => /vice[- ]?chancellor/i.test(ln) && ln.length < 200);
      if (lineMatch) return lineMatch.replace(/^Q:\s*/i, '').trim();
    }
  }

  // 2) How many faculties?
  if (/\bhow\s+many\s+facult(?:y|ies)|number\s+of\s+facult(?:y|ies)\b/.test(q)) {
    const faq = await readIfExists("faq.txt") || await readIfExists("unilag-faq.txt");
    // prefer explicit answer in FAQ
    if (faq) {
      const qa = faq.match(/Q:\s*How\s+many\s+facult(?:y|ies)\s*\?[\s\S]*?A:\s*(.+)/i);
      if (qa && qa[1]) return qa[1].trim();
      const num = faq.match(/has\s+(\d{1,3})\s+facult(?:y|ies)/i) || (await readIfExists("unilag-general.txt") || "").match(/has\s+(\d{1,3})\s+facult(?:y|ies)/i);
      if (num && num[1]) return `${num[1]} faculties`;
    }

    // If not present in FAQ, extract faculty headings from leadership/general files and count them.
    const leadershipTxt = (await readIfExists("unilag-leadership.txt")) || (await readIfExists("leadership.txt")) || (await readIfExists("unilag-general.txt")) || "";
    if (leadershipTxt) {
      const facMatches = Array.from(new Set((leadershipTxt.match(/Faculty(?: of)?\s+[A-Z][A-Za-z '&\/]+/g) || []).map(s => s.trim())));
      if (facMatches.length > 0) return `${facMatches.length} faculties`;
      const lines = leadershipTxt.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
      const starts = lines.filter(l => /^Faculty(?: of)?\b/i.test(l));
      if (starts.length > 0) return `${starts.length} faculties`;
    }
  }

  // 2b) List faculties (e.g. "what are the 12 faculties" or "what are the faculties")
  if (/\bwhat\s+are\s+(the\s+)?(\d+\s+)?facult(?:y|ies)\b/.test(q) || /\blist\s+facult(?:y|ies)\b/.test(q)) {
    const leadTxt = await readIfExists("unilag-leadership.txt") || await readIfExists("leadership.txt") || await readIfExists("unilag-general.txt");
    if (leadTxt) {
      // collect 'Faculty of ...' matches
      const matches = Array.from(new Set((leadTxt.match(/Faculty(?: of)? [A-Z][A-Za-z '&\/]+/g) || []).map(m => m.trim())));
      if (matches.length > 0) return matches.join('; ');
      // fallback: try to extract lines under FACULTY DEANS header
      const lines = leadTxt.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
      const start = lines.findIndex(l => /FACULTY DEANS/i.test(l));
      if (start >= 0) {
        const collected: string[] = [];
        for (let i = start + 1; i < lines.length; i++) {
          const ln = lines[i];
          if (/^---|^INSTRUCTION|^OTHER|^COLLEGE|^$/i.test(ln)) break;
          const m = ln.match(/^(Faculty(?: of)?[\s\S]+?):?$/i);
          if (m) collected.push(m[1].replace(/:$/,'').trim());
          if (collected.length > 40) break;
        }
        if (collected.length > 0) return collected.join('; ');
      }
    }
  }

  // 3) JAMB minimum for Post-UTME
  if (/\b(jamb|post[- ]?utme|postutme|post utme|cut-?off)\b/.test(q)) {
    const faq = await readIfExists("faq.txt") || await readIfExists("unilag-faq.txt");
    if (faq) {
      const m = faq.match(/Q:[\s\S]*?minimum\s+JAMB\s+score[\s\S]*?A:\s*([\d]{2,3})/i);
      if (m && m[1]) return `Minimum JAMB score: ${m[1]}`;
      const m2 = faq.match(/A:\s*Cut-?off\s+marks\s+vary[\s\S]*?minimum\s+JAMB\s+score\s+of\s+([\d]{2,3})/i);
      if (m2 && m2[1]) return `Minimum JAMB score: ${m2[1]}`;
      // direct number mention
      const m3 = faq.match(/minimum\s+JAMB\s+score\s+to\s+be\s+eligible[\s\S]*?([\d]{2,3})/i);
      if (m3 && m3[1]) return `Minimum JAMB score: ${m3[1]}`;
    }
  }

  // General fallback: search for any short line mentioning key words from the query
  const words = q.split(/\W+/).filter(Boolean).slice(0, 6);
  const searchFiles = ["faq.txt", "general-info.txt", "leadership.txt", "unilag-leadership.txt", "academic-procedures.txt"];
  try {
    for (const fname of searchFiles) {
      const txt = await readIfExists(fname);
      if (!txt) continue;
      const lines = txt.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const low = line.toLowerCase();
        let score = 0;
        for (const w of words) if (w.length > 2 && low.includes(w)) score++;
        if (score >= Math.min(2, words.length) && line.length < 400) {
          const sent = line.split(/[.?!]\s+/)[0];
          return sent.replace(/^Q:\s*/i, '').trim();
        }
      }
    }
  } catch (e) {
    return null;
  }

  return null;
}

export const runtime = "nodejs";

// Send a new message to a thread
export async function POST(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  const { content } = await request.json();

  // Get university from query parameter
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('university') || 'unilag';

  // Get the university's assistant ID
  const university = getUniversityById(universityId);
  const selectedAssistantId = university?.assistantId || assistantId;

  if (!selectedAssistantId) {
    return new Response(
      JSON.stringify({
        error: `Assistant not configured for ${university?.name || universityId}. Please contact support.`
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await openai.beta.threads.messages.create(params.threadId, {
      role: "user",
      content: content,
    });

    // Stream response directly (optimized - removed pre-check)
    const stream = openai.beta.threads.runs.stream(params.threadId, {
      assistant_id: selectedAssistantId,
    });

    return new Response(stream.toReadableStream());
  } catch (err: any) {
    if (err?.status === 404) {
      const fallbackAssistantId = assistantId || null;
      if (fallbackAssistantId && fallbackAssistantId !== selectedAssistantId) {
        try {
          const fallbackStream = openai.beta.threads.runs.stream(params.threadId, {
            assistant_id: fallbackAssistantId,
          });
          return new Response(fallbackStream.toReadableStream());
        } catch (err2: any) {
          console.error("Fallback assistant failed:", err2);
        }
      }

      console.error("Assistant not found:", selectedAssistantId, err);
      // Try aggregated local knowledge-base fallback before failing completely
      try {
        // Try to return a concise answer for short/targeted questions first
        const concise = await findConciseAnswer(universityId, content);
        if (concise) {
          return new Response(JSON.stringify({ localResponse: concise, concise: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        const txt = await aggregateLocalKB(universityId, content);
        return new Response(JSON.stringify({ localResponse: txt }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (kbErr) {
        // If KB fallback fails, return original assistant-not-found error
        return new Response(
          JSON.stringify({
            error: `Assistant not found: ${selectedAssistantId}. Please check the assistant ID configured for ${university?.name || universityId} and ensure it exists in your OpenAI project.`,
          }),
          { status: 502, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const status = err?.status || err?.response?.status || 500;
    const errorMessage =
      err?.response?.data?.error?.message || err?.message || "Unknown error starting assistant run";

    console.error("Assistant request failed:", {
      status,
      assistant: selectedAssistantId,
      university: universityId,
      error: errorMessage,
      original: err,
    });

    // Try aggregated local knowledge-base fallback for other errors as well
    try {
      const txt = await aggregateLocalKB(universityId, content);
      return new Response(JSON.stringify({ localResponse: txt }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (kbErr) {
      return new Response(
        JSON.stringify({
          error: errorMessage,
          assistantId: selectedAssistantId,
          university: universityId,
          status,
        }),
        { status: status >= 400 ? status : 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
