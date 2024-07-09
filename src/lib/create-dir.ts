import fs from 'fs';
import path from 'path';

export function createDir(dir: string) {
  const list: string[] = [];
  while (!fs.existsSync(dir)) {
    list.push(dir);
    dir = path.dirname(dir);
  }
  list.reverse().forEach((x) => fs.mkdirSync(x));
}
