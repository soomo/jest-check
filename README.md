# jest-check

A Github action written in JavaScript that creates a check run with formatted details from a Jest testing suite. 

## Requirements

1. Jest should be setup in the consuming repo to output its results as json in the folder specified by `JEST_FOLDER`

## Usage
Add the following to your Github action workflow file
```yaml
- name: jest-check
  uses: soomo/jest-check@0.0.5
  with:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    JEST_FOLDER: ${{ github.workspace }}/spec
```
