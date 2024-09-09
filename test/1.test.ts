import { TsLog78 } from '../src/TsLog78';
import LogEntry from '../src/LogEntry';
import * as fs from 'fs';
import * as path from 'path';

describe('TsLog78 Tests', () => {
    const getLogFileName = () => {
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        const hour = now.getHours().toString().padStart(2, '0');
        return `7788_${dateString}-${hour}.log`;
    };

    const getLogFilePath = () => path.join('logs', getLogFileName());

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

        // 给文件系统一些时间来写入日志
        await new Promise(resolve => setTimeout(resolve, 1000));

        const logFilePath = getLogFilePath();
        expect(fs.existsSync(logFilePath)).toBe(true);

        const logContent = fs.readFileSync(logFilePath, 'utf8');
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

        // 给文件系统一些时间来写入日志
        await new Promise(resolve => setTimeout(resolve, 1000));

        const logFilePath = getLogFilePath();
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        expect(logContent).toContain("Test message");
        expect(logContent).toContain("Sunny");
    });

    test('TestErrorWithException', async () => {
        const log = TsLog78.Instance;
        const error = new Error("Test exception");
        await log.error(error);

        // 给文件系统一些时间来写入日志
        await new Promise(resolve => setTimeout(resolve, 1000));

        const logFilePath = getLogFilePath();
        const logContent = fs.readFileSync(logFilePath, 'utf8');
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

        // 给文件系统一些时间来写入日志
        await new Promise(resolve => setTimeout(resolve, 1000));

        const detailLogPath = path.join('logs', 'detail.log');
        const detailLogContent = fs.readFileSync(detailLogPath, 'utf8');
        expect(detailLogContent).toContain("Test detail log");
        expect(detailLogContent).toContain("This is a test for detail logging");
    });
});