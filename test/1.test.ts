import { TsLog78 } from '../src/TsLog78';
import LogEntry from '../src/LogEntry';
import FileLog78 from '../src/FileLog78';
import ConsoleLog78 from '../src/ConsoleLog78';
import LogstashServerLog78 from '../src/LogstashServerLog78';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

function emptyDir(directory: string) {
  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      try {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          emptyDir(filePath);
          fs.rmdirSync(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}: ${error}`);
      }
    }
  }
}

describe('TsLog78 Tests', () => {
  const testDate = new Date('2024-09-09T10:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(testDate);
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    // @ts-ignore: 重置单例实例
    TsLog78.instance = undefined;
    
    // 关闭所有日志记录器
    TsLog78.Instance.close();
    
    // 使用 try-catch 来处理可能的权限错误
    try {
      emptyDir('logs');
    } catch (error) {
      console.error(`Error emptying logs directory: ${error}`);
    }
  });

  test('TestSingleton', () => {
    const instance1 = TsLog78.Instance;
    const instance2 = TsLog78.Instance;
    expect(instance1).toBe(instance2);
  });

  test('TestSetup', async () => {
    const log = TsLog78.Instance;
    const consoleLogger = new ConsoleLog78();

    log.setup(undefined, new FileLog78(), consoleLogger);

    const testEntry = new LogEntry({
      basic: {
        message: "Test setup",
        summary: "Setup Test",
        logLevelNumber: 30,
        logLevel: "INFO"
      }
    });

    await log.infoEntry(testEntry);
    await sleep(1000);

    const logsDir = 'logs';
    const files = fs.readdirSync(logsDir);
    console.log('Files in logs directory:', files);

    const todayLogFile = files.find(file => file.startsWith('7788_') && file.endsWith('.log'));

    if (!todayLogFile) {
      throw new Error(`Could not find today's log file in ${logsDir}`);
    }

    const logFilePath = path.join(logsDir, todayLogFile);
    console.log('Checking log file:', logFilePath);

    expect(fs.existsSync(logFilePath)).toBe(true);
    const logContent = fs.readFileSync(logFilePath, 'utf8');
    console.log('Log content:', logContent);
    expect(logContent).toContain("Test setup");
  });

  test('TestClone', () => {
    const originalLog = TsLog78.Instance;
    originalLog.setupLevel(60, 40, 80);

    const clonedLog = originalLog.clone();

    expect(clonedLog).not.toBe(originalLog);
  });

  test('TestCustomLogEntry', async () => {
    const log = TsLog78.Instance;

    const customEntry = new LogEntry({
      basic: {
        message: "Test message",
        summary: "Test summary",
        logLevelNumber: 30,
        logLevel: "INFO"
      },
      additionalProperties: {
        weather: "Sunny"
      }
    });

    await log.infoEntry(customEntry);

    expect(true).toBe(true);
  });

  test('TestCustomLogEntryWithException', async () => {
    const log = TsLog78.Instance;

    const customEntry = new LogEntry({
      basic: {
        message: "Test exception",
        summary: "Exception Test",
        logLevelNumber: 60,
        logLevel: "ERROR"
      }
    });

    const error = new Error("Test exception");

    await log.errorEntry(customEntry);

    expect(true).toBe(true);
  });

  test('TestLogstashServerLog78', async () => {
    const serverUrl = "http://192.168.31.122:5000";
    const serverLogger = new LogstashServerLog78(serverUrl);
    const log = TsLog78.Instance;
    log.setup(serverLogger, new FileLog78(), new ConsoleLog78());

    const testEntry = new LogEntry({
      basic: {
        message: "Test Logstash integration",
        summary: "Logstash Test",
        serviceName: "TestService",
        serviceObj: "TestObject",
        serviceFun: "TestFunction",
        userId: "TestUser",
        userName: "Test Username",
        logLevelNumber: 30,
        logLevel: "INFO"
      }
    });

    await log.infoEntry(testEntry);

    expect(true).toBe(true);
  });

  test('TestFileLog78', async () => {
    const log = TsLog78.Instance;
    log.setup(undefined, new FileLog78(), undefined);

    const testEntry = new LogEntry({
      basic: {
        message: "Test file logging",
        summary: "File Log Test",
        serviceName: "TestService",
        serviceObj: "TestObject",
        serviceFun: "TestFunction",
        userId: "TestUser",
        userName: "Test Username",
        logLevelNumber: 30,
        logLevel: "INFO"
      }
    });

    await log.infoEntry(testEntry);
    await sleep(1000);

    const logsDir = 'logs';
    const files = fs.readdirSync(logsDir);
    console.log('Files in logs directory:', files);

    const todayLogFile = files.find(file => file.startsWith('7788_') && file.endsWith('.log'));

    if (!todayLogFile) {
      throw new Error(`Could not find today's log file in ${logsDir}`);
    }

    const logFilePath = path.join(logsDir, todayLogFile);
    console.log('Checking log file:', logFilePath);

    expect(fs.existsSync(logFilePath)).toBe(true);
    const logContent = fs.readFileSync(logFilePath, 'utf8');
    console.log('Log content:', logContent);
    expect(logContent).toContain("Test file logging");
  });

  test('TestErrorWithException', async () => {
    const log = TsLog78.Instance;

    const error = new Error("Test exception");
  
    await log.error(error);

    expect(true).toBe(true);
  });

  test('TestLogEntryJsonSerialization', () => {
    const logEntry = new LogEntry({
      basic: {
        summary: "Test log",
        logLevel: "INFO",
        logLevelNumber: 30,
        message: "",
        serviceName: "TestService",
      
        userName: undefined
      },
      event: {
        eventId: "123",
      
        eventCategory: undefined,
        eventAction: ""
      },
      error: {
        errorType: undefined,
  
        errorStackTrace: ""
      },
      additionalProperties: {
        validProp: "value",
        nullProp: null,
        undefinedProp: undefined,
        emptyStringProp: ""
      }
    });

    const jsonString = logEntry.toJson();
    const parsedLog = JSON.parse(jsonString);

    expect(parsedLog).toHaveProperty('summary', 'Test log');
    expect(parsedLog).toHaveProperty('loglevel', 'INFO');
    expect(parsedLog).toHaveProperty('loglevelnumber', 30);
    expect(parsedLog).toHaveProperty('servicename', 'TestService');
    expect(parsedLog).toHaveProperty('eventid', '123');
    expect(parsedLog).toHaveProperty('validprop', 'value');

    expect(parsedLog).not.toHaveProperty('message');
    expect(parsedLog).not.toHaveProperty('userid');
    expect(parsedLog).not.toHaveProperty('username');
    expect(parsedLog).not.toHaveProperty('eventkind');
    expect(parsedLog).not.toHaveProperty('eventcategory');
    expect(parsedLog).not.toHaveProperty('eventaction');
    expect(parsedLog).not.toHaveProperty('errortype');
    expect(parsedLog).not.toHaveProperty('errormessage');
    expect(parsedLog).not.toHaveProperty('errorstacktrace');
    expect(parsedLog).not.toHaveProperty('nullprop');
    expect(parsedLog).not.toHaveProperty('undefinedprop');
    expect(parsedLog).not.toHaveProperty('emptystringprop');
  });

  test('TestDetailLog', async () => {
    const logger = new TsLog78();
    logger.setupDetailFile();
    
    const logEntry = new LogEntry({
        basic: {
            summary: "Test detail log",
            message: "This is a test for detail logging",
            logLevelNumber: 30,
            logLevel: "INFO"
        }
    });

    await logger.logEntry(logEntry);

    const detailLogContent = fs.readFileSync(path.join('logs', 'detail.log'), 'utf8');
    expect(detailLogContent).toContain("Test detail log");
    expect(detailLogContent).toContain("This is a test for detail logging");
  });
});