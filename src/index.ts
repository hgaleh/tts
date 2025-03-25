#!/usr/bin/env node
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

import { getSpeech } from './get-speech';
import { translate } from './translate';
import { appendToFile } from './append-to-file';


(async () => {
    const text = process.argv.slice(2).join(" ") || "Dies ist ein Beispieltext.";
    const ankiMediaAddress = process.env.ANKI_MEDIA || '';
    const speechKey = process.env.SPEECH_KEY || '';
    const translationKey = process.env.TRANSLATION_KEY || '';
    const fileName = path.join(process.cwd(), 'out.txt');
    const speech = await getSpeech(text, ankiMediaAddress, speechKey);
    const translation = await translate(text, translationKey);
    await appendToFile(fileName, text, translation, speech);
})()