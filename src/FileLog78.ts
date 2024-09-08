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
	/** 是否为AI日志 */
	private isAILog: boolean;

	/** 日志文件目录 */
	private menu: string;

	/** 日志文件名 */
	private file: string;

	/** Winston日志记录器 */
	private logger: winston.Logger;

	/** 日志路径 */
	static logpath: string = "/";

	/**
	 * 创建FileLog78实例
	 * @param filename 日志文件名
	 * @param menu 日志文件目录
	 * @param isAILog 是否为AI日志
	 */
	constructor(filename: string = "7788_%DATE%.log", menu: string = "logs", isAILog: boolean = false) {
		this.file = filename;
		this.menu = menu;
		this.isAILog = isAILog;
		
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

		if (this.isAILog) {
			this.clearAILog();
		} else {
			this.clear();
		}
	}

	/**
	 * 将日志条目写入文件
	 * @param logEntry 日志条目
	 */
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

	/**
	 * 清理旧的日志文件
	 */
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

	/**
	 * 清空AI日志文件
	 */
	private clearAILog(): void {
		const aiLogPath = path.join(this.menu, this.file);
		fs.writeFileSync(aiLogPath, '');
	}

	/**
	 * 从文件名中提取日期
	 * @param filename 文件名
	 */
	private getDateFromFilename(filename: string): Date | null {
		const match = filename.match(/7788_(\d{4}-\d{2}-\d{2})/);
		if (match) {
			return new Date(match[1]);
		}
		return null;
	}
}