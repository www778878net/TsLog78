import { TsLog78 } from '../src/TsLog78';
import LogEntry from '../src/LogEntry';
import * as fs from 'fs';
import * as path from 'path';

describe('TsLog78 Tests', () => {
    let logger: TsLog78;
    const detailLogPath = path.join('logs', 'detail.log');

    beforeAll(() => {
        // 确保使用单例
        logger = TsLog78.Instance;
        // 设置详细日志文件
        logger.setupDetailFile();
        // FileLogDetail 构造函数会自动清空文件，不需要额外调用 clearDetailLog
    });

    afterEach(() => {
        // 在每个测试后读取 detail.log 的内容
        const detailLogContent = fs.readFileSync(detailLogPath, 'utf8');
        console.log('Detail log content:', detailLogContent);
    });

    test('TestSingleton', () => {
        const instance2 = TsLog78.Instance;
        expect(logger).toBe(instance2);
        logger.detail("TestSingleton detail log");
    });

    test('TestSetup', async () => {
        const testEntry = new LogEntry({
            basic: {
                message: "Test setup",
                summary: "Setup Test",
                logLevelNumber: 30,
                logLevel: "INFO"
            }
        });

        await logger.infoEntry(testEntry);
        logger.detail("TestSetup detail log");

        const logFilePath = path.join('logs', `7788_${new Date().toISOString().split('T')[0]}.log`);
        expect(fs.existsSync(logFilePath)).toBe(true);

        const logContent = fs.readFileSync(logFilePath, 'utf8');
        expect(logContent).toContain("Test setup");
    });

    test('TestCustomLogEntry', async () => {
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

        await logger.infoEntry(customEntry);
        logger.detail("TestCustomLogEntry detail log");

        const logFilePath = path.join('logs', `7788_${new Date().toISOString().split('T')[0]}.log`);
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        expect(logContent).toContain("Test message");
        expect(logContent).toContain("Sunny");
    });

    test('TestErrorWithException', async () => {
        const error = new Error("Test exception");
        await logger.error(error);
        logger.detail("TestErrorWithException detail log");

        const logFilePath = path.join('logs', `7788_${new Date().toISOString().split('T')[0]}.log`);
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        expect(logContent).toContain("Test exception");
        expect(logContent).toContain("ERROR");
    });

    test('TestDetailLogger', async () => {
        logger.setupDetailFile(); // 确保详细日志记录器被设置
        
        await logger.debug("Debug message");
        await logger.info("Info message");
        await logger.warn("Warn message");
        await logger.error("Error message");
        logger.detail("TestDetailLogger log");

        const detailLogContent = fs.readFileSync(detailLogPath, 'utf8');
        expect(detailLogContent).toContain("Debug message");
        expect(detailLogContent).toContain("Info message");
        expect(detailLogContent).toContain("Warn message");
        expect(detailLogContent).toContain("Error message");
        expect(detailLogContent).toContain("TestDetailLogger log");
    });
});