# 🚀 AI 开发注意事项

## 📝 提示词

### 🎯 项目介绍

我正在开发一个飞书多维表格的侧边栏插件，该插件将通过 iframe 形式嵌入到多维表格界面中，从而能够调用影刀「AI工作流」。现在提供的项目是基于别人提供插件的 Demo 项目代码模板，已在多维表格中正常展示。我的目标是让你熟悉该插件的整体开发结构，并在此基础上开发我自己的插件。

### ✨ 项目特点

- 📌 以 iframe 形式嵌入多维表格界面
- ✅ 已完成基础环境搭建和展示功能
- 🔧 可作为后续开发的基础模板

### 📂 项目目录结构

- 以下是项目目录结构，请仔细阅读理解，方便后续开发项目。

```
📁 lark-base-plugin-sidebar-template
├── 📝 项目配置文件
│   ├── .gitignore               # Git忽略文件配置
│   ├── package.json             # 项目依赖配置
│   ├── vite.config.js           # Vite构建配置
│   ├── tsconfig.json            # TypeScript主配置
│   └── tsconfig.node.json       # Node.js TypeScript配置
│
├── 📚 文档说明
│   ├── LICENSE                  # 开源许可证
│   ├── README.md                # 项目说明文档
│   ├── README-AI.md             # AI开发文档
│   ├── aipower-api-docs.md      # 影刀API文档
│   └── lark-base-plugin-docs.md # 飞书插件文档
│
├── 🔧 类型声明
│   ├── auto-imports.d.ts        # API自动导入类型
│   ├── components.d.ts          # 组件自动导入类型
│   └── env.d.ts                 # 环境变量类型
│
├── 📖 API文档
│   └── lark-help/              # 飞书API文档
│       ├── help-md/            # SDK使用指南
│       └── help-ts/            # SDK类型定义
│
├── 🌐 公共资源
│   ├── index.html              # HTML入口
│   └── public/                 # 静态资源
│
└── 💻 源代码
    └── src/                    # 源码目录
        ├── App.vue             # 根组件
        ├── main.js             # 入口文件
        ├── assets/             # 静态资源
        ├── locales/            # 国际化配置
        └── views/              # 页面组件
            └── Form.vue        # 主页面
```

### 🛠️ 主要技术栈

- 🖥️ Vue 3：使用 `<script setup>` 语法
- 🎨 Element-Plus
- 📘 TypeScript
- 🌍 vue-i18n
- ⚡ Vite
- 📄 HTML
- 🎯 CSS

### 📦 项目已集成

- 🔄 unplugin-auto-import
- 🧩 unplugin-vue-components
  用于 Vue 相关 API 的自动导入和组件注册

参考文档

1. help-ts - API 类型定义文件

- 包含完整的 TypeScript 类型声明
- 用于类型检查和代码提示

2. help-md - API 使用指南

- 详细的接口说明
- 具体的使用方法

开发目标

1. 熟悉项目基础

- 理解项目结构和运行机制
- 掌握 API 类型定义和使用方法
- 了解 Demo 项目的实现方式

2. 功能开发要求

- 基于提供的 API 实现新功能
- 确保 TypeScript 类型安全
- 遵循 Vue 3 + Element-Plus 最佳实践
- 保证 iframe 环境下的正常运行

3. 代码实现规范

- 提供完整的代码方案
- 添加必要的代码注释
- 说明关键实现细节
- 注意可能的兼容性问题

特别说明
由于插件运行在 iframe 环境中，开发时需要特别注意：

- iframe 相关的使用限制
- 与多维表格的通信机制
- 可能的兼容性问题

### 🎨 主题设置

多维表格的主题色是：`#0442d2`

- 按钮的背景色和文字的高亮都用这个主题色

## 🔄 兼容性

### 🌍 国际化文案

- 🇺🇸 英文
  - 默认语言，在当前多维表格语言为非中文和日文时，默认使用英文
- 🇨🇳 中文
- 🇯🇵 日文


# 🙋‍本次需求实现的提示词

## 功能1：授权token保存
影刀AI Power Token是必填选项，用户需要在插件设置中填写，点击保存可以保存该token，下次打开无需填写。
点击链接可以跳转到影刀AI Power Token的获取页面。网址链接为https://ying-dao.feishu.cn/wiki/ONjywYIVtia98DkqsCzclWV9n3a

## 功能2：表格数据获取
用户可以在数据表的下拉菜单中选择需要操作的表格，点击获取可以获取表格结构等数据。

## 功能3：影刀AI Power工作流选择
在用户已经填写了AI Power Token的情况下会自动获取影刀AI Power工作流列表。用户也可以点击刷新按钮重新获取。
用户可以在影刀AI Power工作流的下拉菜单中选择需要执行的工作流，选择后自动查询工作流的输入、输出参数。

## 功能4：选择多维表格字段作为AI工作流的输入输出参数
根据输入、输出参数自动生成AI Power参数和多维表格字段的映射关系设置列表，用户可以设置参数和多维表格字段的映射关系。
输入参数为必填项，读取对应的多维表格字段作为AI Power工作流的输入参数。
输出参数为可选项，将AI Power工作流的输出参数填写到对应的多维表格字段中。

## 功能5：执行影刀AI Power工作流
用户可以点击执行按钮，执行影刀AI Power工作流。
执行过程中会显示执行进度和执行结果。
执行成功后，会将AI Power工作流的输出参数填写到对应的多维表格字段中。