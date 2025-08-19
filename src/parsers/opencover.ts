import { CoverageElement, CoverageResult } from '../interfaces/coverage-result';

// Parse OpenCover (already parsed by fast-xml-parser)
export function parseOpenCover(doc: any): CoverageResult {
  const root = doc.CoverageSession;
  if (!root) throw new Error('Invalid OpenCover report');

  const modules = root.Modules?.Module ? (Array.isArray(root.Modules.Module) ? root.Modules.Module : [root.Modules.Module]) : [];
  const elements: CoverageElement[] = [];

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

  const toInt = (v: any) => parseInt(String(v || 0), 10);

  for (const mod of modules) {
    const summary = mod.Summary || {};
    const c = {
      missedInstructions: toInt(summary['@_numSequencePoints']) - toInt(summary['@_visitedSequencePoints']),
      coveredInstructions: toInt(summary['@_visitedSequencePoints']),
      missedBranches: toInt(summary['@_numBranchPoints']) - toInt(summary['@_visitedBranchPoints']),
      coveredBranches: toInt(summary['@_visitedBranchPoints']),
      missedLines: toInt(summary['@_numSequencePoints']) - toInt(summary['@_visitedSequencePoints']),
      coveredLines: toInt(summary['@_visitedSequencePoints']),
      missedMethods: toInt(summary['@_numMethods']) - toInt(summary['@_visitedMethods']),
      coveredMethods: toInt(summary['@_visitedMethods']),
      missedClasses: toInt(summary['@_numClasses']) - toInt(summary['@_visitedClasses']),
      coveredClasses: toInt(summary['@_visitedClasses']),
    };

    totals.missedInstructions += c.missedInstructions;
    totals.coveredInstructions += c.coveredInstructions;
    totals.missedBranches += c.missedBranches;
    totals.coveredBranches += c.coveredBranches;
    totals.missedLines += c.missedLines;
    totals.coveredLines += c.coveredLines;
    totals.missedMethods += c.missedMethods;
    totals.coveredMethods += c.coveredMethods;
    totals.missedClasses += c.missedClasses;
    totals.coveredClasses += c.coveredClasses;

    elements.push({
      name: mod['@_moduleName'] || '(module)',
      ...c,
      instructionCoverage: pct(c.coveredInstructions, c.missedInstructions),
      branchCoverage: pct(c.coveredBranches, c.missedBranches),
      lineCoverage: pct(c.coveredLines, c.missedLines),
    });
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
