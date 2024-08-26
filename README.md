
<h1 align="center">TsLOG78</h1>



English| [简体中文](./README.cn.md) 
# TSLOG78

## 1. `TSLOG78` Class Documentation

### Overview


`TSLOG78` is a class for encapsulating logging functionality, supporting various types of log output including console output, file output, and server-side output. This class uses the singleton pattern to ensure there is only one instance globally and provides methods for setting different log levels.


### Installation

```bash
npm install @www778878net/TSLOG78
```

### Usage

```typescript
import TSLOG78 from '@www778878net/TSLOG78';

const log = TSLOG78.Instance;
log.setup(serverLogger, fileLogger, consoleLogger, 'admin');
log.log('Hello, world!', 50);
```

### Properties


- `debugKind`: A list of log debugging kinds used to control which types of logs are recorded.
- `LevelFile`, `LevelConsole`, `LevelApi`: Respectively represent the threshold levels for file logs, console logs, and API logs. By default, the console log level is 30, the file log level is 50, and the API log level is 70.
- `serverLogger`, `fileLogger`, `consoleLogger`: Respectively represent the server logger, file logger, and console logger instances.
- `uname`: The username, which defaults to an empty string.


### Methods


- `setup`: Sets up the logger instances.
- `clone`: Creates a clone of the current instance.
- `logErr`: Logs error messages.
- `log`: Logs messages based on the provided parameters. Log levels can be set individually for each class.


### Example

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

// Log a message
log.log('This is a log message.', 50); // Both console and file will output because 50 >= 30 && 50 >= 50

// Log an error message
try {
  throw new Error('Something went wrong!');
} catch (error) {
  log.logErr(error);
}
```

### Other


For more detailed information, please refer to the project's [GitHub repository](https://github.com/www778878net/TsLog78) or the [API documentation](http://www.778878.net/docs/#/koa78/).


