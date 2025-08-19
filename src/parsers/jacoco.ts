import { CoverageElement, CoverageResult } from '../interfaces/coverage-result';

// Parse already-parsed JaCoCo JSON (from fast-xml-parser)
export function parseJaCoCo(doc: any): CoverageResult {
  const report = doc.report;
  if (!report) throw new Error('Invalid JaCoCo report');

  const extractCounters = (node: any) => {
    const counters = node?.counter ? (Array.isArray(node.counter) ? node.counter : [node.counter]) : [];
    const get = (type: string, attr: 'missed' | 'covered') => {
      const c = counters.find((x: any) => x['@_type'] === type);
      return c ? parseInt(c[`@_${attr}`] || '0', 10) : 0;
    };
    return {
      missedInstructions: get('INSTRUCTION', 'missed'),
      coveredInstructions: get('INSTRUCTION', 'covered'),
      missedComplexity: get('COMPLEXITY', 'missed'),
      coveredComplexity: get('COMPLEXITY', 'covered'),
      missedBranches: get('BRANCH', 'missed'),
      coveredBranches: get('BRANCH', 'covered'),
      missedLines: get('LINE', 'missed'),
      coveredLines: get('LINE', 'covered'),
      missedMethods: get('METHOD', 'missed'),
      coveredMethods: get('METHOD', 'covered'),
      missedClasses: get('CLASS', 'missed'),
      coveredClasses: get('CLASS', 'covered'),
    };
  };

  const packages = report.package ? (Array.isArray(report.package) ? report.package : [report.package]) : [];
  const elements: CoverageElement[] = [];

  for (const pkg of packages) {
    const c = extractCounters(pkg);
    elements.push({
      name: pkg['@_name'] || '(root)',
      ...c,
      instructionCoverage: sumPct(c.coveredInstructions, c.missedInstructions),
      branchCoverage: sumPct(c.coveredBranches, c.missedBranches),
      lineCoverage: sumPct(c.coveredLines, c.missedLines),
    });
  }

  const total = extractCounters(report);

  return {
    elements,
    totalMissedInstructions: total.missedInstructions,
    totalCoveredInstructions: total.coveredInstructions,
    totalMissedComplexity: total.missedComplexity,
    totalCoveredComplexity: total.coveredComplexity,
    totalMissedBranches: total.missedBranches,
    totalCoveredBranches: total.coveredBranches,
    totalMissedLines: total.missedLines,
    totalCoveredLines: total.coveredLines,
    totalMissedMethods: total.missedMethods,
    totalCoveredMethods: total.coveredMethods,
    totalMissedClasses: total.missedClasses,
    totalCoveredClasses: total.coveredClasses,
    lineCoverage: sumPct(total.coveredLines, total.missedLines),
    branchCoverage: sumPct(total.coveredBranches, total.missedBranches),
  };
}

function sumPct(covered: number, missed: number): number {
  const denom = covered + missed;
  return denom > 0 ? (covered / denom) * 100 : 0;
}
