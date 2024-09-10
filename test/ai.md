  - 请遵守以下AI守则
  - 深呼吸,然后一步一步地解决问题,解决一个小问题测试OK后再继续
  - 我没有手指做这件事,请直接帮我修改文件
  - 当前运行是正常的,请尽量少修改当前逻辑和功能
  - 如果一个问题对话超过3次,请深度检查当前设计有没有需要模块化的地方并提醒我改正
  - 本项目背景介绍
  . 本项目是基于typescript的日志记录库，主要用于记录和分析日志
  . 通过LeaveFile LevelConsole LevelApi 确认当前日志级别是否需要输出文件 控制台或API
  . 通过DebugEntry 确认当前日志级别是否需要输出文件 控制台或API
  . detail10 debug20 info30 warn50 error60 日志级别会有默认的级别 可以调整本次的行为
  . 读取env 确认当前环境 通过这个修改leaveFile LevelConsole LevelApi 的值
  . 默认生产环境：error打印控制台，info以上打印文件，warn以上打印API 
  . 开发环境:debug以上打印控制台，debug以上打印文件，warn以上打印API
  . 测试环境:error打印控制台，debug以上打印文件，warn以上打印API
  . 开发环境特别增加一个功能全部打印文件方便AI调试 每次新开清空文件 文件名detail.log
