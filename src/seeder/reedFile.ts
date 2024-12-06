import fs from 'fs/promises';

export const reedFile = async (filePath: string) =>
  fs.readFile(filePath, 'utf-8');

export const readJsonFile = async (filePath: string): Promise<unknown> => {
  try {
    const data = await reedFile(filePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
};

export const readBufferFile = async (filePath: string) => {
  return await fs.readFile(filePath);
};

export const getSizeFile = async (filePath: string) => {
  return (await fs.stat(filePath)).size;
};
