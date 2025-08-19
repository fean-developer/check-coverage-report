import { CoverageElement, CoverageResult } from '../interfaces/coverage-result';

// Parse Cobertura XML (already parsed to JSON by fast-xml-parser)
export function parseCobertura(doc: any): CoverageResult {
  const root = doc.coverage;
  if (!root) throw new Error('Invalid Cobertura report');

  const packages = root.packages?.package ? (Array.isArray(root.packages.package) ? root.packages.package : [root.packages.package]) : [];
  const elements: CoverageElement[] = [];

  const toInt = (v: any) => parseInt(String(v || 0), 10);
  const toFloat = (v: any) => parseFloat(String(v || 0));

  let totals = {
    missedInstructions: 0,
    coveredInstructions: 0,
    missedBranches: 0,
    coveredBranches: 0,
    missedLines: 0,
    coveredLines: 0,
    missedMethods: 0,
    coveredMethods: 0,
    missedClasses: 0,
    coveredClasses: 0,
  };

  for (const pkg of packages) {
    const classes = pkg.classes?.class ? (Array.isArray(pkg.classes.class) ? pkg.classes.class : [pkg.classes.class]) : [];

    // Aggregate per package
    let pkgAgg = { ...totals };
    let methodMissed = 0, methodCovered = 0;
    let classCount = classes.length;

    for (const cls of classes) {
      const lines = cls.lines?.line ? (Array.isArray(cls.lines.line) ? cls.lines.line : [cls.lines.line]) : [];
      let missedLines = 0, coveredLines = 0;
      let missedBranches = 0, coveredBranches = 0;

      for (const line of lines) {
        const hits = toInt(line['@_hits']);
        if (hits > 0) coveredLines++; else missedLines++;
        if (line['@_branch'] === 'true' && line.conditions?.condition) {
          const conds = Array.isArray(line.conditions.condition) ? line.conditions.condition : [line.conditions.condition];
          for (const c of conds) {
            const cov = toFloat(c['@_coverage']); // e.g., 50% format
            if (cov > 0) coveredBranches++; else missedBranches++;
          }
        }
      }

      pkgAgg.missedLines += missedLines;
      pkgAgg.coveredLines += coveredLines;
      pkgAgg.missedBranches += missedBranches;
      pkgAgg.coveredBranches += coveredBranches;

      // Cobertura doesn't provide instruction counters explicitly per class
      methodCovered += (cls.methods?.method ? (Array.isArray(cls.methods.method) ? cls.methods.method.length : 1) : 0);
    }

    pkgAgg.missedClasses += classCount === 0 ? 0 : 0; // not precise, placeholder
    pkgAgg.coveredClasses += classCount;
    pkgAgg.coveredMethods += methodCovered;

    elements.push({
      name: pkg['@_name'] || '(root)',
      ...pkgAgg,
      instructionCoverage: pct(pkgAgg.coveredInstructions, pkgAgg.missedInstructions),
      branchCoverage: pct(pkgAgg.coveredBranches, pkgAgg.missedBranches),
      lineCoverage: pct(pkgAgg.coveredLines, pkgAgg.missedLines),
    });

    // Add to totals
    totals.missedInstructions += pkgAgg.missedInstructions;
    totals.coveredInstructions += pkgAgg.coveredInstructions;
    totals.missedBranches += pkgAgg.missedBranches;
    totals.coveredBranches += pkgAgg.coveredBranches;
    totals.missedLines += pkgAgg.missedLines;
    totals.coveredLines += pkgAgg.coveredLines;
    totals.missedMethods += pkgAgg.missedMethods;
    totals.coveredMethods += pkgAgg.coveredMethods;
    totals.missedClasses += pkgAgg.missedClasses;
    totals.coveredClasses += pkgAgg.coveredClasses;
  }

  return {
    elements,
    totalMissedInstructions: totals.missedInstructions,
    totalCoveredInstructions: totals.coveredInstructions,
    totalMissedBranches: totals.missedBranches,
    totalCoveredBranches: totals.coveredBranches,
    totalMissedLines: totals.missedLines,
    totalCoveredLines: totals.coveredLines,
    totalMissedMethods: totals.missedMethods,
    totalCoveredMethods: totals.coveredMethods,
    totalMissedClasses: totals.missedClasses,
    totalCoveredClasses: totals.coveredClasses,
    lineCoverage: pct(totals.coveredLines, totals.missedLines),
    branchCoverage: pct(totals.coveredBranches, totals.missedBranches),
  };
}

function pct(c: number, m: number) { const d = c + m; return d > 0 ? (c / d) * 100 : 0; }
