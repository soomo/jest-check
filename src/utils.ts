import fs from "fs";

interface FileObject {
  path: string;
  name: string;
  type: string;
}

/**
 * Build an array of FileObjects from provided directory
 * @param dir
 * @param fileList
 */
export function getFiles(dir: string, fileList: FileObject[] = []) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = `${dir}/${file}`;
    if ([".gitkeep", ".Trash-0"].indexOf(file) === -1) {
      if (fs.statSync(filePath).isDirectory()) {
        getFiles(filePath, fileList);
      } else {
        const obj = {
          path: filePath,
          name: file,
          type: file.split(".")[1],
        };
        fileList.push(obj);
      }
    }
  });

  return fileList;
}
