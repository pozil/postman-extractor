const { Command, flags } = require('@oclif/command');
// eslint-disable-next-line node/no-extraneous-require
const { cli } = require('cli-ux');
const fs = require('fs');
const rimraf = require('rimraf');

const {
    CONSTANTS,
    writeJson,
    readJson,
    escapeFileName
} = require('../utils/file-io.js');
const {
    DEFAULT_FILE,
    COLLECTIONS,
    ENVIRONMENTS,
    HEADER_PRESETS,
    FOLDERS,
    REQUESTS
} = CONSTANTS;

class ImportCommand extends Command {
    async run() {
        const { flags } = this.parse(ImportCommand);
        const { postmanFile, outputDir } = flags;

        // Check Postman file
        if (!fs.existsSync(postmanFile)) {
            this.log(`Could not find Postman file: ${postmanFile}`);
            return;
        }

        // Confirm output directory overwrite
        if (fs.existsSync(outputDir)) {
            const isConfirmed = await cli.confirm(
                `Overwrite ${outputDir} folder? (Y/n)`
            );
            if (!isConfirmed) {
                this.log('Operation cancelled.');
                return;
            }
            rimraf.sync(outputDir);
        }

        // Extract top level data
        const postmanJson = readJson(flags.postmanFile);
        fs.mkdirSync(outputDir);
        extractCollections(postmanJson, outputDir);
        extractToDirectory(postmanJson, ENVIRONMENTS, outputDir);
        extractToDirectory(postmanJson, HEADER_PRESETS, outputDir);
        writeJson(`${outputDir}/${DEFAULT_FILE}`, postmanJson);
    }
}

ImportCommand.description =
    'Extracts the resources of a Postman export file into a directory';

ImportCommand.flags = {
    postmanFile: flags.string({
        char: 'f',
        description: 'Postman export file *.postman_export.json',
        required: true
    }),
    outputDir: flags.string({
        char: 'o',
        description: 'Output directory',
        default: 'src',
        required: true
    })
};

function extractToDirectory(parent, key, path) {
    const folderName = escapeFileName(key);
    fs.mkdirSync(`${path}/${folderName}`);
    parent[key].forEach(item => {
        const fileName = escapeFileName(item.name);
        writeJson(`${path}/${folderName}/${fileName}.json`, item);
    });
    delete parent[key];
}

function extractCollections(parent, outputDir) {
    parent[COLLECTIONS].forEach(collection => {
        const collectionName = escapeFileName(collection.name);
        const collectionPath = `${outputDir}/${COLLECTIONS}/${collectionName}`;
        fs.mkdirSync(collectionPath, { recursive: true });
        // Extract folders
        const folderMap = extractCollectionFolders(collectionPath, collection);
        // Extract requests
        extractRequests(collectionPath, collection, folderMap);
        // Write remaining data
        writeJson(`${collectionPath}/${DEFAULT_FILE}`, collection);
    });
    delete parent[COLLECTIONS];
}

function extractCollectionFolders(collectionPath, collection) {
    const folderMap = {};
    collection[FOLDERS].forEach(folder => {
        const folderName = escapeFileName(folder.name);
        folderMap[folder.id] = folderName;
        const folderPath = `${collectionPath}/${folderName}`;
        fs.mkdirSync(folderPath, { recursive: true });
    });
    return folderMap;
}

function extractRequests(collectionPath, collection, folderMap) {
    collection[REQUESTS].forEach(request => {
        let folderName = folderMap[request.folder];
        if (folderName) {
            folderName = escapeFileName(folderName);
        } else {
            console.warn(
                `Unknown folder '${request.folder}' for request '${request.name}'`
            );
            folderName = 'null';
            fs.mkdirSync(`${collectionPath}/null`, { recursive: true });
        }
        const requestName = escapeFileName(request.name);
        const requestPath = `${collectionPath}/${folderName}/${requestName}.json`;
        writeJson(requestPath, request);
    });
    delete collection[REQUESTS];
}

module.exports = ImportCommand;
