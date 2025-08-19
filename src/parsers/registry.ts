import { XMLParser } from 'fast-xml-parser';
import { CoverageResult } from '../interfaces/coverage-result';
import { parseJaCoCo } from './jacoco';
import { parseCobertura } from './cobertura';
import { parseOpenCover } from './opencover';

export type SupportedFormat = 'auto' | 'jacoco' | 'cobertura' | 'opencover' | 'dotcover' | 'visualstudio' | 'ncover';

export function parseCoverageReport(xml: string, format: SupportedFormat = 'auto'): CoverageResult {
  if (format !== 'auto') {
    return routeByFormat(xml, format);
  }

  const parser = new XMLParser({ ignoreAttributes: false });
  const doc: any = parser.parse(xml);
  const rootName = Object.keys(doc)[0];

  // Simple heuristics by root node
  if (rootName === 'report' && doc.report?.package) {
    return parseJaCoCo(doc);
  }
  if (rootName === 'coverage' && (doc.coverage?.packages || doc.coverage?.["@_line-rate"])) {
    return parseCobertura(doc);
  }
  if (rootName === 'CoverageSession' && doc.CoverageSession?.Summary) {
    return parseOpenCover(doc);
  }

  // Try some other hints
  if (doc?.report?.counter && doc?.report?.package) return parseJaCoCo(doc);
  if (doc?.coverage) return parseCobertura(doc);
  if (doc?.CoverageSession) return parseOpenCover(doc);

  throw new Error('Unsupported coverage report format. Please specify the format explicitly.');
}

function routeByFormat(xml: string, format: SupportedFormat): CoverageResult {
  const parser = new XMLParser({ ignoreAttributes: false });
  const doc: any = parser.parse(xml);
  switch (format) {
    case 'jacoco':
      return parseJaCoCo(doc);
    case 'cobertura':
      return parseCobertura(doc);
    case 'opencover':
      return parseOpenCover(doc);
    // Placeholders for future
    case 'dotcover':
    case 'visualstudio':
    case 'ncover':
      throw new Error(`Parser for format '${format}' not implemented yet.`);
    default:
      throw new Error(`Unknown format '${format}'.`);
  }
}
