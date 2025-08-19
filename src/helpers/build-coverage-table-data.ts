import { table } from 'table';
import type { CoverageResult } from '../interfaces/coverage-result';
import { setColumnsUserConfig } from './tables-helpers';

/**
 * Gera os dados da tabela de cobertura no formato esperado pelo pacote 'table'.
 */
export function buildCoverageTableData(result: CoverageResult): (string | number)[][] {
  const HEADER = [
    'Element',
    'Missed Instr.', 'Cov.',
    'Missed Branches', 'Cov.',
    'Missed', 'Cxty', 'Missed', 'Lines', 'Missed', 'Methods', 'Missed', 'Classes'
  ];

  const rows = result.elements.map(el => {
    const instrTotal = el.missedInstructions + el.coveredInstructions;
    const instrCov = instrTotal > 0 ? `${Math.round((el.coveredInstructions / instrTotal) * 100)}%` : '0%';
    const branchTotal = el.missedBranches + el.coveredBranches;
    const branchCov = branchTotal > 0 ? `${Math.round((el.coveredBranches / branchTotal) * 100)}%` : 'n/a';
    const lineTotal = el.missedLines + el.coveredLines;
    const methodTotal = el.missedMethods + el.coveredMethods;
    const classTotal = el.missedClasses + el.coveredClasses;
    return [
      el.name,
      `${el.missedInstructions} of ${instrTotal}`,
      instrCov,
      branchTotal > 0 ? `${el.missedBranches} of ${branchTotal}` : 'n/a',
      branchCov,
      el.missedBranches,
      (el.missedComplexity ?? 0) + (el.coveredComplexity ?? 0) > 0 ? (el.missedComplexity ?? 0) : 0,
      el.missedLines, lineTotal, el.missedMethods, methodTotal, el.missedClasses, classTotal
    ];
  });

  const totalRow = [
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
  ];

  return [HEADER, ...rows, totalRow];
}


export function printTable(data: (string | number)[][], core: any) {
  const output = table(data, {
    columns: setColumnsUserConfig(13, {
      0: "left",
      "1-12": "center",
    }),
    drawHorizontalLine: (index, size) => {
      return index === 0 || index === 1 || index === size;
    },
  });

  return output;
}