import { XMLParser } from 'fast-xml-parser';
import { parseJaCoCo } from './jacoco';
import { parseCobertura } from './cobertura';
import { parseOpenCover } from './opencover';
export function parseCoverageReport(xml, format = 'auto') {
    if (format !== 'auto') {
        return routeByFormat(xml, format);
    }
    const parser = new XMLParser({ ignoreAttributes: false });
    const doc = parser.parse(xml);
    const rootName = Object.keys(doc)[0];
    if (rootName === 'report' && doc.report?.package) {
        return parseJaCoCo(doc);
    }
    if (rootName === 'coverage' && (doc.coverage?.packages || doc.coverage?.["@_line-rate"])) {
        return parseCobertura(doc);
    }
    if (rootName === 'CoverageSession' && doc.CoverageSession?.Summary) {
        return parseOpenCover(doc);
    }
    // Try some other hints if root node is not enough
    if (doc?.report?.counter && doc?.report?.package)
        return parseJaCoCo(doc);
    if (doc?.coverage)
        return parseCobertura(doc);
    if (doc?.CoverageSession)
        return parseOpenCover(doc);
    throw new Error('Unsupported coverage report format. Please specify the format explicitly.');
}
/**
 * Route the XML input to the appropriate parser based on the specified format.
 * @param xml The XML string to parse.
 * @param format The format to use for parsing.
 * @returns The parsed coverage result.
 */
function routeByFormat(xml, format) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const doc = parser.parse(xml);
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
