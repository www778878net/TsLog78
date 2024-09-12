import { TsLog78 } from '../src/TsLog78';
import LogEntry from '../src/LogEntry';
import * as fs from 'fs';
import * as path from 'path';

describe('TsLog78 Tests', () => {
    let logger: TsLog78;
    const detailLogPath = path.join('logs', 'detail.log');

    beforeAll(() => {
        console.log('当前工作目录:', process.cwd());
        console.log('logs 目录内容:', fs.readdirSync('logs'));

        logger = TsLog78.Instance;
        logger.setupDetailFile();
        logger.clearDetailLog();

        console.log('detail.log 是否存在:', fs.existsSync(detailLogPath));
    });

    afterEach(() => {
        // 在每个测试后读取 detail.log 的内容
        const detailLogContent = fs.readFileSync(detailLogPath, 'utf8');
        console.log('AI_LOG_SUMMARY:', detailLogContent.split('\n').slice(-5).join('\n'));
    });

    function getLatestLogFile(directory: string): string | null {
        console.log(`正在查找目录: ${directory}`);
        console.log(`目录是否存在: ${fs.existsSync(directory)}`);
        const files = fs.readdirSync(directory);
        console.log(`目录中的文件: ${files.join(', ')}`);
        const logFiles = files.filter(file => file.startsWith('7788_') && file.endsWith('.log'));
        console.log(`找到的日志文件: ${logFiles.join(', ')}`);
        if (logFiles.length === 0) return null;
        return logFiles.sort().reverse()[0]; // 获取最新的日志文件
    }

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

        const latestLogFile = getLatestLogFile('logs');
        expect(latestLogFile).not.toBeNull();
        
        if (latestLogFile) {
            const logFilePath = path.join('logs', latestLogFile);
            expect(fs.existsSync(logFilePath)).toBe(true);

            const logContent = fs.readFileSync(logFilePath, 'utf8');
            expect(logContent).toContain("Test setup");
        }
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

        const latestLogFile = getLatestLogFile('logs');
        expect(latestLogFile).not.toBeNull();
        
        if (latestLogFile) {
            const logFilePath = path.join('logs', latestLogFile);
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            expect(logContent).toContain("Test message");
            expect(logContent).toContain("Sunny");
        }
    });

    test('TestErrorWithException', async () => {
        const error = new Error("Test exception");
        await logger.error(error);
        logger.detail("TestErrorWithException detail log");

        const latestLogFile = getLatestLogFile('logs');
        expect(latestLogFile).not.toBeNull();
        
        if (latestLogFile) {
            const logFilePath = path.join('logs', latestLogFile);
            const logContent = fs.readFileSync(logFilePath, 'utf8');
            expect(logContent).toContain("Test exception");
            expect(logContent).toContain("ERROR");
        }
    });

    test('TestDetailLogger', async () => {
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