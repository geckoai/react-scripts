import path from 'path';
import chalk from 'chalk';
import { spawn } from 'child_process';
import * as process from 'node:process';
/**
 * 安装依赖
 * @param type
 * @param projectName
 */
export function install(
  type: 'pnpm' | 'npm' | 'yarn',
  projectName: string
): Promise<void> {
  return new Promise((r, j) => {
    const npmi = spawn(
      process.platform === 'win32' ? type + '.cmd' : type,
      ['install'],
      process.platform === 'win32'
        ? {
            cwd: path.resolve(projectName),
            stdio: 'inherit',
            env: process.env,
            shell: true,
          }
        : {
            cwd: path.resolve(projectName),
            stdio: 'inherit',
            env: process.env,
          }
    );

    npmi.on('close', () => {
      r();
      console.log(chalk.green('\nTo get started:'));
      console.log(chalk.yellow(`cd ${projectName}`));
      console.log(chalk.yellow(`${type} start`));
    });

    npmi.on('error', (err: Error) => {
      console.log(err);
      j(err);
    });
  });
}
