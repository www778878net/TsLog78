"use strict";
// src/Log78.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log78 = void 0;
const ConsoleLog78_1 = require("./ConsoleLog78");
class Log78 {
    static get Instance() {
        if (!Log78.instance) {
            Log78.instance = new Log78();
        }
        return Log78.instance;
    }
    constructor() {
        this.debugKind = [];
        this.LevelFile = 50;
        this.LevelConsole = 30;
        this.LevelApi = 70;
        this.consoleLogger = new ConsoleLog78_1.default();
        this.uname = '';
        this.uname = '';
    }
    setup(serverLogger, fileLogger, consoleLogger, uname = 'guest') {
        this.serverLogger = serverLogger;
        this.fileLogger = fileLogger;
        this.consoleLogger = consoleLogger;
        this.uname = uname;
    }
    clone() {
        const cloned = new Log78();
        cloned.serverLogger = this.serverLogger;
        cloned.fileLogger = this.fileLogger;
        cloned.consoleLogger = this.consoleLogger;
        cloned.uname = this.uname;
        cloned.LevelApi = this.LevelApi;
        cloned.LevelConsole = this.LevelConsole;
        cloned.LevelFile = this.LevelFile;
        return cloned;
    }
    logErr(exception, key1 = 'errwinpro', previousMethodName = '') {
        this.log(exception.message, 90, key1, previousMethodName, this.uname, exception.stack);
    }
    log(message, level = 0, key1 = '', key2 = '', key3 = '', content = '', key4 = '', key5 = '', key6 = '') {
        var _a, _b, _c;
        key1 = key1 || '';
        key2 = key2 || '';
        key3 = key3 || this.uname;
        let isDebug = false;
        const keys = [key1, key2, key3, key4, key5, key6];
        for (const kind of keys) {
            if (this.debugKind.includes(kind)) {
                isDebug = true;
                break;
            }
        }
        if (isDebug || level >= this.LevelApi) {
            (_a = this.serverLogger) === null || _a === void 0 ? void 0 : _a.logToServer(message, key1, level, key2, key3, content, key4, key5, key6);
        }
        const info = `${new Date().toISOString()} \t ${message} ~~ ${content} ~~ ${key1}`;
        if (isDebug || level >= this.LevelFile) {
            (_b = this.fileLogger) === null || _b === void 0 ? void 0 : _b.logToFile(info);
        }
        if (isDebug || level >= this.LevelConsole) {
            (_c = this.consoleLogger) === null || _c === void 0 ? void 0 : _c.writeLine(info);
        }
    }
}
exports.Log78 = Log78;
//# sourceMappingURL=Log78.js.map