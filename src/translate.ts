import TextTranslationClient, { isUnexpected, TranslatorCredential } from '@azure-rest/ai-translation-text';

export async function translate(text: string, translationKey: string): Promise<string> {
    const translateCedential: TranslatorCredential = {
        key: translationKey,
        region: 'eastus'
    };
    const translationClient = TextTranslationClient('https://api.cognitive.microsofttranslator.com', translateCedential);
    const parameters = {
        to: 'en',
        from: 'de',
    };
    const translateResponse = await translationClient.path('/translate').post({
        body: [
            { text }
        ],
        queryParameters: parameters,
    });

    if (isUnexpected(translateResponse)) {
        throw translateResponse.body;
    }

    const translation =  translateResponse.body[0].translations[0].text;
    return translation;
}