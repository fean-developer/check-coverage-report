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

        const result = parseCoverageReport(xmlContent);

        // Monta tabela markdown
        let table = '| Element | Missed Instructions | Covered Instructions | Instr. Cov. (%) | Missed Branches | Covered Branches | Branch Cov. (%) | Missed Lines | Covered Lines | Line Cov. (%) | Missed Methods | Covered Methods | Missed Classes | Covered Classes |\n';
        table += '|---------|--------------------|----------------------|-----------------|-----------------|------------------|-----------------|--------------|--------------|---------------|---------------|----------------|---------------|----------------|\n';
        for (const el of result.elements) {
            table += `| ${el.name} | ${el.missedInstructions} | ${el.coveredInstructions} | ${el.instructionCoverage.toFixed(2)} | ${el.missedBranches} | ${el.coveredBranches} | ${el.branchCoverage.toFixed(2)} | ${el.missedLines} | ${el.coveredLines} | ${el.lineCoverage.toFixed(2)} | ${el.missedMethods} | ${el.coveredMethods} | ${el.missedClasses} | ${el.coveredClasses} |\n`;
        }
        // Totais
        table += `| **Total** | ${result.totalMissedInstructions} | ${result.totalCoveredInstructions} | - | ${result.totalMissedBranches} | ${result.totalCoveredBranches} | - | ${result.totalMissedLines} | ${result.totalCoveredLines} | - | ${result.totalMissedMethods} | ${result.totalCoveredMethods} | ${result.totalMissedClasses} | ${result.totalCoveredClasses} |\n`;

        // Sumário
        let summary = `\n**Resumo:**\n`;
        summary += `Total linhas cobertas: ${result.totalCoveredLines}\n`;
        summary += `Total linhas não cobertas: ${result.totalMissedLines}\n`;
        summary += `Coverage percentual:\n`;
        summary += `    Lines coverage: ${result.lineCoverage.toFixed(2)}%\n`;
        summary += `    Branchs coverage: ${result.branchCoverage.toFixed(2)}%\n`;

        core.info('\n' + table + summary);

        if (result.lineCoverage < minCoverage) {
            core.setFailed(`Line coverage ${result.lineCoverage.toFixed(2)}% is below the minimum threshold of ${minCoverage}%`);
            return;
        }
        if (result.branchCoverage < minCoverage) {
            core.setFailed(`Branch coverage ${result.branchCoverage.toFixed(2)}% is below the minimum threshold of ${minCoverage}%`);
            return;
        }

    } catch (error: any) {
        core.setFailed(`Action failed with error: ${error.message}`);
    }
}

run();
export { run };
