"use strict";
// src/Log78.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsLog78 = void 0;
const ConsoleLog78_1 = __importDefault(require("./ConsoleLog78"));
class TsLog78 {
    debugKind = [];
    LevelFile = 50;
    LevelConsole = 30;
    LevelApi = 70;
    serverLogger;
    consoleLogger = new ConsoleLog78_1.default();
    fileLogger;
    uname = '';
    static instance;
    static get Instance() {
        if (!TsLog78.instance) {
            TsLog78.instance = new TsLog78();
        }
        return TsLog78.instance;
    }
    constructor() {
        this.uname = '';
    }
    setup(serverLogger, fileLogger, consoleLogger, uname = 'guest') {
        this.serverLogger = serverLogger;
        this.fileLogger = fileLogger;
        this.consoleLogger = consoleLogger;
        this.uname = uname;
    }
    clone() {
        const cloned = new TsLog78();
        cloned.serverLogger = this.serverLogger;
        cloned.fileLogger = this.fileLogger;
        cloned.consoleLogger = this.consoleLogger;
        cloned.uname = this.uname;
        cloned.LevelApi = this.LevelApi;
        cloned.LevelConsole = this.LevelConsole;
        cloned.LevelFile = this.LevelFile;
        return cloned;
    }
    logErr(exception, key1 = 'errts', previousMethodName = '') {
        this.log(exception.message, 90, key1, previousMethodName, this.uname, exception.stack);
    }
    log(message, level = 0, key1 = '', key2 = '', key3 = '', content = '', key4 = '', key5 = '', key6 = '') {
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
            this.serverLogger?.logToServer(message, key1, level, key2, key3, content, key4, key5, key6);
        }
        const info = `${new Date().toISOString()} \t ${message} ~~ ${content} ~~ ${key1}`;
        if (isDebug || level >= this.LevelFile) {
            this.fileLogger?.logToFile(info);
        }
        if (isDebug || level >= this.LevelConsole) {
            this.consoleLogger?.writeLine(info);
        }
    }
}
exports.TsLog78 = TsLog78;
