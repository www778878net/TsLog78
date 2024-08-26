"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs")); // 导入 Node.js 的 fs 模块
// 实现 FileLog78 类
class FileLog78 {
    // 构造函数
    constructor(menu) {
        this.menu = menu;
        const idate = new Date().getDate() % 3; // 获取当前日期的天数对 3 取模
        this.file = `${menu}${idate}.txt`; // 文件名
        this.clear(); // 清除日志
    }
    // 将消息写入文件的方法
    logToFile(message) {
        // 使用 async/await 进行异步文件操作
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs.promises.appendFile(this.file, message); // 异步追加到文件
            }
            catch (error) {
                console.error('写入文件时出错:', error); // 错误处理
            }
        }))();
    }
    // 清除日志的方法
    clear() {
        const idate = new Date().getDate() % 3; // 当前日期的天数对 3 取模
        for (let i = 0; i < 3; i++) {
            if (i === idate)
                continue; // 跳过当前日期对应的文件
            const filePath = `${this.menu}${i}.txt`; // 文件路径
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') { // 如果不是文件不存在错误，则打印错误
                    console.error(`删除文件 ${filePath} 失败:`, err);
                }
            });
        }
    }
}
FileLog78.logpath = "/"; // 静态属性
//# sourceMappingURL=FileLog78.js.map