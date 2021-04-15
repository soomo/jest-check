import type { FormattedTestResults } from "@jest/test-result/build/types";

// @ts-ignore
// import JEST_OUTPUT from "../spec/output";

export interface FeatureSummary {
  title: string;
  pass: boolean;
  duration: number;
  tests: TestSummary[];
}

export interface TestSummary {
  ancestor: string;
  title: string;
  pass: boolean;
}

export function buildSummaryData(jestOutput: FormattedTestResults) {
  return jestOutput.testResults.reduce<FeatureSummary[]>((accum, tr) => {
    const title = tr.assertionResults.reduce<string>(
      (title, ar) => ar.ancestorTitles[0],
      ""
    );

    const tests = tr.assertionResults.map<TestSummary>((ar) => {
      return {
        ancestor: ar.ancestorTitles[0],
        title: ar.title,
        pass: ar.status === "passed",
      };
    });

    return [
      ...accum,
      {
        title,
        pass: tests.reduce<boolean>(
          (pass, f) => (f.pass && pass ? true : false),
          false
        ),
        duration: (tr.endTime - tr.startTime) / 1000,
        tests,
      },
    ];
  }, []);
}

// const summaryData = buildSummaryData(JEST_OUTPUT as unknown as FormattedTestResults)

/**
 * Format TestSummary[] into Markdown
 * @param summaryData results from buildSummaryData
 * @returns Markdown string
 */
export function formatSummaryData(summaryData: FeatureSummary[]) {
  let document = "## Test Results\n";

  summaryData.forEach((d) => {
    document += `### ${d.pass ? `✅` : `❌`} ${d.title} (${d.duration}s ⏱️)\n`;
    d.tests?.forEach((s) => {
      document += `- ${s.pass ? `✅` : `❌`} ${s.title}\n`;
    });
  });

  return document;
}

// console.log(formatSummaryData(summaryData))