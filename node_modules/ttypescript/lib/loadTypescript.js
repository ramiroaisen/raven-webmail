"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var resolve_1 = require("resolve");
var patchCreateProgram_1 = require("./patchCreateProgram");
var path_1 = require("path");
var vm_1 = require("vm");
var Module = require("module");
function loadTypeScript(filename, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.folder, folder = _c === void 0 ? __dirname : _c, _d = _b.forceConfigLoad, forceConfigLoad = _d === void 0 ? false : _d;
    var libFilename = resolve_1.sync('typescript/lib/' + filename, { basedir: folder });
    if (!(libFilename in require.cache)) {
        require.cache[libFilename] = new TypeScriptModule(libFilename);
    }
    var ts = new TypeScriptModule(libFilename).exports;
    var _e = ts.versionMajorMinor.split('.'), major = _e[0], minor = _e[1];
    if (+major < 3 && +minor < 7) {
        throw new Error('ttypescript supports typescript from 2.7 version');
    }
    return patchCreateProgram_1.patchCreateProgram(ts, forceConfigLoad);
}
exports.loadTypeScript = loadTypeScript;
var typeScriptFactoryCache = new Map();
var TypeScriptModule = /** @class */ (function (_super) {
    __extends(TypeScriptModule, _super);
    function TypeScriptModule(filename) {
        var _this = _super.call(this, filename, module) || this;
        _this.filename = filename;
        _this.paths = module.paths.slice();
        _this.loaded = true;
        _this._exports = undefined;
        return _this;
    }
    Object.defineProperty(TypeScriptModule.prototype, "exports", {
        get: function () {
            return this._exports || this._init();
        },
        set: function (value) {
            this._exports = value;
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptModule.prototype._init = function () {
        this._exports = {};
        var factory = typeScriptFactoryCache.get(this.filename);
        if (!factory) {
            var code = fs_1.readFileSync(this.filename, 'utf8');
            factory = vm_1.runInThisContext("(function (exports, require, module, __filename, __dirname) {" + code + "\n});", {
                filename: this.filename,
                lineOffset: 0,
                displayErrors: true,
            });
            typeScriptFactoryCache.set(this.filename, factory);
        }
        factory.call(this._exports, this._exports, require, this, this.filename, path_1.dirname(this.filename));
        return this._exports;
    };
    return TypeScriptModule;
}(Module));
