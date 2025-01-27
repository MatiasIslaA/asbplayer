export default class Anki {

    constructor(settingsProvider) {
        this.settingsProvider = settingsProvider;
    }

    async deckNames(ankiConnectUrl) {
        const response = await this._executeAction(ankiConnectUrl, 'deckNames');
        return response.result;
    }

    async modelNames(ankiConnectUrl) {
        const response = await this._executeAction(ankiConnectUrl, 'modelNames');
        return response.result;
    }

    async modelFieldNames(ankiConnectUrl, modelName) {
        const response = await this._executeAction(ankiConnectUrl, 'modelFieldNames', {modelName: modelName});
        return response.result;
    }

    async export(ankiConnectUrl, text, definition, audioClip, image, word, source) {
        const fields = {};

        if (this.settingsProvider.sentenceField && text) {
            fields[this.settingsProvider.sentenceField] = text ? text.split("\n").join("<br>") : text;
        }

        if (this.settingsProvider.definitionField && definition) {
            fields[this.settingsProvider.definitionField] = definition ? definition.split("\n").join("<br>") : definition;
        }

        if (this.settingsProvider.wordField && word) {
            fields[this.settingsProvider.wordField] = word;
        }

        if (this.settingsProvider.sourceField && source) {
            fields[this.settingsProvider.sourceField] = source;
        }

        const params = {
            note: {
                deckName: this.settingsProvider.deck,
                modelName: this.settingsProvider.noteType,
                fields: fields,
                options: {
                    allowDuplicate: false,
                    duplicateScope: 'deck',
                    duplicateScopeOptions: {
                        deckName: this.settingsProvider.deck,
                        checkChildren: false
                    }
                }
            }
        };

        if (this.settingsProvider.audioField && audioClip) {
            params.note.audio = {
                filename: audioClip.name,
                data: await audioClip.base64(),
                fields: [
                    this.settingsProvider.audioField
                ]
            };
        }

        if (this.settingsProvider.imageField && image) {
            params.note.picture = {
                filename: image.name,
                data: await image.base64(),
                fields: [
                    this.settingsProvider.imageField
                ]
            }
        }

        const response = await this._executeAction(ankiConnectUrl, 'addNote', params);
        return response.result;
    }

    async _executeAction(ankiConnectUrl, action, params) {
        const body = {
            action: action,
            version: 6
        };

        if (params) {
            body.params = params;
        }

        const response = await fetch(ankiConnectUrl, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        const json = await response.json();

        if (json.error) {
            throw new Error(json.error);
        }

        return json;
    }
}