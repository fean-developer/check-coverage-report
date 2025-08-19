import * as core from "@actions/core";
import * as fs from "fs";
import { table } from "table";
import { parseCoverageReport } from "./parsers/registry";
import { printCoverageSummary } from "./helpers/tables-helpers";
import { buildCoverageTableData, printTable } from "./helpers/build-coverage-table-data";
import type { CoverageResult } from "./interfaces/coverage-result";
import { inputs } from "./helpers/inputs";

async function run() {
  try {

    const { reportFile, reportFormat, minCoverage } = inputs;

    if (!fs.existsSync(reportFile)) {
      throw new Error(`Report file not found: ${reportFile}`);
    }

    const xmlContent = fs.readFileSync(reportFile, "utf-8");

    const result: CoverageResult = parseCoverageReport(
      xmlContent,
      reportFormat
    );

    const data = buildCoverageTableData(result);

    const tableOutput = printTable(data, core);
    
    printCoverageSummary(result, tableOutput, minCoverage, core);
    
  } catch (error: any) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();
export { run };
