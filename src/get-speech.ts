import { SpeechConfig, AudioConfig, SpeechSynthesizer, ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import { getStringHash } from './get-string-hash';

export async function getSpeech(text: string, ankiMediaAddress: string, speechKey: string): Promise<string> {
    const fileName = `${getStringHash(text)}.wav`;

    var audioFile = `${ankiMediaAddress}/${fileName}`;
    const tag = `[sound:${fileName}]`

    const speechConfig = SpeechConfig.fromSubscription(speechKey, 'eastus');
    const audioConfig = AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "de-DE-Seraphina:DragonHDLatestNeural";

    // Create the speech synthesizer.
    let synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    const speakText = await new Promise<string>((res, rej) => {
        synthesizer.speakTextAsync(text,
            function (result) {
                if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                    res(tag);
                } else {
                    rej("Speech synthesis canceled, " + result.errorDetails +
                        "\nDid you set the speech resource key and region values?");
                }
                synthesizer.close();
            },
            function (err) {
                rej("err - " + err);
                synthesizer.close();
            });
    });
    return speakText;
}