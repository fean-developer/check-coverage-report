import * as core from '@actions/core';
import * as fs from 'fs';
import { table } from 'table';
import { parseCoverageReport } from './parsers/registry';
import type { SupportedFormat } from './parsers/registry';


async function run() {
    core.info('Action started');
    try {
    const reportFile = core.getInput('report-file');
    const reportFormat = (core.getInput('report-format') || 'auto') as SupportedFormat;
        const minCoverage = parseFloat(core.getInput('min-coverage')) || 0;

        if (!fs.existsSync(reportFile)) {
           throw new Error(`Report file not found: ${reportFile}`);
        }

        const xmlContent = fs.readFileSync(reportFile, 'utf-8');

    const result = parseCoverageReport(xmlContent, reportFormat);


        // Monta tabela formatada usando 'table'

        // Tabela igual à do JaCoCo HTML
        const data = [
            [
                'Element',
                'Missed Instr.', 'Cov.',
                'Missed Branches', 'Cov.',
                'Missed', 'Cxty', 'Missed', 'Lines', 'Missed', 'Methods', 'Missed', 'Classes'
            ],
            ...result.elements.map(el => {
                // Percentuais
                const instrTotal = el.missedInstructions + el.coveredInstructions;
                const instrCov = instrTotal > 0 ? `${Math.round((el.coveredInstructions / instrTotal) * 100)}%` : '0%';
                const branchTotal = el.missedBranches + el.coveredBranches;
                const branchCov = branchTotal > 0 ? `${Math.round((el.coveredBranches / branchTotal) * 100)}%` : 'n/a';
                // Linhas
                const lineTotal = el.missedLines + el.coveredLines;
                // Métodos
                const methodTotal = el.missedMethods + el.coveredMethods;
                // Classes
                const classTotal = el.missedClasses + el.coveredClasses;
                return [
                    el.name,
                    `${el.missedInstructions} of ${instrTotal}`, instrCov,
                    branchTotal > 0 ? `${el.missedBranches} of ${branchTotal}` : 'n/a', branchCov,
                    el.missedBranches,
                    (el.missedComplexity ?? 0) + (el.coveredComplexity ?? 0) > 0 ? (el.missedComplexity ?? 0) : 0,
                    el.missedLines, lineTotal, el.missedMethods, methodTotal, el.missedClasses, classTotal
                ];
            }),
            [
                'Total',
                `${result.totalMissedInstructions} of ${result.totalMissedInstructions + result.totalCoveredInstructions}`,
                result.totalCoveredInstructions + result.totalMissedInstructions > 0 ? `${Math.round((result.totalCoveredInstructions / (result.totalCoveredInstructions + result.totalMissedInstructions)) * 100)}%` : '0%',
                result.totalCoveredBranches + result.totalMissedBranches > 0 ? `${result.totalMissedBranches} of ${result.totalMissedBranches + result.totalCoveredBranches}` : 'n/a',
                result.totalCoveredBranches + result.totalMissedBranches > 0 ? `${Math.round((result.totalCoveredBranches / (result.totalCoveredBranches + result.totalMissedBranches)) * 100)}%` : 'n/a',
                result.totalMissedBranches,
                (result.totalMissedComplexity ?? 0),
                result.totalMissedLines, result.totalMissedLines + result.totalCoveredLines,
                result.totalMissedMethods, result.totalMissedMethods + result.totalCoveredMethods,
                result.totalMissedClasses, result.totalMissedClasses + result.totalCoveredClasses
            ]
        ];

        const tableOutput = table(data, {
            columns: {
                0: { alignment: 'left' },
                1: { alignment: 'center' },
                2: { alignment: 'center' },
                3: { alignment: 'center' },
                4: { alignment: 'center' },
                5: { alignment: 'center' },
                6: { alignment: 'center' },
                7: { alignment: 'center' },
                8: { alignment: 'center' },
                9: { alignment: 'center' },
                10: { alignment: 'center' },
                11: { alignment: 'center' },
                12: { alignment: 'center' }
            },
            drawHorizontalLine: (index, size) => {
                return index === 0 || index === 1 || index === size;
            }
        });

        // Sumário
        let summary = `\n** 📑 Resumo:**\n`;
        summary += `✨ Total linhas cobertas: ${result.totalCoveredLines}\n`;
        summary += `‼️ Total linhas não cobertas: ${result.totalMissedLines}\n`;
        summary += `📌 Coverage percentual:\n`;
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
