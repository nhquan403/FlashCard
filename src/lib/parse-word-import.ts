const DELIMITERS = [' - ', '\t', ':'];

export interface ParseWordImportResult {
  pairs: Array<{ word: string; description: string }>;
  skipped: number;
  detectedDelimiter: string;
}

function countSplittable(lines: string[], delimiter: string): number {
  return lines.filter((line) => {
    const idx = line.indexOf(delimiter);
    if (idx === -1) return false;
    const left = line.slice(0, idx).trim();
    const right = line.slice(idx + delimiter.length).trim();
    return left.length > 0 && right.length > 0;
  }).length;
}

export function parseWordImport(text: string): ParseWordImportResult {
  const rawLines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  if (rawLines.length === 0) {
    return { pairs: [], skipped: 0, detectedDelimiter: DELIMITERS[0] };
  }

  // Pick delimiter that splits the most lines into 2 non-empty parts
  let bestDelimiter = DELIMITERS[0];
  let bestCount = -1;
  for (const delimiter of DELIMITERS) {
    const count = countSplittable(rawLines, delimiter);
    if (count > bestCount) {
      bestCount = count;
      bestDelimiter = delimiter;
    }
  }

  const pairs: Array<{ word: string; description: string }> = [];
  let skipped = 0;

  for (const line of rawLines) {
    const idx = line.indexOf(bestDelimiter);
    if (idx === -1) {
      skipped++;
      continue;
    }
    const word = line.slice(0, idx).trim();
    const description = line.slice(idx + bestDelimiter.length).trim();
    if (!word || !description) {
      skipped++;
      continue;
    }
    pairs.push({ word, description });
  }

  return { pairs, skipped, detectedDelimiter: bestDelimiter };
}
