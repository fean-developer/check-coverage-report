
# Coverage Report Check (JaCoCo, Cobertura, OpenCover, etc)

GitHub Action para validar a cobertura de código a partir de relatórios XML de múltiplos formatos (JaCoCo, Cobertura, OpenCover, etc).

## Usage



## Como usar (GitHub Actions)

Adicione o passo abaixo ao seu workflow:

```yaml
- name: Check Coverage (JaCoCo)
  uses: fean-developer/check-coverage-report@v1
  with:
    report-file: 'target/site/jacoco/jacoco.xml'
    min-coverage: '80'
    report-format: 'jacoco'
```

Exemplo para Cobertura:

```yaml
- name: Check Coverage (Cobertura)
  uses: fean-developer/check-coverage-report@v2
  with:
    report-file: 'coverage/cobertura-coverage.xml'
    min-coverage: '80'
    report-format: 'cobertura'
```

Exemplo para OpenCover:

```yaml
- name: Check Coverage (OpenCover)
  uses: fean-developer/check-coverage-report@v2
  with:
    report-file: 'coverage/opencover.xml'
    min-coverage: '80'
    report-format: 'opencover'
```

## Inputs


| Input           | Descrição                                                                  | Default                               | Obrigatório |
|-----------------|----------------------------------------------------------------------------|---------------------------------------|-------------|
| `report-file`   | Caminho para o arquivo XML de cobertura.                                   | `'target/site/jacoco/jacoco.xml'`     | `true`      |
| `min-coverage`  | Cobertura mínima exigida (%)                                                | `'80'`                                | `true`      |
| `report-format` | Formato do relatório (`auto`, `jacoco`, `cobertura`, `opencover`, etc).    | `'auto'`                              | `false`     |



## Build e Desenvolvimento

Para empacotar a aplicação para distribuição:

```bash
npm run package
```

Isso criará o diretório `dist` com o JavaScript compilado.

## Exemplos de saída

Exemplo (JaCoCo):

```
┌──────────────┬──────────────────┬──────┬───────────────────┬──────┬────────┬──────┬────────┬───────┬─────────┬────────┬─────────┬──────────┐
│ Element      │ Missed Instr.    │ Cov. │ Missed Branches   │ Cov. │ Missed │ Cxty │ Missed │ Lines │ Missed  │ Methods│ Missed  │ Classes  │
├──────────────┼──────────────────┼──────┼───────────────────┼──────┼────────┼──────┼────────┼───────┼─────────┼────────┼─────────┼──────────┤
│ com.example  │ 15 of 120        │ 88%  │ 2 of 10           │ 80%  │ 2      │ 5    │ 4      │ 60    │ 1       │ 12     │ 0       │ 3        │
│ com.example2 │ 0 of 30          │ 100% │ n/a               │ n/a  │ 0      │ 0    │ 0      │ 30    │ 0       │ 4      │ 0       │ 1        │
├──────────────┼──────────────────┼──────┼───────────────────┼──────┼────────┼──────┼────────┼───────┼─────────┼────────┼─────────┼──────────┤
│ Total        │ 15 of 150        │ 90%  │ 2 of 10           │ 80%  │ 2      │ 5    │ 4      │ 90    │ 1       │ 16     │ 0       │ 4        │
└──────────────┴──────────────────┴──────┴───────────────────┴──────┴────────┴──────┴────────┴───────┴─────────┴────────┴─────────┴──────────┘

** 📑 Resumo:**
✨ Total linhas cobertas: 86
‼️ Total linhas não cobertas: 4
📌 Coverage percentual:
  Lines coverage: 95.56%
  Branchs coverage: 80.00%
```

Exemplo (Cobertura):

```
┌──────────────┬──────────────────┬──────┬───────────────────┬──────┬────────┬──────┬────────┬───────┬─────────┬────────┬─────────┬──────────┐
│ Element      │ Missed Instr.    │ Cov. │ Missed Branches   │ Cov. │ Missed │ Cxty │ Missed │ Lines │ Missed  │ Methods│ Missed  │ Classes  │
├──────────────┼──────────────────┼──────┼───────────────────┼──────┼────────┼──────┼────────┼───────┼─────────┼────────┼─────────┼──────────┤
│ my.module    │ 10 of 100        │ 90%  │ n/a               │ n/a  │ 0      │ 0    │ 2      │ 50    │ 1       │ 10     │ 0       │ 2        │
├──────────────┼──────────────────┼──────┼───────────────────┼──────┼────────┼──────┼────────┼───────┼─────────┼────────┼─────────┼──────────┤
│ Total        │ 10 of 100        │ 90%  │ n/a               │ n/a  │ 0      │ 0    │ 2      │ 50    │ 1       │ 10     │ 0       │ 2        │
└──────────────┴──────────────────┴──────┴───────────────────┴──────┴────────┴──────┴────────┴───────┴─────────┴────────┴─────────┴──────────┘

** 📑 Resumo:**
✨ Total linhas cobertas: 48
‼️ Total linhas não cobertas: 2
📌 Coverage percentual:
  Lines coverage: 96.00%
  Branchs coverage: n/a
```

Observação: os valores acima são exemplos ilustrativos para demonstrar o formato de saída.

## License

This project is licensed under the terms of the MIT license.

