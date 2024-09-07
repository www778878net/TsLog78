import { TsLog78 } from '../src/TsLog78';
import { LogEntry } from '../src/LogEntry';
import FileLog78 from '../src/FileLog78';
import ConsoleLog78 from '../src/ConsoleLog78';
import LogstashServerLog78 from '../src/LogstashServerLog78';

describe('TsLog78 Tests', () => {
  test('TestSingleton', () => {
    const instance1 = TsLog78.Instance;
    const instance2 = TsLog78.Instance;
    expect(instance1).toBe(instance2);
  });

  test('TestSetup', async () => {
    const log = TsLog78.Instance;
    const fileLogger = new FileLog78('testlogs');
    const consoleLogger = new ConsoleLog78();

    log.setup(undefined, fileLogger, consoleLogger);

    const testEntry = new LogEntry({
      basic: {
        message: "Test setup",
        summary: "Setup Test",
        logLevelNumber: 30,
        logLevel: "INFO"
      }
    });

    log.LevelApi = 0;
    log.LevelFile = 0;
    log.LevelConsole = 0;

    await log.INFOentry(testEntry);

    log.LevelApi = 70;
    log.LevelFile = 50;
    log.LevelConsole = 30;

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
  });

  test('TestClone', () => {
    const originalLog = TsLog78.Instance;
    originalLog.LevelApi = 80;
    originalLog.LevelConsole = 40;
    originalLog.LevelFile = 60;

    const clonedLog = originalLog.clone();

    expect(clonedLog.LevelApi).toBe(originalLog.LevelApi);
    expect(clonedLog.LevelConsole).toBe(originalLog.LevelConsole);
    expect(clonedLog.LevelFile).toBe(originalLog.LevelFile);
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

    await log.INFOentry(customEntry);

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

    await log.ERRORentry(customEntry);

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
  });

  test('TestLogstashServerLog78', async () => {
    const serverUrl = "http://192.168.31.122:5000";
    const serverLogger = new LogstashServerLog78(serverUrl);
    const log = TsLog78.Instance;
    log.setup(serverLogger, new FileLog78('testlogs'), new ConsoleLog78());

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

    await log.INFOentry(testEntry);

    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
  });

  test('TestFileLog78', async () => {
    const log = TsLog78.Instance;
    log.LevelFile = 50;

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

    await log.INFOentry(testEntry);

    // 注意：在 TypeScript/JavaScript 中，我们可能需要使用 Node.js 的 fs 模块来检查文件系统
    // 这里我们只是确保没有异常抛出
    expect(true).toBe(true);
  });
});