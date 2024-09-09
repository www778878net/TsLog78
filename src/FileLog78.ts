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
import LogEntry from './LogEntry';

export default class FileLog78 implements IFileLog78 {

	private menu: string;
	private file: string;
	private logger?: winston.Logger;
	static logpath: string = "/";

	constructor(filename: string = "7788_%DATE%.log", menu: string = "logs") {
		this.file = filename;
		this.menu = menu;
	
		const transport = new DailyRotateFile({
			filename: this.file,
			dirname: this.menu,
			datePattern: 'YYYY-MM-DD-HH',
			maxSize: '5m',
			maxFiles: '24h',
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

	logToFile(logEntry: LogEntry): void {
	 
		try {
			if (this.logger) {
				const currentFileName = this.getCurrentFileName();
				console.log(`Writing to file: ${currentFileName}`);
				
				this.logger.info(logEntry.toJson());
			} else {
				console.error('Logger is not initialized');
			}
			const now = new Date();
			if (now.getMinutes() === 0 && now.getSeconds() < 10) {
				this.clear();
			}
		} catch (error) {
			console.error(`写入日志文件时出错: ${error}`);
		}
	 
	}

	private getCurrentFileName(): string {
		if (this.logger && this.logger.transports.length > 0) {
			const transport = this.logger.transports[0] as DailyRotateFile;
			if (transport instanceof DailyRotateFile) {
				return transport.filename; // 使用 filename 属性而不是 getFilename 方法
			}
		}
		// 如果无法从 logger 获取文件名，则使用默认的文件名格式
		const now = new Date();
		const dateString = now.toISOString().split('T')[0];
		const hour = now.getHours().toString().padStart(2, '0');
		return this.file.replace('%DATE%', dateString).replace('%HOUR%', hour);
	}

   // 清除日志的方法
   clear(): void {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    fs.readdir(this.menu, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach(file => {
            if (file.startsWith('7788_') && file.endsWith('.log')) {
                const filePath = path.join(this.menu, file);
                const fileDate = this.getDateFromFilename(file);
                
                if (fileDate && fileDate < twentyFourHoursAgo) {
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
    const match = filename.match(/7788_(\d{4}-\d{2}-\d{2}-\d{2})/);
    if (match) {
        return new Date(match[1].replace(/-/g, ':'));
    }
    return null;
}

public close(): void {
	if (this.logger) {
		this.logger.close();
	}
}

 

 

 
}