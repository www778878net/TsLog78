// test/1.test.ts

import { TsLog78 } from '../src/TsLog78';
import ConsoleLog78 from '../src/ConsoleLog78';
import IFileLog78 from '../src/IFileLog78';
import IServerLog78 from '../src/IServerLog78';

// Mock implementations for testing
class MockServerLog78 implements IServerLog78 {
  logToServer(message: string, key1: string, level: number, key2: string, key3: string, content: string, key4: string, key5: string, key6: string): void {
    console.log(`Mock Server   Log: ${message}`);
  }
}

class MockFileLog78 implements IFileLog78 {
  menu: string = "test";
  logToFile(info: string): void {
    console.log(`Mock File Log: ${info}`);
  }

  clear(): void {
    console.log('Mock File Log: Clear');
  }
}

describe('TsLog78', () => {
  let tsLog78: TsLog78;
  let mockServerLog78: MockServerLog78;
  let mockFileLog78: MockFileLog78;
  let consoleLog78: ConsoleLog78;

  beforeEach(() => {
    mockServerLog78 = new MockServerLog78();
    mockFileLog78 = new MockFileLog78();
    consoleLog78 = new ConsoleLog78();
    tsLog78 = TsLog78.Instance;
    tsLog78.setup(mockServerLog78, mockFileLog78, consoleLog78, 'testUser');

    // 设置模拟函数
    jest.spyOn(mockServerLog78, 'logToServer');
    jest.spyOn(mockFileLog78, 'logToFile');
    jest.spyOn(consoleLog78, 'writeLine');
  });

  afterEach(() => {
    // 清除模拟函数的调用历史
    jest.clearAllMocks();
  });

  it('should create a single instance via the singleton pattern', () => {
    expect(TsLog78.Instance).toBe(tsLog78);
  });

  it('should log a message with a specific level', () => {
    const spyServerLog = jest.spyOn(mockServerLog78, 'logToServer');
    const spyFileLog = jest.spyOn(mockFileLog78, 'logToFile');
    const spyConsoleLog = jest.spyOn(consoleLog78, 'writeLine');

    tsLog78.log('Test Message', 70, 'testKey', 'testKey2', 'testUser', 'testContent');

    expect(spyServerLog).toHaveBeenCalled();
    expect(spyFileLog).toHaveBeenCalled();
    expect(spyConsoleLog).toHaveBeenCalled();
  });

  it('should not log a message when level is below the threshold', () => {
    const spyServerLog = jest.spyOn(mockServerLog78, 'logToServer');
    const spyFileLog = jest.spyOn(mockFileLog78, 'logToFile');
    const spyConsoleLog = jest.spyOn(consoleLog78, 'writeLine');

    tsLog78.log('Test Message', 25, 'testKey', 'testKey2', 'testUser', 'testContent');

    expect(spyServerLog).not.toHaveBeenCalled();
    expect(spyFileLog).not.toHaveBeenCalled();
    expect(spyConsoleLog).not.toHaveBeenCalled();
  });

  it('should log an error message', () => {
    const spyServerLog = jest.spyOn(mockServerLog78, 'logToServer');
    const spyFileLog = jest.spyOn(mockFileLog78, 'logToFile');
    const spyConsoleLog = jest.spyOn(consoleLog78, 'writeLine');

    const error = new Error('Test Error');
    tsLog78.logErr(error);

    expect(spyServerLog).toHaveBeenCalled();
    expect(spyFileLog).toHaveBeenCalled();
    expect(spyConsoleLog).toHaveBeenCalled();
  });
});