import "reflect-metadata";

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
import { injectable } from "inversify";
import * as process from 'process';

/**
 * 日志类 
 *  */
@injectable()
export class TsLog78 {
  /* AI提示词
  - Take a deep breath and work on this problem step-by-step
  - 本项目背景介绍
  . 本项目是基于typescript的日志记录库，主要用于记录和分析日志
  . 通过LeaveFile LevelConsole LevelApi 确认当前日志级别是否需要输出文件 控制台或API
  . 通过DebugEntry 确认当前日志级别是否需要输出文件 控制台或API
  . detail10 debug20 info30 warn50 error60 日志级别会有默认的级别 可以调整本次的行为
  . 读取env 确认当前环境 通过这个修改leaveFile LevelConsole LevelApi 的值
  . 默认生产环境：error打印控制台，info以上打印文件，warn以上打印API 
  . 开发环境:debug以上打印控制台，debug以上打印文件，warn以上打印API
  . 测试环境:error打印控制台，debug以上打印文件，warn以上打印API
  . 开发环境特别增加一个功能全部打印文件方便AI调试 每次新开清空文件 文件名debug.log

  * 后续加上:增不处理
 * .采样:随机 或条件 减少日志量
 * .集合:可以按时间段、用户、事件类型等进行聚合
 * .分级:只对重要级别的日志进行详细记录和分析(现在基本可以了)
 * .轮转:定期轮转日志文件(文件做了) 服务器要清或转
  */

  //读取env 确认当前
  //默认生产环境：
  public debugKind: Set<string> = new Set();
  public LevelFile: number = 30;
  public LevelConsole: number = 60;
  public LevelApi: number = 50;
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

  constructor() {
    this.setEnvironment();
  }

  private setEnvironment() {
    const env = process.env.NODE_ENV || 'production';
    switch (env) {
      case 'development':
        this.LevelFile = 10; // 全部打印文件
        this.LevelConsole = 20; // debug以上打印控制台
        this.LevelApi = 50; // warn以上打印API
        // 开发环境特别增加一个功能全部打印文件方便AI调试
        this.setupDebugLog();
        break;
      case 'test':
        this.LevelFile = 20; // debug以上打印文件
        this.LevelConsole = 60; // error打印控制台
        this.LevelApi = 50; // warn以上打印API
        break;
      default: // production
        this.LevelFile = 30; // info以上打印文件
        this.LevelConsole = 60; // error打印控制台
        this.LevelApi = 50; // warn以上打印API
    }
  }

