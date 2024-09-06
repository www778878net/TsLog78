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
import * as fs from 'fs';
import * as path from 'path';
import IFileLog78 from "./IFileLog78";
import { LogEntry } from './LogEntry';

// 实现 FileLog78 类
export default class FileLog78 implements IFileLog78 {
    menu: string;
    file: string;
    private logger: winston.Logger;
    static logpath: string = "/"; // 静态属性，与C#版本保持一致

    // 构造函数
    constructor(menu: string = "logs", filename: string = "7788_.log") {
        this.menu = menu;
        this.file = path.join(menu, filename);
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ 
                    filename: this.file,
                    dirname: this.menu,
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                    tailable: true
                })
            ]
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
        const idate = new Date().getDate() % 3;
        for (let i = 0; i < 3; i++) {
            if (i === idate) continue;
            const filePath = path.join(this.menu, `7788_${i}.log`);
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error(`Error deleting file ${filePath}: ${err}`);
                }
            });
        }
    }
}