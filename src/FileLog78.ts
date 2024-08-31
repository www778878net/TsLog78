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

import * as fs from 'fs'; // 导入 Node.js 的 fs 模块
import IFileLog78 from "./IFileLog78";
 

// 实现 FileLog78 类
export default class FileLog78 implements IFileLog78 {
    menu: string;
    file: string;
    static logpath: string = "/"; // 静态属性

    // 构造函数
    constructor(menu: string) {
        this.menu = menu;
        const idate = new Date().getDate() % 3; // 获取当前日期的天数对 3 取模
        this.file = `${menu}${idate}.txt`; // 文件名
        this.clear(); // 清除日志
    }

    // 将消息写入文件的方法
    logToFile(message: string): void {
        // 使用 async/await 进行异步文件操作
        (async () => {
            try {
                await fs.promises.appendFile(this.file, message); // 异步追加到文件
            } catch (error) {
                console.error('写入文件时出错:', error); // 错误处理
            }
        })();
    }

    // 清除日志的方法
    clear(): void {
        const idate = new Date().getDate() % 3; // 当前日期的天数对 3 取模
        for (let i = 0; i < 3; i++) {
            if (i === idate) continue; // 跳过当前日期对应的文件
            const filePath = `${this.menu}${i}.txt`; // 文件路径
            fs.unlink(filePath, (err) => { // 删除文件
                if (err && err.code !== 'ENOENT') { // 如果不是文件不存在错误，则打印错误
                    console.error(`删除文件 ${filePath} 失败:`, err);
                }
            });
        }
    }
}