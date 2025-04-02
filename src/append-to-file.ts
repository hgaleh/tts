import { appendFile } from 'node:fs/promises';

export async function appendToFile(fileName: string, text: string, translation: string, voice: string): Promise<void> {
    await appendFile(fileName, `${text}\t${translation}\t${voice}\n`);
}