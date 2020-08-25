const { Command, flags } = require('@oclif/command');
const { cli } = require('cli-ux');
const fs = require('fs');

const {
    CONSTANTS,
    readJson,
    writeJson,
    escapeFileName,
    getNonSystemFilesFromDir
} = require('../utils/file-io.js');
const {
    DEFAULT_FILE,
    COLLECTIONS,
    ENVIRONMENTS,
    HEADER_PRESETS,
    REQUESTS
} = CONSTANTS;

class ExportCommand extends Command {
    async run() {
        const { flags } = this.parse(ExportCommand);
        const { sourceDirectory, outputFile } = flags;

        // Check source directory
        if (!fs.existsSync(sourceDirectory)) {
            this.log(`Could not find source directory: ${sourceDirectory}`);
            return;
        }

        // Confirm output file overwrite
        if (fs.existsSync(outputFile)) {
            const isConfirmed = await cli.confirm(
                `Overwrite ${outputFile}? (Y/n)`
            );
            if (!isConfirmed) {
                this.log('Operation cancelled.');
                return;
            }
            fs.unlinkSync(outputFile);
        }

        // Compact top level data
        const postmanData = readJson(`${sourceDirectory}/${DEFAULT_FILE}`);
        parseCollections(postmanData, sourceDirectory);
        parseFromDirectory(postmanData, ENVIRONMENTS, sourceDirectory);
        parseFromDirectory(postmanData, HEADER_PRESETS, sourceDirectory);
        writeJson(outputFile, postmanData);
    }
}

ExportCommand.description =
    'Assembles ressource files in a single Postman export file';

ExportCommand.flags = {
    sourceDirectory: flags.string({
        char: 'd',
        description: 'Source directory',
        required: true,
        default: 'src'
    }),
    outputFile: flags.string({
        char: 'o',
        description: 'Output file',
        required: true
    })
};

function parseFromDirectory(postmanData, key, sourceDirectory) {
    const dirPath = `${sourceDirectory}/${escapeFileName(key)}`;
    postmanData[key] = [];
    getNonSystemFilesFromDir(dirPath).forEach((fileName) => {
        postmanData[key].push(readJson(`${dirPath}/${fileName}`));
    });
}

function parseCollections(postmanData, sourceDirectory) {
    const collectionsPath = `${sourceDirectory}/${escapeFileName(COLLECTIONS)}`;
    const collections = [];
    getNonSystemFilesFromDir(collectionsPath).forEach(
        (collectionFolderName) => {
            const collection = parseCollection(
                `${collectionsPath}/${collectionFolderName}`
            );
            collections.push(collection);
        }
    );
    postmanData[COLLECTIONS] = collections;
}

function parseCollection(collectionPath) {
    const collection = readJson(`${collectionPath}/${DEFAULT_FILE}`);
    let requests = [];
    getNonSystemFilesFromDir(collectionPath).forEach((folderName) => {
        if (folderName !== DEFAULT_FILE) {
            const folderRequests = parseCollectionFolder(
                `${collectionPath}/${folderName}`
            );
            requests = requests.concat(folderRequests);
        }
    });
    collection[REQUESTS] = requests;
    return collection;
}

function parseCollectionFolder(folderPath) {
    return getNonSystemFilesFromDir(folderPath).map((requestFileName) => {
        return readJson(`${folderPath}/${requestFileName}`);
    });
}

module.exports = ExportCommand;
