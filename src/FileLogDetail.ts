import * as fs from 'fs';
import * as path from 'path';
import IFileLog78 from "./IFileLog78";
import LogEntry from './LogEntry';

export default class FileLogDetail implements IFileLog78 {
    private filePath: string;

    constructor(menu: string = "logs", filename: string = "detail.log") {
        this.filePath = path.join(menu, filename);
        this.clear();
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
        fs.writeFileSync(this.filePath, '');
    }

    // 添加 close 方法
    close(): void {
        // FileLogDetail 不需要特别的关闭操作
        // 如果将来需要，可以在这里添加清理逻辑
    }
}