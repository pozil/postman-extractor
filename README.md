# Postman Extractor (pmx)

Command line utility that extracts/compacts resources from Postman export files for easier versioning.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/postman-extractor.svg)](https://npmjs.org/package/postman-extractor)
[![Downloads/week](https://img.shields.io/npm/dw/postman-extractor.svg)](https://npmjs.org/package/postman-extractor)
[![License](https://img.shields.io/npm/l/postman-extractor.svg)](https://github.com/pozil/postman-extractor/blob/master/package.json)

Run `pmx import -f myResources.postman_export.json` to split a Postman export JSON file into a set of files and folders likes this:

```
src
│   index.json
│
└───collections
│   └───my_collection1
│   │   │   index.json
│   │   │
│   │   └───my_folder1
│   │   │   │   my_request1a.json
│   │   │   │   my_request1b.json
│   │   │
│   │   └───my_folder2
│   │       │   my_request2a.json
│   │       │   my_request2b.json
│   │
│   └───my_collection2
│       │   index.json
│       │
│       └───my_folder3
│           │   my_request3a.json
|
└───environments
│   │   my_env1.json
│   │   my_env2.json
|
└───headerpresets
    │   my_presets1.json
```

Then, run `pmx export -o myUpdatedResources.postman_export.json` to aggregate the source files and folders into a single Postman export JSON file.

⚠️ **Warning:** Make sure to remove all credentials from your Postman resources when versioning them.

<!-- toc -->

-   [Postman Extractor (pmx)](#postman-extractor-pmx)
-   [Usage](#usage)
-   [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g postman-extractor
$ pmx COMMAND
running command...
$ pmx (-v|--version|version)
postman-extractor/1.1.0 darwin-x64 node-v10.16.3
$ pmx --help [COMMAND]
USAGE
  $ pmx COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

-   [`pmx export`](#pmx-export)
-   [`pmx help [COMMAND]`](#pmx-help-command)
-   [`pmx import`](#pmx-import)

## `pmx export`

Assembles ressource files in a single Postman export file

```
USAGE
  $ pmx export

OPTIONS
  -d, --sourceDirectory=sourceDirectory  (required) [default: src] Source directory
  -o, --outputFile=outputFile            (required) Output file
```

_See code: [src/commands/export.js](https://github.com/pozil/postman-extractor/blob/v1.1.0/src/commands/export.js)_

## `pmx help [COMMAND]`

display help for pmx

```
USAGE
  $ pmx help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `pmx import`

Extracts the resources of a Postman export file into a directory

```
USAGE
  $ pmx import

OPTIONS
  -f, --postmanFile=postmanFile  (required) Postman export file *.postman_export.json
  -o, --outputDir=outputDir      (required) [default: src] Output directory
```

_See code: [src/commands/import.js](https://github.com/pozil/postman-extractor/blob/v1.1.0/src/commands/import.js)_

<!-- commandsstop -->
