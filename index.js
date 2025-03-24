#!/usr/bin/env node

const crypto = require('crypto');
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const { default: TextTranslationClient, isUnexpected } = require('@azure-rest/ai-translation-text');
require('dotenv').config();

const text = process.argv.slice(2).join(" ") || "Dies ist ein Beispieltext.";

const translateCedential = {
    key: process.env.TRANSLATION_KEY,
    region: 'eastus'
};

const translationClient = TextTranslationClient('https://api.cognitive.microsofttranslator.com', translateCedential);

(async function () {

    "use strict";

    const fileName = `${getStringHash(text)}.wav`;

    var audioFile = `${process.env.ANKI_MEDIA}/${fileName}`;
    const tag = `[sound:${fileName}]`
    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, 'eastus');
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "de-DE-Seraphina:DragonHDLatestNeural";

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);


    synthesizer.speakTextAsync(text,
        function (result) {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                console.log("synthesis finished.");
                translate();
            } else {
                console.error("Speech synthesis canceled, " + result.errorDetails +
                    "\nDid you set the speech resource key and region values?");
            }
            synthesizer.close();
            synthesizer = null;
        },
        function (err) {
            console.trace("err - " + err);
            synthesizer.close();
            synthesizer = null;
        });
    console.log("Use this tag: " + tag);
}());

function getStringHash(input) {
    // Create a SHA-256 hash instance
    const hash = crypto.createHash('sha256');
    // Update the hash with the input string
    hash.update(input, 'utf8');
    // Generate the hash in hexadecimal format and return it
    return hash.digest('hex');
}

async function translate() {
    const parameters = {
        to: "en",
        from: "de",
    };
    const translateResponse = await translationClient.path("/translate").post({
        body: [
            { "Text": text }
        ],
        queryParameters: parameters,
    });

    if (isUnexpected(translateResponse)) {
        throw translateResponse.body;
    }

    const translation =  translateResponse.body[0].translations[0].text;
    console.log(`translation: ${translation}`);
}
