<template>
  <div class="node-page">
    <div class="card">
      <h2>Node.js 的特点</h2>
      <p>
        Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时，具有以下特点：
      </p>
      <ul>
        <li>
          <strong>单线程事件驱动：</strong> 使用单线程处理异步 I/O 操作，通过事件循环实现高并发。
        </li>
        <li>
          <strong>非阻塞 I/O：</strong> 提高了文件系统、网络等操作的效率。
        </li>
        <li>
          <strong>跨平台：</strong> 支持 Windows、Linux 和 macOS 等操作系统。
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>Node.js 的模块系统</h2>
      <p>
        Node.js 使用 CommonJS 模块系统，支持模块的导入和导出。主要模块类型包括：
      </p>
      <ul>
        <li>
          <strong>核心模块：</strong> 由 Node.js 提供的内置模块，如 <code>fs</code>、<code>http</code>、<code>path</code> 等。
        </li>
        <li>
          <strong>第三方模块：</strong> 通过 npm 安装的模块。
        </li>
        <li>
          <strong>自定义模块：</strong> 开发者自己编写的模块。
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>Node.js 的事件循环</h2>
      <p>
        Node.js 的事件循环是其异步编程的核心。事件循环的主要阶段包括：
      </p>
      <ol>
        <li>
          <strong>Timers 阶段：</strong> 执行 <code>setTimeout</code> 和 <code>setInterval</code> 的回调。
        </li>
        <li>
          <strong>I/O callbacks 阶段：</strong> 执行一些延迟的 I/O 回调。
        </li>
        <li>
          <strong>Idle, prepare 阶段：</strong> 仅供系统内部使用。
        </li>
        <li>
          <strong>Poll 阶段：</strong> 检索新的 I/O 事件，执行与 I/O 相关的回调。
        </li>
        <li>
          <strong>Check 阶段：</strong> 执行 <code>setImmediate</code> 的回调。
        </li>
        <li>
          <strong>Close callbacks 阶段：</strong> 执行一些关闭事件的回调，如 <code>socket.on('close')</code>。
        </li>
      </ol>
      <p>
        事件循环的设计使得 Node.js 能够高效地处理大量并发请求。
      </p>
    </div>

    <div class="card">
      <h2>Node.js 的应用场景</h2>
      <p>
        Node.js 适用于以下场景：
      </p>
      <ul>
        <li>
          <strong>实时应用：</strong> 如聊天应用、在线游戏等。
        </li>
        <li>
          <strong>API 服务：</strong> 构建高性能的 RESTful API。
        </li>
        <li>
          <strong>流式应用：</strong> 如视频流、文件上传等。
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.node-page {
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

h2 {
  font-size: 20px;
  margin-top: 0;
  color: #333;
}

p {
  font-size: 16px;
  line-height: 1.5;
  margin: 10px 0;
}

ul,
ol {
  margin: 10px 0;
  padding-left: 20px;
}

li {
  font-size: 16px;
  line-height: 1.5;
}
</style>