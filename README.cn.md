
<h1 align="center">TSLOG78</h1>
<div align="center">
[English](./README.md) | 简体中文
</div>

## 1. `TSLOG78` 类文档

[![License](https://img.shields.io/badge/license-Apache%202-green.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![Test Status](https://github.com/www778878net/TsLog78/actions/workflows/BuildandTest.yml/badge.svg?branch=main)](https://github.com/www778878net/TsLog78/actions/workflows/BuildandTest.yml)
[![QQ群](https://img.shields.io/badge/QQ群-323397913-blue.svg?style=flat-square&color=12b7f5&logo=qq)](https://qm.qq.com/cgi-bin/qm/qr?k=it9gUUVdBEDWiTOH21NsoRHAbE9IAzAO&jump_from=webapi&authKey=KQwSXEPwpAlzAFvanFURm0Foec9G9Dak0DmThWCexhqUFbWzlGjAFC7t0jrjdKdL)


### 概述 Overview


`TSLOG78` 是一个用于封装日志记录功能的类，支持多种类型的日志输出，包括控制台输出、文件输出以及服务器端输出。该类采用单例模式确保全局只有一个实例，并提供了设置不同日志级别的方法。


### 安装 Installation

```bash
npm install @www778878net/TSLOG78
```

### 使用 Usage

```typescript
import TSLOG78 from '@www778878net/TSLOG78';

const log = TSLOG78.Instance;
log.setup(serverLogger, fileLogger, consoleLogger, 'admin');
log.log('Hello, world!', 50);
```

### 属性 Properties


- `debugKind`: 日志调试种类列表，用于控制哪些类型的日志会被记录。
- `LevelFile`, `LevelConsole`, `LevelApi`: 分别表示文件日志、控制台日志和 API 日志的级别阈值。默认情况下，控制台日志级别为 30，文件日志级别为 50，API 日志级别为 70。
- `serverLogger`, `fileLogger`, `consoleLogger`: 分别表示服务器日志记录器、文件日志记录器和控制台日志记录器。
- `uname`: 用户名，默认为空字符串。

### 日志级别使用建议

虽然日志级别是完全可自定义的,但以下是一般使用建议:
- 0-29: 详细的调试信息,通常只在开发环境中使用
- 30-49: 一般信息,可用于跟踪应用程序的正常操作
- 50-69: 警告信息,表示潜在的问题,但不影响主要功能
- 70+: 错误和严重问题,需要立即关注

### 示例: 调整日志级别
```typescript
import TSLOG78 from '@www778878net/TSLOG78';
const log = TSLOG78.Instance;
log.setup(serverLogger, fileLogger, consoleLogger, 'admin');
// 调整控制台日志级别为0,以打印所有日志(用于调试)
log.LevelConsole = 0;
// 调整文件日志级别为60,只记录较严重的警告和错误
log.LevelFile = 60;
// 使用不同级别记录日志
log.log('调试信息', 10); // 只会在控制台输出
log.log('一般信息', 40); // 控制台输出,不会写入文件
log.log('警告', 65); // 控制台和文件都会记录
log.log('错误', 80); // 控制台、文件和API都会记录
```

### 方法 Methods


- `setup`: 设置日志记录器实例。
- `clone`: 创建一个当前实例的克隆。
- `logErr`: 记录错误日志。
- `log`: 根据提供的参数记录日志信息。可以为每个类单独设置日志级别。


### 示例 Example

```typescript
import TSLOG78 from '@www778878net/TSLOG78';
import ServerLOG78 from './ServerLOG78';
import FileLOG78 from './FileLOG78';
import ConsoleLOG78 from './ConsoleLOG78';

const serverLogger = new ServerLOG78();
const fileLogger = new FileLOG78();
const consoleLogger = new ConsoleLOG78();

const log = TSLOG78.Instance;
log.setup(serverLogger, fileLogger, consoleLogger, 'admin');

// 记录一条日志
log.log('This is a log message.', 50); // 控制台和文件都会输出，因为50 >= 30 && 50 >= 50

// 记录一条错误日志
try {
  throw new Error('Something went wrong!');
} catch (error) {
  log.logErr(error);
}
```

### 其他 Other


更多详细信息，请参阅项目的 [GitHub 仓库](https://github.com/www778878net/TsLog78) 或 [API 文档](http://www.778878.net/docs/#/koa78/)。
