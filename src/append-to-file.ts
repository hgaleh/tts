import { promises } from 'fs';

export async function appendToFile(fileName: string, text: string, translation: string, voice: string): Promise<void> {
    const { appendFile } = promises;
    await appendFile(fileName, `${text}\t${translation}\t${voice}\n`);
}