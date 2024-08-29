// src/TsLog78.ts

import ConsoleLog78 from "./ConsoleLog78";
import IConsoleLog78 from "./IConsoleLog78";
import IFileLog78 from "./IFileLog78";
import IServerLog78 from "./IServerLog78";


export class TsLog78 {
  public debugKind: string[] = [];
  public LevelFile: number = 50;
  public LevelConsole: number = 30;
  public LevelApi: number = 70;
  private serverLogger?: IServerLog78;
  private consoleLogger?: IConsoleLog78 = new ConsoleLog78();
  private fileLogger?: IFileLog78;

  public uname: string = '';

  private static instance?: TsLog78;

  public static get Instance(): TsLog78 {
    if (!TsLog78.instance) {
      TsLog78.instance = new TsLog78();
    }
    return TsLog78.instance;
  }

  constructor() {
    this.uname = '';
  }

  public setup(serverLogger?: IServerLog78, fileLogger?: IFileLog78, consoleLogger?: IConsoleLog78, uname: string = 'guest') {
    this.serverLogger = serverLogger;
    this.fileLogger = fileLogger;
    this.consoleLogger = consoleLogger;
    this.uname = uname;
  }

  public clone(): TsLog78 {
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

  public logErr(exception: Error, key1: string = 'errts', previousMethodName: string = '') {
    this.log(exception.message, 90, key1, previousMethodName, this.uname, exception.stack);
  }

  public log(message: string, level: number = 50, key1: string = '', key2: string = '', key3: string = '', content: string = '', key4: string = '', key5: string = '', key6: string = '') {
    key1 = key1 || '';
    key2 = key2 || '';
    key3 = key3 || this.uname;

    const keys = [key1, key2, key3, key4, key5, key6];
    const isDebug = keys.some(kind => this.debugKind.includes(kind)); // 修改点

    const info = `${new Date().toISOString()} \t ${message} ~~ ${content} ~~ ${key1}`;

    if (isDebug || level >= this.LevelApi) {
      this.serverLogger?.logToServer(message, key1, level, key2, key3, content, key4, key5, key6);
    }

    if (isDebug || level >= this.LevelFile) {
      this.fileLogger?.logToFile(info);
    }

    if (isDebug || level >= this.LevelConsole) {
      this.consoleLogger?.writeLine(info);
    }
  }
}
