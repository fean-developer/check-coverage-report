// Exemplos de uso da função setColumnsUserConfig:
//
// 1. Todas as colunas centralizadas, exceto a primeira à esquerda:
// const columns = setColumnsUserConfig(5, { 0: 'left', '1-4': 'center' });
// Resultado:
// {
//   0: { alignment: 'left' },
//   1: { alignment: 'center' },
//   2: { alignment: 'center' },
//   3: { alignment: 'center' },
//   4: { alignment: 'center' }
// }
//
// 2. Primeira à esquerda, última à direita, demais centralizadas:
// const columns = setColumnsUserConfig(6, { 0: 'left', '1-4': 'center', 5: 'right' });
// Resultado:
// {
//   0: { alignment: 'left' },
//   1: { alignment: 'center' },
//   2: { alignment: 'center' },
//   3: { alignment: 'center' },
//   4: { alignment: 'center' },
//   5: { alignment: 'right' }
// }
//
// 3. Todas à direita:
// const columns = setColumnsUserConfig(3, { '0-2': 'right' });
// Resultado:
// {
//   0: { alignment: 'right' },
//   1: { alignment: 'right' },
//   2: { alignment: 'right' }
// }
//
// 4. Configuração mista:
// const columns = setColumnsUserConfig(4, { 0: 'left', 1: 'center', '2-3': 'right' });
// Resultado:
// {
//   0: { alignment: 'left' },
//   1: { alignment: 'center' },
//   2: { alignment: 'right' },
//   3: { alignment: 'right' }
// }
/**
 * Configura dinamicamente o alinhamento das colunas de uma tabela.
 * @param totalColumns Número total de colunas
 * @param config Objeto de configuração, exemplo: { 0: 'left', '1-11': 'center', 12: 'right' }
 * @returns Objeto columns: { 0: { alignment: 'left' }, ... }
 */
export function setColumnsUserConfig(totalColumns, config) {
    const columns = {};
    // Inicializa todas as colunas com 'left' por padrão
    for (let i = 0; i < totalColumns; i++) {
        columns[i] = { alignment: 'left' };
    }
    Object.entries(config).forEach(([key, align]) => {
        if (key.includes('-')) {
            // Intervalo, ex: '1-11'
            const [start, end] = key.split('-').map(Number);
            for (let i = start; i <= end && i < totalColumns; i++) {
                columns[i] = { alignment: align };
            }
        }
        else {
            const idx = Number(key);
            if (!isNaN(idx) && idx < totalColumns) {
                columns[idx] = { alignment: align };
            }
        }
    });
    return columns;
}
export function printCoverageSummary(result, tableOutput, minCoverage, core) {
    let summary = `\n** 📑 Resumo:**\n`;
    summary += `✨ Total linhas cobertas: ${result.totalCoveredLines}\n`;
    summary += `‼️ Total linhas não cobertas: ${result.totalMissedLines}\n`;
    summary += `📌 Coverage percentual:\n`;
    summary += `    Lines coverage: ${result.lineCoverage.toFixed(2)}%\n`;
    summary += `    Branchs coverage: ${result.branchCoverage.toFixed(2)}%\n`;
    core.info("\n" + tableOutput + summary);
    if (result.lineCoverage < minCoverage) {
        core.setFailed(`Line coverage ${result.lineCoverage.toFixed(2)}% is below the minimum threshold of ${minCoverage}%`);
        return;
    }
    if (result.branchCoverage < minCoverage) {
        core.setFailed(`Branch coverage ${result.branchCoverage.toFixed(2)}% is below the minimum threshold of ${minCoverage}%`);
        return;
    }
}
