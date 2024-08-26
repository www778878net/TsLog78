// src/ConsoleLog78.ts

import IConsoleLog78 from "./IConsoleLog78";

export default class ConsoleLog78 implements IConsoleLog78 {
  public writeLine(message: string): void {
    console.log(message);
  }
}
