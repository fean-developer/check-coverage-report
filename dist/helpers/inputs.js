import * as core from '@actions/core';
export const inputs = {
    reportFile: core.getInput('report-file'),
    reportFormat: (core.getInput('report-format') || 'auto'),
    minCoverage: parseFloat(core.getInput('min-coverage')) || 0,
};
