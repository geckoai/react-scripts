import { describe, it } from 'mocha';
import { EntryObject } from 'webpack';
import glob from 'glob';
import path from 'path';

describe('spec', () => {
  it('should ', () => {
    const getEntries = (pwd: string): EntryObject => {
      const entries: EntryObject = {};
      glob
        .sync(path.join(pwd, '**', '*.{js,mjs,ts}'), {
          ignore: ['node_modules/**', '**/*.d.ts'],
        })
        .forEach((file) => {
          const name = path.relative(pwd, file);
          entries[name] = file;
        });
      return entries;
    };

    console.log(getEntries(path.resolve('src')));
  });
});
