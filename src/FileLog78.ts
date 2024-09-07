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

import * as winston from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';
import IFileLog78 from "./IFileLog78";
import  LogEntry  from './LogEntry';

// 实现 FileLog78 类
export default class FileLog78 implements IFileLog78 {
    menu: string;
    file: string;
    private logger: winston.Logger;
    static logpath: string = "/"; // 静态属性，与C#版本保持一致

    // 构造函数
    constructor(menu: string = "logs", filename: string = "7788_%DATE%.log") {
        this.menu = menu;
        this.file = filename;
        
        const transport = new DailyRotateFile({
            filename: this.file,
            dirname: this.menu,
            datePattern: 'YYYY-MM-DD',
            maxSize: '5m',
            maxFiles: '5d',
            format: winston.format.json()
        });

        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [transport]
        });

        this.clear(); // 在构造函数中调用clear，与C#版本保持一致
    }

    // 将 LogEntry 对象转换为字符串
    logToFile(logEntry: LogEntry): void {
        try {
           
            this.logger.info(logEntry.toJson());
            const now = new Date();
            if (now.getMinutes() === 0 && now.getSeconds() < 10) {
                this.clear();
            }
        } catch (error) {
            console.error(`写入日志文件时出错: ${error}`);
        }
    }

    // 清除日志的方法
    clear(): void {
        const today = new Date();
        const idate = today.getDate() % 3;
        
        fs.readdir(this.menu, (err, files) => {
            if (err) {
                console.error(`Error reading directory: ${err}`);
                return;
            }

            files.forEach(file => {
                if (file.startsWith('7788_') && file.endsWith('.log')) {
                    const filePath = path.join(this.menu, file);
                    const fileDate = this.getDateFromFilename(file);
                    
                    if (fileDate && (today.getTime() - fileDate.getTime() > 3 * 24 * 60 * 60 * 1000)) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting file ${filePath}: ${err}`);
                            }
                        });
                    }
                }
            });
        });
    }

    private getDateFromFilename(filename: string): Date | null {
        const match = filename.match(/7788_(\d{4}-\d{2}-\d{2})/);
        if (match) {
            return new Date(match[1]);
        }
        return null;
    }
}