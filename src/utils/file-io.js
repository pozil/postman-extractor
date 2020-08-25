const fs = require('fs');

module.exports.CONSTANTS = {
    DEFAULT_FILE: 'index.json',
    COLLECTIONS: 'collections',
    ENVIRONMENTS: 'environments',
    HEADER_PRESETS: 'headerPresets',
    FOLDERS: 'folders',
    REQUESTS: 'requests'
};

/**
 * Writes the provided data in a JSON file
 * @param {String} path path where JSON file is written
 * @param {Object} data data that will be saved as JSON
 */
module.exports.writeJson = (path, data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), (error) => {
        if (error) {
            console.error(`Failed to write JSON file ${path}`);
            throw error;
        }
    });
};

/**
 * Reads a file and parses it as JSON
 * @param {String} path read file path
 * @returns {Object} data parsed from file
 */
module.exports.readJson = (path) => {
    try {
        const jsonString = fs.readFileSync(path);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Failed to parse JSON file ${path}`);
        throw error;
    }
};

/**
 * Escapes a file name so that it only contains lowercase letters, numbers and underscores
 * @param {String} name original file name
 * @returns {String} escaped file name
 */
module.exports.escapeFileName = (name) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

/**
 * Gets all non-system files from a directory
 * @param {String} path directory path
 * @returns {String[]} file list
 */
module.exports.getNonSystemFilesFromDir = (path) => {
    return fs.readdirSync(path).filter((filename) => filename !== '.DS_Store');
};
