import fs from 'fs';
import path from 'path';
import * as process from 'node:process';

export function checkLocalEnv() {
  if (!fs.existsSync(path.resolve(process.cwd(), '.env.local'))) {
    fs.writeFileSync(path.resolve(process.cwd(), '.env.local'), "# Local env configuration, this configuration has the highest priority\r\n # This configuration is automatically generated locally, do not submit to Git\r\n");
  }
}