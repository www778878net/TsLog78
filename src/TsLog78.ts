// Copyright 2024 frieda
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// src/TsLog78.ts

import FileLog78 from "./FileLog78";
import ConsoleLog78 from "./ConsoleLog78";
import IConsoleLog78 from "./IConsoleLog78";
import IFileLog78 from "./IFileLog78";
import IServerLog78 from "./IServerLog78";
import  LogEntry  from './LogEntry';

/**
 * 日志类 
 * 后续加上:
 * .采样:随机 或条件 减少日志量
 * .集合:可以按时间段、用户、事件类型等进行聚合
 * .分级:只对重要级别的日志进行详细记录和分析(现在基本可以了)
 * .轮转:定期轮转日志文件(文件做了) 服务器要清或转
 *  */
export class TsLog78 {
  public debugKind: Set<string> = new Set();
  public LevelFile: number = 50;
  public LevelConsole: number = 60;
  public LevelApi: number = 70;
  private serverLogger?: IServerLog78;
  private consoleLogger?: IConsoleLog78 = new ConsoleLog78();
  private fileLogger?: IFileLog78 = new FileLog78();

  public DebugEntry?: LogEntry;

  private static instance?: TsLog78;

  public static get Instance(): TsLog78 {
    if (!TsLog78.instance) {
      TsLog78.instance = new TsLog78();
      TsLog78.instance.setup(undefined, new FileLog78(), new ConsoleLog78());
    }
    return TsLog78.instance;
  }

  constructor() {}

  public setup(serverLogger?: IServerLog78, fileLogger?: IFileLog78, consoleLogger?: IConsoleLog78) {
    this.serverLogger = serverLogger;
    this.fileLogger = fileLogger;
    this.consoleLogger = consoleLogger;
  }

  public clone(): TsLog78 {
    const cloned = new TsLog78();
    cloned.serverLogger = this.serverLogger;
    cloned.fileLogger = this.fileLogger;
    cloned.consoleLogger = this.consoleLogger;
    cloned.LevelApi = this.LevelApi;
    cloned.LevelConsole = this.LevelConsole;
    cloned.LevelFile = this.LevelFile;
    return cloned;
  }

  private async processLog(logEntry: LogEntry): Promise<void> {
    if (!logEntry.basic) {
      await this.ERRORentry(new LogEntry({ 
        basic: { 
          summary: "Error: LogEntry or LogEntry.basic is null",
          message: "Invalid log entry",
          logLevelNumber: 60, // ERROR level
          timestamp: new Date(),
          logLevel: "ERROR"
        } 
      }));
      return;
    }

    const isDebug = this.isDebugKey(logEntry);

    if (isDebug || logEntry.basic.logLevelNumber >= this.LevelApi) {
      if (this.serverLogger) {
        await this.serverLogger.logToServer(logEntry);
      }
    }

    if (isDebug || logEntry.basic.logLevelNumber >= this.LevelFile) {
      this.fileLogger?.logToFile(logEntry);
    }

    if (isDebug || logEntry.basic.logLevelNumber >= this.LevelConsole) {
      this.consoleLogger?.writeLine(logEntry);
    }
  }

  private isDebugKey(logEntry: LogEntry): boolean {
    if (this.DebugEntry?.basic) {
      return !!(
        (this.DebugEntry.basic.serviceName && logEntry.basic.serviceName && this.DebugEntry.basic.serviceName.toLowerCase() === logEntry.basic.serviceName.toLowerCase()) ||
        (this.DebugEntry.basic.serviceObj && logEntry.basic.serviceObj && this.DebugEntry.basic.serviceObj.toLowerCase() === logEntry.basic.serviceObj.toLowerCase()) ||
        (this.DebugEntry.basic.serviceFun && logEntry.basic.serviceFun && this.DebugEntry.basic.serviceFun.toLowerCase() === logEntry.basic.serviceFun.toLowerCase()) ||
        (this.DebugEntry.basic.userId && logEntry.basic.userId && this.DebugEntry.basic.userId.toLowerCase() === logEntry.basic.userId.toLowerCase()) ||
        (this.DebugEntry.basic.userName && logEntry.basic.userName && this.DebugEntry.basic.userName.toLowerCase() === logEntry.basic.userName.toLowerCase())
      );
    }

    const keysToCheck = [
      logEntry.basic.serviceName,
      logEntry.basic.serviceObj,
      logEntry.basic.serviceFun,
      logEntry.basic.userId,
      logEntry.basic.userName
    ];

    return keysToCheck.some(key => key && this.debugKind.has(key.toLowerCase()));
  }

  public async DEBUGentry(logEntry: LogEntry, level: number = 10): Promise<void> {
    logEntry.basic.logLevel = "DEBUG";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async DEBUG(summary: string, message: string, level: number = 10): Promise<void> {
    const logEntry = new LogEntry({
      basic: {
        summary,
        message,
        logLevel: "DEBUG",
        logLevelNumber: level
      }
    });
    await this.processLog(logEntry);
  }

  public async INFOentry(logEntry: LogEntry, level: number = 30): Promise<void> {
    logEntry.basic.logLevel = "INFO";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async INFO(summary: string, message: string, level: number = 30): Promise<void> {
    const logEntry = new LogEntry({
      basic: {
        summary,
        message,
        logLevel: "INFO",
        logLevelNumber: level
      }
    });
    await this.processLog(logEntry);
  }

  public async WARNentry(logEntry: LogEntry, level: number = 50): Promise<void> {
    logEntry.basic.logLevel = "WARN";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async WARN(summary: string, message: string, level: number = 50): Promise<void> {
    const logEntry = new LogEntry({
      basic: {
        summary,
        message,
        logLevel: "WARN",
        logLevelNumber: level
      }
    });
    await this.processLog(logEntry);
  }

  public async ERRORentry(logEntry: LogEntry, level: number = 60): Promise<void> {
    logEntry.basic.logLevel = "ERROR";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async ERROR(summary: string, message: string, level: number = 60): Promise<void> {
    const logEntry = new LogEntry({
      basic: {
        summary,
        message,
        logLevel: "ERROR",
        logLevelNumber: level
      }
    });
    await this.processLog(logEntry);
  }

  // 使用 LogEntry 对象的方法
  public async logEntry(logEntry: LogEntry): Promise<void> {
    await this.processLog(logEntry);
  }

  // 使用字符串参数的方法
  public async log(message: string, level: number = 50, key1: string = '', key2: string = '', key3: string = '', content: string = '', key4: string = '', key5: string = '', key6: string = ''): Promise<void> {
    const logEntry = new LogEntry({
      basic: {
        message,
        logLevelNumber: level,
        logLevel: this.getLevelString(level),
        serviceName: key1,
        serviceObj: key2,
        serviceFun: key3,
        userId: key4,
        userName: key5
      },
      additionalProperties: {
        content,
        key6
      }
    });
    await this.processLog(logEntry);
  }

  // 辅助方法，用于获取日志级别字符串
  private getLevelString(level: number): string {
    if (level <= 10) return "DEBUG";
    if (level <= 30) return "INFO";
    if (level <= 50) return "WARN";
    return "ERROR";
  }
} // 类定义结束

// 将默认导出移到类定义的外部
export default TsLog78;
