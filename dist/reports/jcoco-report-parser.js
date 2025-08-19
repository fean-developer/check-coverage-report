import { XMLParser } from 'fast-xml-parser';
// Parses a JaCoCo XML report and returns detailed coverage info
export function parseCoverageReport(xml) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const report = parser.parse(xml);
    if (!report?.report) {
        throw new Error('Invalid JaCoCo report');
    }
    // Helper to extract counters from a node
    function extractCounters(node) {
        const counters = node.counter ? (Array.isArray(node.counter) ? node.counter : [node.counter]) : [];
        const get = (type, attr) => {
            const c = counters.find((c) => c['@_type'] === type);
            return c ? parseInt(c[`@_${attr}`] || '0', 10) : 0;
        };
        return {
            missedInstructions: get('INSTRUCTION', 'missed'),
            coveredInstructions: get('INSTRUCTION', 'covered'),
            missedBranches: get('BRANCH', 'missed'),
            coveredBranches: get('BRANCH', 'covered'),
            missedLines: get('LINE', 'missed'),
            coveredLines: get('LINE', 'covered'),
            missedMethods: get('METHOD', 'missed'),
            coveredMethods: get('METHOD', 'covered'),
            missedClasses: get('CLASS', 'missed'),
            coveredClasses: get('CLASS', 'covered'),
        };
    }
    // Pacotes
    const packages = report.report.package ? (Array.isArray(report.report.package) ? report.report.package : [report.report.package]) : [];
    const elements = [];
    for (const pkg of packages) {
        const pkgCounters = extractCounters(pkg);
        elements.push({
            name: pkg['@_name'] || '(root)',
            ...pkgCounters,
            instructionCoverage: (pkgCounters.coveredInstructions + pkgCounters.missedInstructions) > 0 ? (pkgCounters.coveredInstructions / (pkgCounters.coveredInstructions + pkgCounters.missedInstructions)) * 100 : 0,
            branchCoverage: (pkgCounters.coveredBranches + pkgCounters.missedBranches) > 0 ? (pkgCounters.coveredBranches / (pkgCounters.coveredBranches + pkgCounters.missedBranches)) * 100 : 0,
            lineCoverage: (pkgCounters.coveredLines + pkgCounters.missedLines) > 0 ? (pkgCounters.coveredLines / (pkgCounters.coveredLines + pkgCounters.missedLines)) * 100 : 0,
        });
    }
    // Totais
    const totalCounters = extractCounters(report.report);
    const lineCoverage = (totalCounters.coveredLines + totalCounters.missedLines) > 0 ? (totalCounters.coveredLines / (totalCounters.coveredLines + totalCounters.missedLines)) * 100 : 0;
    const branchCoverage = (totalCounters.coveredBranches + totalCounters.missedBranches) > 0 ? (totalCounters.coveredBranches / (totalCounters.coveredBranches + totalCounters.missedBranches)) * 100 : 0;
    return {
        elements,
        totalMissedInstructions: totalCounters.missedInstructions,
        totalCoveredInstructions: totalCounters.coveredInstructions,
        totalMissedBranches: totalCounters.missedBranches,
        totalCoveredBranches: totalCounters.coveredBranches,
        totalMissedLines: totalCounters.missedLines,
        totalCoveredLines: totalCounters.coveredLines,
        totalMissedMethods: totalCounters.missedMethods,
        totalCoveredMethods: totalCounters.coveredMethods,
        totalMissedClasses: totalCounters.missedClasses,
        totalCoveredClasses: totalCounters.coveredClasses,
        lineCoverage,
        branchCoverage
    };
}
