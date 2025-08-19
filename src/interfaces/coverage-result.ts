/**
 * Interface to represent a code coverage element.
 */

export interface CoverageElement {
    name: string;
    missedInstructions: number;
    coveredInstructions: number;
    missedBranches: number;
    coveredBranches: number;
    missedComplexity?: number;
    coveredComplexity?: number;
    missedLines: number;
    coveredLines: number;
    missedMethods: number;
    coveredMethods: number;
    missedClasses: number;
    coveredClasses: number;
}

export interface CoverageResult {
    elements: CoverageElement[];
    totalMissedInstructions: number;
    totalCoveredInstructions: number;
    totalMissedBranches: number;
    totalCoveredBranches: number;
    totalMissedComplexity?: number;
    totalCoveredComplexity?: number;
    totalMissedLines: number;
    totalCoveredLines: number;
    totalMissedMethods: number;
    totalCoveredMethods: number;
    totalMissedClasses: number;
    totalCoveredClasses: number;
    lineCoverage: number;
    branchCoverage: number;
}
export interface CoverageElement {
    name: string;
    missedInstructions: number;
    coveredInstructions: number;
    instructionCoverage: number;
    missedComplexity?: number;
    coveredComplexity?: number;
    missedBranches: number;
    coveredBranches: number;
    branchCoverage: number;
    missedLines: number;
    coveredLines: number;
    lineCoverage: number;
    missedMethods: number;
    coveredMethods: number;
    missedClasses: number;
    coveredClasses: number;
}

export interface CoverageResult {
    elements: CoverageElement[];
    totalMissedInstructions: number;
    totalCoveredInstructions: number;
    totalMissedComplexity?: number;
    totalCoveredComplexity?: number;
    totalMissedBranches: number;
    totalCoveredBranches: number;
    totalMissedLines: number;
    totalCoveredLines: number;
    totalMissedMethods: number;
    totalCoveredMethods: number;
    totalMissedClasses: number;
    totalCoveredClasses: number;
    lineCoverage: number;
    branchCoverage: number;
}