  private setupDebugLog() {
    // 实现开发环境下的debug.log文件
    // 这里需要实现一个新的文件日志记录器，专门用于debug.log
    // 每次启动时清空文件内容
    const debugFileLogger = new FileLog78('debug.log', 'debug');
    this.fileLogger = debugFileLogger;
  }

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
      await this.errorEntry(new LogEntry({ 
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

  public async debugEntry(logEntry: LogEntry, level: number = 20): Promise<void> {
    logEntry.basic.logLevel = "DEBUG";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async debug(summaryOrLogEntry: string | LogEntry, messageOrLevel?: string | number, level: number = 20): Promise<void> {
    let logEntry: LogEntry;

    if (summaryOrLogEntry instanceof LogEntry) {
      logEntry = summaryOrLogEntry;
      logEntry.basic.logLevel = "DEBUG";
      logEntry.basic.logLevelNumber = typeof messageOrLevel === 'number' ? messageOrLevel : level;
    } else {
      logEntry = new LogEntry({
        basic: {
          summary: summaryOrLogEntry,
          message: typeof messageOrLevel === 'string' ? messageOrLevel : summaryOrLogEntry,
          logLevel: "DEBUG",
          logLevelNumber: typeof messageOrLevel === 'number' ? messageOrLevel : level
        }
      });
    }

    await this.processLog(logEntry);
  }

  public async infoEntry(logEntry: LogEntry, level: number = 30): Promise<void> {
    logEntry.basic.logLevel = "INFO";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async info(summaryOrLogEntry: string | LogEntry, messageOrLevel?: string | number, level: number = 30): Promise<void> {
    let logEntry: LogEntry;

    if (summaryOrLogEntry instanceof LogEntry) {
      logEntry = summaryOrLogEntry;
      logEntry.basic.logLevel = "INFO";
      logEntry.basic.logLevelNumber = typeof messageOrLevel === 'number' ? messageOrLevel : level;
    } else {
      logEntry = new LogEntry({
        basic: {
          summary: summaryOrLogEntry,
          message: typeof messageOrLevel === 'string' ? messageOrLevel : summaryOrLogEntry,
          logLevel: "INFO",
          logLevelNumber: typeof messageOrLevel === 'number' ? messageOrLevel : level
        }
      });
    }

    await this.processLog(logEntry);
  }

  public async warnEntry(logEntry: LogEntry, level: number = 50): Promise<void> {
    logEntry.basic.logLevel = "WARN";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async warn(summaryOrLogEntry: string | LogEntry, messageOrLevel?: string | number, level: number = 50): Promise<void> {
    let logEntry: LogEntry;

    if (summaryOrLogEntry instanceof LogEntry) {
      logEntry = summaryOrLogEntry;
      logEntry.basic.logLevel = "WARN";
      logEntry.basic.logLevelNumber = typeof messageOrLevel === 'number' ? messageOrLevel : level;
    } else {
      logEntry = new LogEntry({
        basic: {
          summary: summaryOrLogEntry,
          message: typeof messageOrLevel === 'string' ? messageOrLevel : summaryOrLogEntry,
          logLevel: "WARN",
          logLevelNumber: typeof messageOrLevel === 'number' ? messageOrLevel : level
        }
      });
    }

    await this.processLog(logEntry);
  }

  public async errorEntry(logEntry: LogEntry, level: number = 60): Promise<void> {
    logEntry.basic.logLevel = "ERROR";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async error(errorOrSummary: Error | string, messageOrLevel?: string | number, level: number = 60): Promise<void> {
    let logEntry: LogEntry;

    if (errorOrSummary instanceof Error) {
      // 处理 Error 对象
      logEntry = new LogEntry({
        basic: {
          summary: errorOrSummary.message,
          message: `${messageOrLevel} - ${errorOrSummary.name}: ${errorOrSummary.message}`,
          logLevel: "ERROR",
          logLevelNumber: typeof messageOrLevel === 'number' ? messageOrLevel : level
        },
        error: {
          errorType: errorOrSummary.name,
          errorMessage: errorOrSummary.message,
          errorStackTrace: errorOrSummary.stack
        }
      });
    } else {
      // 处理 summary 和 message
      logEntry = new LogEntry({
        basic: {
          summary: errorOrSummary,
          message: typeof messageOrLevel === 'string' ? messageOrLevel : errorOrSummary,
          logLevel: "ERROR",
          logLevelNumber: typeof messageOrLevel === 'number' ? messageOrLevel : level
        }
      });
    }

    await this.processLog(logEntry);
  }

  // 使用 LogEntry 对象的方法
  public async logEntry(logEntry: LogEntry): Promise<void> {
    await this.processLog(logEntry);
  }

  public async detailEntry(logEntry: LogEntry, level: number = 10): Promise<void> {
    logEntry.basic.logLevel = "DETAIL";
    logEntry.basic.logLevelNumber = level;
    await this.processLog(logEntry);
  }

  public async detail(summaryOrLogEntry: string | LogEntry, messageOrLevel?: string | number, level: number = 10): Promise<void> {
    let logEntry: LogEntry;

    if (summaryOrLogEntry instanceof LogEntry) {
      logEntry = summaryOrLogEntry;
      logEntry.basic.logLevel = "DETAIL";
      logEntry.basic.logLevelNumber = typeof messageOrLevel === 'number' ? messageOrLevel : level;
    } else {
      logEntry = new LogEntry({
        basic: {
          summary: summaryOrLogEntry,
          message: typeof messageOrLevel === 'string' ? messageOrLevel : summaryOrLogEntry,
          logLevel: "DETAIL",
          logLevelNumber: typeof messageOrLevel === 'number' ? messageOrLevel : level
        }
      });
    }

    await this.processLog(logEntry);
  }

 
} // 类定义结束

// 将默认导出移到类定义的外部
export default TsLog78;
