# JaCoCo Coverage Check

A GitHub Action to check if the code coverage from a JaCoCo XML report meets a minimum threshold.

## Usage

To use this action in your workflow, add the following step:

```yaml
- name: Check JaCoCo Coverage
  uses: your-username/your-repo-name@v1
  with:
    report-file: 'target/site/jacoco/jacoco.xml'
    min-coverage: '80'
```

## Inputs

| Input          | Description                               | Default                               | Required |
|----------------|-------------------------------------------|---------------------------------------|----------|
| `report-file`  | Path to the JaCoCo XML coverage report.   | `'target/site/jacoco/jacoco.xml'`     | `true`   |
| `min-coverage` | The minimum required coverage percentage. | `'80'`                                | `true`   |

## Development


### Build and Package

To package the application for distribution, run:

```bash
npm run package
```

This will create a `dist` directory with the compiled JavaScript file.

## License

This project is licensed under the terms of the MIT license.

