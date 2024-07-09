import path from 'path';
import chalk from 'chalk';
import { spawn } from 'child_process';
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
    if (process.platform === 'win32') {
      type += '.cmd';
    }

    const npmi = spawn(type, ['install'], {
      cwd: path.resolve(projectName),
      stdio: 'inherit',
      env: process.env,
    });

    npmi.on('close', () => {
      r();
      console.log('\nTo get started:\n');
      console.log(chalk.yellow(`cd ${projectName}`));
      console.log(chalk.yellow(`${type.replace('.cmd', '')} start`));
    });

    npmi.on('error', (err: Error) => {
      j(err);
    });
  });
}
