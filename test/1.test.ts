import { TsLog78 } from '../src/TsLog78';
import LogEntry from '../src/LogEntry';
import FileLog78 from '../src/FileLog78';
import ConsoleLog78 from '../src/ConsoleLog78';
import LogstashServerLog78 from '../src/LogstashServerLog78';
import * as fs from 'fs';
import * as path from 'path';

describe('TsLog78 Tests', () => {
    test('TestSingleton', () => {
        const instance1 = TsLog78.Instance;
        const instance2 = TsLog78.Instance;
        expect(instance1).toBe(instance2);
    });

    test('TestSetup', async () => {
        const log = TsLog78.Instance;
        const testEntry = new LogEntry({
            basic: {
                message: "Test setup",
                summary: "Setup Test",
                logLevelNumber: 30,
                logLevel: "INFO"
            }
        });

        await log.infoEntry(testEntry);

        // 检查默认日志文件是否存在
        const defaultLogFile = path.join('logs', '7788_' + new Date().toISOString().split('T')[0] + '.log');
        expect(fs.existsSync(defaultLogFile)).toBe(true);

        const logContent = fs.readFileSync(defaultLogFile, 'utf8');
        expect(logContent).toContain("Test setup");
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

        // 验证日志内容
        const defaultLogFile = path.join('logs', '7788_' + new Date().toISOString().split('T')[0] + '.log');
        const logContent = fs.readFileSync(defaultLogFile, 'utf8');
        expect(logContent).toContain("Test message");
        expect(logContent).toContain("Sunny");
    });

    test('TestErrorWithException', async () => {
        const log = TsLog78.Instance;
        const error = new Error("Test exception");
        await log.error(error);

        // 验证错误日志
        const defaultLogFile = path.join('logs', '7788_' + new Date().toISOString().split('T')[0] + '.log');
        const logContent = fs.readFileSync(defaultLogFile, 'utf8');
        expect(logContent).toContain("Test exception");
        expect(logContent).toContain("ERROR");
    });

    test('TestDetailLog', async () => {
        const logger = TsLog78.Instance;
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