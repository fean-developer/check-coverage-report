export interface CoverageElement {
    name: string;
    missedInstructions: number;
    coveredInstructions: number;
    instructionCoverage: number;
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