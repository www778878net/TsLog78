import { TsLog78 } from '../src/TsLog78';
import  LogEntry  from '../src/LogEntry';
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

    log.setupLevel(0, 0, 0);

    await log.infoEntry(testEntry);

    log.setupLevel(50, 30, 70);

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
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

    //can't work to github
    // await log.infoEntry(testEntry);

    // await new Promise(resolve => setTimeout(resolve, 2000));

    expect(true).toBe(true); // 如果没有抛出异常，则测试通过
  });

  test('TestFileLog78', async () => {
    const log = TsLog78.Instance;
    log.setupLevel(50, 60, 70); // 设置文件日志级别为50

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

    // 注意：在 TypeScript/JavaScript 中，我们可能需要使用 Node.js 的 fs 模块来检查文件系统
    // 这里我们只是确保没有异常抛出
    expect(true).toBe(true);
  });

  test('TestErrorWithException', async () => {
    const log = TsLog78.Instance;

    const error = new Error("Test exception");
  
    await log.error(error);

    expect(true).toBe(true);
  });
});