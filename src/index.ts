import * as core from '@actions/core';
import * as fs from 'fs';
import { parseCoverageReport } from './reports/jcoco-report-parser';


async function run() {
    core.info('Action started');
    try {
        const reportFile = core.getInput('report-file');
        const minCoverage = parseFloat(core.getInput('min-coverage')) || 0;

        if (!fs.existsSync(reportFile)) {
           throw new Error(`Report file not found: ${reportFile}`);
        }

        const xmlContent = fs.readFileSync(reportFile, 'utf-8');
        const { lineCoverage, branchCoverage } = parseCoverageReport(xmlContent);

        core.info(`Line Coverage: ${lineCoverage}`);
        core.info(`Branch Coverage: ${branchCoverage}`);

        if (lineCoverage < minCoverage) {
            core.setFailed(`Line coverage ${lineCoverage}% is below the minimum threshold of ${minCoverage}%`);
            return
        }

        if (branchCoverage < minCoverage) {
            core.setFailed(`Branch coverage ${branchCoverage}% is below the minimum threshold of ${minCoverage}%`);
            return;
        }

        core.info(`Final Line Coverage: ${lineCoverage}`);
        core.info(`Final Branch Coverage: ${branchCoverage}`);

    } catch (error: any) {
        core.setFailed(`Action failed with error: ${error.message}`);
    }
}

run();
export { run };
