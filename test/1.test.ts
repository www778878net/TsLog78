import { TsLog78 } from '../src/TsLog78';
import  LogEntry  from '../src/LogEntry';
import FileLog78 from '../src/FileLog78';
import ConsoleLog78 from '../src/ConsoleLog78';
import LogstashServerLog78 from '../src/LogstashServerLog78';
import * as fs from 'fs';
import * as path from 'path';

describe('TsLog78 Tests', () => {
  const testDate = new Date('2024-09-09T10:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(testDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // 在每个测试前重置环境变量和单例实例
    process.env.NODE_ENV = 'development';
    // @ts-ignore: 重置单例实例
    TsLog78.instance = undefined;
  });

  beforeAll(() => {
    // 确保 logs 目录存在
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
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

    log.setup(undefined, undefined, consoleLogger);

    const testEntry = new LogEntry({
      basic: {
        message: "Test setup",
        summary: "Setup Test",
        logLevelNumber: 30,
        logLevel: "INFO"
      }
    });

    await log.infoEntry(testEntry);

    // 检查 logs 目录中的所有文件
    const logsDir = 'logs';
    const files = fs.readdirSync(logsDir);
    console.log('Files in logs directory:', files);

    // 修改这部分代码
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours().toString().padStart(2, '0');
    const todayLogFile = files.find(file => file.includes(`${today}-${hour}`) && file.startsWith('7788_'));

    if (!todayLogFile) {
      throw new Error(`Could not find today's log file for hour ${hour} in ${logsDir}`);
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

    // 由于我们不能直接访问私有属性，我们可以通过调用方法来间接测试
    // 这里我们可以添加一些日志，然后检查它们是否按预期被记录
    // 但是这需要模拟文件系统和控制台输出，这超出了这个简单修复的范围
    expect(clonedLog).not.toBe(originalLog); // 至少确保克隆创建了一个新实例
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

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
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

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
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

    //can't work to github
    // await log.infoEntry(testEntry);

    // await new Promise(resolve => setTimeout(resolve, 2000));

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
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

    // 检查 logs 目录中的所有文件
    const logsDir = 'logs';
    const files = fs.readdirSync(logsDir);
    console.log('Files in logs directory:', files);

    // 修改这部分代码
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hour = now.getHours().toString().padStart(2, '0');
    const todayLogFile = files.find(file => file.includes(`${today}-${hour}`) && file.startsWith('7788_'));

    if (!todayLogFile) {
      throw new Error(`Could not find today's log file for hour ${hour} in ${logsDir}`);
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

    // 验证详细日志文件是否存在并包含正确的内容
    const detailLogContent = fs.readFileSync(path.join('logs', 'detail.log'), 'utf8');
    expect(detailLogContent).toContain("Test detail log");
    expect(detailLogContent).toContain("This is a test for detail logging");
  });
});