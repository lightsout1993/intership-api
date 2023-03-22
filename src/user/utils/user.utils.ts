import * as fs from 'fs';
import { resolve } from 'path';

const encoding = 'utf8';
const fileName = 'demoUserId.txt';
const path = resolve(__dirname, '../../fixtures/');

export const getDemoUserId = async (): Promise<string | never> => {
  return fs.promises.readFile(resolve(path, fileName), encoding);
};

export const setDemoUserId = async (id: string): Promise<void | never> => {
  return fs.promises.writeFile(resolve(path, fileName), id, { encoding });
};
