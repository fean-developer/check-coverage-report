import * as core from '@actions/core';
import * as fs from 'fs';
import { table } from 'table';
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


        // Monta tabela formatada usando 'table'
        const data = [
            [
                'Element',
                'Missed Instr.', 'Covered Instr.', 'Instr. Cov. (%)',
                'Missed Branches', 'Covered Branches', 'Branch Cov. (%)',
                'Missed Lines', 'Covered Lines', 'Line Cov. (%)',
                'Missed Methods', 'Covered Methods',
                'Missed Classes', 'Covered Classes'
            ],
            ...result.elements.map(el => [
                el.name,
                el.missedInstructions, el.coveredInstructions, el.instructionCoverage.toFixed(2),
                el.missedBranches, el.coveredBranches, el.branchCoverage.toFixed(2),
                el.missedLines, el.coveredLines, el.lineCoverage.toFixed(2),
                el.missedMethods, el.coveredMethods,
                el.missedClasses, el.coveredClasses
            ]),
            [
                'Total',
                result.totalMissedInstructions, result.totalCoveredInstructions, '-',
                result.totalMissedBranches, result.totalCoveredBranches, '-',
                result.totalMissedLines, result.totalCoveredLines, '-',
                result.totalMissedMethods, result.totalCoveredMethods,
                result.totalMissedClasses, result.totalCoveredClasses
            ]
        ];

        const tableOutput = table(data, {
            columns: {
                0: { alignment: 'left' },
                1: { alignment: 'right' },
                2: { alignment: 'right' },
                3: { alignment: 'right' },
                4: { alignment: 'right' },
                5: { alignment: 'right' },
                6: { alignment: 'right' },
                7: { alignment: 'right' },
                8: { alignment: 'right' },
                9: { alignment: 'right' },
                10: { alignment: 'right' },
                11: { alignment: 'right' },
                12: { alignment: 'right' },
                13: { alignment: 'right' }
            }
        });

        // Sumário
        let summary = `\n**Resumo:**\n`;
        summary += `Total linhas cobertas: ${result.totalCoveredLines}\n`;
        summary += `Total linhas não cobertas: ${result.totalMissedLines}\n`;
        summary += `Coverage percentual:\n`;
        summary += `    Lines coverage: ${result.lineCoverage.toFixed(2)}%\n`;
        summary += `    Branchs coverage: ${result.branchCoverage.toFixed(2)}%\n`;

        core.info('\n' + tableOutput + summary);

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
