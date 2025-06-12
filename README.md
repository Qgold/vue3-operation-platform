# My Vue3 App

一个基于 Vue 3 + Vite 构建的现代化企业级管理系统，集成了多个业务模块和先进技术特性。

## 🚀 特性

- 📦 基于 Vue 3 + Vite，享受极速开发体验
- 🎨 集成多种图表组件，包括折线图、饼图、雷达图等
- 🌐 国际化支持（中文、繁体中文、英文）
- 🔒 完整的权限管理系统
- 💼 丰富的业务模块（客户管理、供应链、数据监控等）
- 🎯 WebAssembly 集成示例
- 📊 数据可视化展示
- 🎉 自定义组件库（日历、时钟、上传等）

## 🛠 技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- 路由管理：Vue Router
- 状态管理：Vuex/Pinia
- UI 框架：Element Plus
- 图表库：ECharts
- WebAssembly：AssemblyScript
- HTTP 客户端：Axios
- CSS 预处理：Less
- CSS 框架：Tailwind CSS

## 📚 主要模块

### 🏢 系统管理

- 组织架构管理
- 用户权限管理
- 操作日志
- 系统设置

### 👥 客户管理

- CRM 系统集成
- 工单系统
- 客户数据 Excel 导出

### ⛓ 供应链管理

- 供应商管理
- 库存管理
- 物流跟踪

### 📊 数据分析

- 数据监控
- 趋势分析
- 预警机制

### 🎯 营销推广

- 活动管理
- 渠道管理
- 用户触达

## 🚀 快速开始

1. 克隆项目
   \`\`\`bash
   git clone [项目地址]
   \`\`\`

2. 安装依赖
   \`\`\`bash
   npm install
   \`\`\`

3. 启动开发服务器
   \`\`\`bash
   npm run dev
   \`\`\`

4. 构建生产版本
   \`\`\`bash
   npm run build
   \`\`\`

## 📦 Docker 部署

项目提供了 Docker 支持，可以通过以下命令快速部署：

\`\`\`bash
docker build -t my-vue3-app .
docker run -p 80:80 my-vue3-app
\`\`\`

## 🔧 配置说明

- 环境变量配置在 \`.env\` 文件中
- Nginx 配置在 \`nginx.conf\` 中
- Vite 配置在 \`vite.config.js\` 中
- Tailwind 配置在 \`tailwind.config.js\` 中

## 📝 开发规范

- 使用 Vue 3 组合式 API
- 遵循 ESLint 规范
- 组件使用 PascalCase 命名
- 使用 TypeScript 编写 WebAssembly 模块

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request

## 📄 许可证

[MIT License](LICENSE)
