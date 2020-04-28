"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var resolve = require("resolve");
var loadTypescript_1 = require("./loadTypescript");
var path_1 = require("path");
var vm_1 = require("vm");
var ts = loadTypescript_1.loadTypeScript('typescript', { folder: process.cwd(), forceConfigLoad: true });
var tscFileName = resolve.sync('typescript/lib/tsc', { basedir: process.cwd() });
var commandLineTsCode = fs
    .readFileSync(tscFileName, 'utf8')
    .replace(/^[\s\S]+(\(function \(ts\) \{\s+function countLines[\s\S]+)$/, '$1');
vm_1.runInThisContext("(function (exports, require, module, __filename, __dirname, ts) {" + commandLineTsCode + "\n});", {
    filename: tscFileName,
    lineOffset: 0,
    displayErrors: true,
}).call(ts, ts, require, { exports: ts }, tscFileName, path_1.dirname(tscFileName), ts);
