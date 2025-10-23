import type {
  FormattedTestResults,
  Status,
} from "@jest/test-result/build/types";

export interface FeatureSummary {
  title: string;
  pass: boolean;
  duration: number;
  tests: TestSummary[];
}

export interface TestSummary {
  ancestor: string;
  title: string;
  status: Status;
}

/**
 * Build summary data out of FormattedTestResults (Jest Output)
 * @param jestOutput
 * @returns
 */
export function buildSummaryData(jestOutput: FormattedTestResults) {
  return jestOutput.testResults.reduce<FeatureSummary[]>((accum, tr) => {
    const title = tr.assertionResults.reduce<string>(
      (_title, ar) => ar.ancestorTitles[0],
      "",
    );

    const tests = tr.assertionResults.map<TestSummary>((ar) => {
      return {
        ancestor: ar.ancestorTitles[0],
        title: ar.title,
        status: ar.status,
      };
    });

    return [
      ...accum,
      {
        title,
        pass: tests.every((test) => test.status !== "failed"),
        duration: (tr.endTime - tr.startTime) / 1000,
        tests,
      },
    ];
  }, []);
}

/**
 * Format FeatureSummary[] into Markdown
 * @param summaryData results from buildSummaryData
 * @returns Markdown string
 */
export function formatSummaryData(summaryData: FeatureSummary[]) {
  let document = "## Test Results\n";

  summaryData.forEach((d) => {
    document += `### ${d.pass ? `✅` : `❌`} ${d.title} (${d.duration}s ⏱️)\n`;
    d.tests?.forEach((s) => {
      let icon: string;
      switch (s.status) {
        case "passed":
          icon = "✅";
          break;
        case "failed":
          icon = "❌";
          break;
        default:
          icon = "⚠️";
          break;
      }
      document += `- ${icon} ${s.title}\n`;
    });
  });

  return document;
}
