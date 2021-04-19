import fs from "fs";
import path from "path";

import { getFiles } from "./utils";

type JestCucumberFail = {
  stepText: string;
  lineNumber: number;
  errorMessage: string;
  fileName: string;
};

interface GithubAnnotation {
  path: string;
  start_line: number;
  end_line: number;
  annotation_level: "notice" | "warning" | "failure";
  message: string;
  title?: string;
}

export function failToAnnotations(cucumberDir: string) {
  return getFiles(cucumberDir).reduce<GithubAnnotation[]>(
    (annotations, currentFilePath) => [
      ...annotations,
      ...failToAnnotation(currentFilePath.path),
    ],
    []
  );
}

function failToAnnotation(failDirPath: string) {
  const failJson = JSON.parse(
    fs.readFileSync(path.join(failDirPath), "utf-8")
  ) as JestCucumberFail[];

  if (!failJson[0]) {
    return [];
  }

  return failJson.reduce<GithubAnnotation[]>(
    (annotations, currentFailure) => [
      ...annotations,
      {
        // @ts-ignore
        path: String(currentFailure.fileName.match(/(spec\/.*)/g)[0]),
        start_line: currentFailure.lineNumber,
        end_line: currentFailure.lineNumber,
        annotation_level: "failure",
        message: String(currentFailure.errorMessage),
        title: `${currentFailure.stepText}`,
      },
    ],
    []
  );
}
