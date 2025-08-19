import * as core from '@actions/core';
import { SupportedFormat } from '../parsers/registry';

export const inputs = {
  reportFile: core.getInput('report-file'),
  reportFormat: (core.getInput('report-format') || 'auto') as SupportedFormat,
  minCoverage: parseFloat(core.getInput('min-coverage')) || 0,
};