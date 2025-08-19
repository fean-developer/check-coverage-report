import { XMLParser } from 'fast-xml-parser';
import { CoverageResult } from '../interfaces/coverage-result';

// Parses a JaCoCo XML report and returns line/branch coverage in percent (0-100)
export function parseCoverageReport(xml: string): CoverageResult {
    const parser = new XMLParser({
        ignoreAttributes: false
    });

    const report = parser.parse(xml);

    if (!report?.report?.counter) {
        throw new Error('Invalid JaCoCo report');
    }

    const counters = Array.isArray(report.report.counter) ? report.report.counter : [report.report.counter];

    const lineCounter = counters.find((c: any) => c.$.type === 'LINE');
    const branchCounter = counters.find((c: any)  => c.$.type === 'BRANCH');

    const lineCoverage = lineCounter ? parseFloat(lineCounter.$.covered) / parseFloat(lineCounter.$.missed) + parseFloat(lineCounter.$.covered) * 100 : 0;
    const branchCoverage = branchCounter ? parseFloat(branchCounter.$.covered) / parseFloat(branchCounter.$.missed) + parseFloat(branchCounter.$.covered) * 100 : 0;

    // TODO: Replace the following with actual parsing logic to extract coverage
    return {
        lineCoverage,
        branchCoverage
    };
}