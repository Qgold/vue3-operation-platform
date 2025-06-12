<template>
  <div class="browser-page">
    <div class="card">
      <h2>浏览器的多进程架构</h2>
      <p>
        现代浏览器通常采用多进程架构，以提高稳定性、安全性和性能。主要的进程包括：
      </p>
      <ul>
        <li>
          <strong>浏览器进程：</strong> 负责界面显示、用户交互、子进程管理和网络请求等。
        </li>
        <li>
          <strong>渲染进程：</strong> 负责将 HTML、CSS 和 JavaScript 转换为用户可以看到的页面内容。每个标签页通常对应一个渲染进程。
        </li>
        <li>
          <strong>GPU 进程：</strong> 负责 3D 绘图和加速渲染。
        </li>
        <li>
          <strong>网络进程：</strong> 负责处理网络资源加载。
        </li>
        <li>
          <strong>插件进程：</strong> 负责运行浏览器插件。
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>输入 URL 后发生了什么？</h2>
      <p>
        当用户在浏览器中输入一个 URL 并按下回车键时，浏览器会经历以下流程：
      </p>
      <ol>
        <li>
          <strong>DNS 解析：</strong> 将域名解析为 IP 地址。
        </li>
        <li>
          <strong>建立连接：</strong> 使用 TCP 协议与服务器建立连接，通常通过 HTTPS 进行加密通信。
        </li>
        <li>
          <strong>发送请求：</strong> 浏览器向服务器发送 HTTP 请求。
        </li>
        <li>
          <strong>服务器响应：</strong> 服务器返回 HTML、CSS、JavaScript 等资源。
        </li>
        <li>
          <strong>渲染页面：</strong> 渲染进程解析 HTML，构建 DOM 树和 CSSOM 树，生成渲染树并绘制页面。
        </li>
      </ol>
    </div>

    <div class="card">
      <h2>浏览器多进程架构与输入 URL 的交互过程</h2>
      <p>
        浏览器的多进程架构在用户输入 URL 并加载页面的过程中，各个进程之间会进行密切的协作。以下是详细的交互过程：
      </p>
      <ol>
        <li>
          <strong>用户输入 URL：</strong> 用户在地址栏中输入 URL 并按下回车键，浏览器进程接收到用户的输入。
        </li>
        <li>
          <strong>网络进程发起请求：</strong> 浏览器进程将 URL 传递给网络进程，网络进程负责进行 DNS 解析，将域名转换为 IP 地址，并与目标服务器建立 TCP 连接（通常是 HTTPS）。
        </li>
        <li>
          <strong>网络进程获取资源：</strong> 网络进程向服务器发送 HTTP 请求，服务器返回 HTML、CSS、JavaScript 等资源。
        </li>
        <li>
          <strong>渲染进程接收资源：</strong> 网络进程将获取到的资源传递给渲染进程。渲染进程开始解析 HTML，构建 DOM 树和 CSSOM 树。
        </li>
        <li>
          <strong>渲染进程构建页面：</strong> 渲染进程将 DOM 树和 CSSOM 树合并为渲染树，进行布局计算（Layout）和绘制（Painting）。
        </li>
        <li>
          <strong>GPU 进程绘制页面：</strong> 如果页面包含复杂的图形或动画，渲染进程会将绘制任务交给 GPU 进程，GPU 进程负责加速渲染。
        </li>
        <li>
          <strong>浏览器进程显示页面：</strong> 渲染完成后，渲染进程将页面内容传递回浏览器进程，浏览器进程将内容显示在用户的屏幕上。
        </li>
      </ol>
      <p>
        <strong>进程之间的通信：</strong>
        浏览器的多进程架构通过 IPC（进程间通信）机制实现进程之间的数据传递。例如，浏览器进程与网络进程之间传递 URL 和资源，渲染进程与 GPU 进程之间传递绘制指令。
      </p>
      <p>
        这种多进程架构的设计提高了浏览器的稳定性和安全性。例如，渲染进程的崩溃不会影响其他标签页，恶意代码也被限制在渲染进程的沙箱中。
      </p>
    </div>

    <div class="card">
      <h2>浏览器缓存机制</h2>
      <p>
        浏览器通过缓存机制提高页面加载速度，减少网络请求。主要的缓存策略包括：
      </p>
      <ul>
        <li>
          <strong>强缓存：</strong> 通过 HTTP 头中的 <code>Expires</code> 和 <code>Cache-Control</code> 实现，无需向服务器发送请求。
        </li>
        <li>
          <strong>协商缓存：</strong> 通过 <code>ETag</code> 和 <code>Last-Modified</code> 实现，浏览器会向服务器验证资源是否更新。
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>浏览器缓存的详细过程</h2>
      <p>
        浏览器缓存是为了提高页面加载速度和减少网络请求的机制。以下是浏览器缓存的详细过程：
      </p>
      <ol>
        <li>
          <strong>检查强缓存：</strong> 浏览器首先检查本地缓存是否有可用的资源。如果资源未过期（根据 <code>Cache-Control</code> 或 <code>Expires</code>），直接从缓存中加载资源，无需向服务器发送请求。
        </li>
        <li>
          <strong>发送请求验证协商缓存：</strong> 如果强缓存失效，浏览器会向服务器发送请求，并附带缓存验证头（如 <code>If-Modified-Since</code> 或 <code>If-None-Match</code>）。
        </li>
        <li>
          <strong>服务器验证缓存：</strong> 服务器根据请求头中的验证信息检查资源是否更新：
          <ul>
            <li>
              如果资源未更新，返回 304 状态码，浏览器继续使用本地缓存。
            </li>
            <li>
              如果资源已更新，返回新的资源和 200 状态码，浏览器更新缓存。
            </li>
          </ul>
        </li>
        <li>
          <strong>存储缓存：</strong> 浏览器将资源存储到本地缓存中，并记录缓存策略（如过期时间或 ETag）。
        </li>
        <li>
          <strong>使用缓存：</strong> 在后续请求中，浏览器根据缓存策略决定是否使用缓存或重新请求资源。
        </li>
      </ol>
      <p>
        <strong>缓存的类型：</strong>
      </p>
      <ul>
        <li>
          <strong>强缓存：</strong> 通过 <code>Cache-Control</code> 和 <code>Expires</code> 实现，无需向服务器发送请求。
        </li>
        <li>
          <strong>协商缓存：</strong> 通过 <code>ETag</code> 和 <code>Last-Modified</code> 实现，浏览器会向服务器验证资源是否更新。
        </li>
      </ul>
      <p>
        通过合理利用浏览器缓存，可以显著提升页面加载速度和用户体验。
      </p>
    </div>

    <div class="card">
      <h2>渲染页面的详细过程</h2>
      <p>
        浏览器渲染页面的过程可以分为以下几个阶段：
      </p>
      <ol>
        <li>
          <strong>构建 DOM 树：</strong> 浏览器解析 HTML，生成 DOM 树。HTML 中的每个标签都会被解析为一个 DOM 节点。
        </li>
        <li>
          <strong>构建 CSSOM 树：</strong> 浏览器解析 CSS，生成 CSSOM（CSS Object Model）树。CSSOM 树描述了样式的层级关系。
        </li>
        <li>
          <strong>合并 DOM 树和 CSSOM 树：</strong> 将 DOM 树和 CSSOM 树合并生成渲染树（Render Tree）。渲染树包含了每个可见元素的样式信息。
        </li>
        <li>
          <strong>布局（Layout）：</strong> 确定每个元素在页面中的位置和大小。这个过程也被称为回流（Reflow）。
        </li>
        <li>
          <strong>绘制（Painting）：</strong> 将渲染树中的每个节点绘制到屏幕上。绘制包括颜色填充、边框绘制、阴影绘制等。
        </li>
        <li>
          <strong>合成（Compositing）：</strong> 如果页面包含复杂的效果（如动画、3D 变换等），浏览器会将页面分成多个图层，并将这些图层合成为最终的页面。
        </li>
      </ol>
      <p>
        在渲染过程中，JavaScript 的执行可能会阻塞 DOM 树的构建，而 CSS 的加载可能会阻塞渲染树的生成。因此，优化资源加载顺序和减少阻塞操作是提升页面性能的关键。
      </p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.browser-page {
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