// \README.cn.md
<h1 align="center">TSLOG78</h1>
<div align="center">


[English](./README.md) | 简体中文
## 1. `TSLOG78` 类文档

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
</div>