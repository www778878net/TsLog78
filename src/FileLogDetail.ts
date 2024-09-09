import * as fs from 'fs';
import * as path from 'path';
import IFileLog78 from "./IFileLog78";
import LogEntry from './LogEntry';

export default class FileLogDetail implements IFileLog78 {
    private filePath: string;

    constructor(filename: string = "detail.log", menu: string = "logs", clearOnCreate: boolean = true) {
      this.filePath = path.join(menu, filename);
      if (clearOnCreate) {
          this.clear();
      }
  }

    logToFile(logEntry: LogEntry): void {
        try {
            const logString = logEntry.toJson() + '\n';
            fs.appendFileSync(this.filePath, logString);
        } catch (error) {
            console.error(`写入详细日志文件时出错: ${error}`);
        }
    }

    clear(): void {
        // 清空文件
        fs.writeFileSync(this.filePath, '');
    }

    close(): void {
        // 不需要特别的关闭操作
    }
}