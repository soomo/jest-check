import fs from "fs";
import path from "path";
import * as core from "@actions/core";
import * as github from "@actions/github";
import type { FormattedTestResults } from "@jest/test-result/build/types";

import { buildSummaryData, formatSummaryData } from "./format";

const ACTION_NAME = "jest-check-run";

async function run() {
  const GITHUB_TOKEN = core.getInput("GITHUB_TOKEN", { required: true });
  const JEST_FOLDER = core.getInput("JEST_FOLDER", { required: true });

  const octokit = github.getOctokit(GITHUB_TOKEN);
  const { context } = github;
  const ownership = {
    owner: context.repo.owner,
    repo: context.repo.repo,
  };

  const outputJson = fs.readFileSync(
    path.join(`${JEST_FOLDER}/output.json`),
    "utf-8"
  );

  const summary = buildSummaryData(
    JSON.parse(outputJson) as FormattedTestResults
  );

  await octokit.checks.create({
    ...ownership,
    name: ACTION_NAME,
    head_sha: context.sha,
    conclusion: summary.reduce(
      (result, current) => (!current.pass ? false : result),
      true
    )
      ? "success"
      : "failure",
    output: {
      title: "Check Output",
      summary: formatSummaryData(summary),
    },
  });
}

run();
