# 绿易坊 - AI 驱动的环保生态

绿易坊面向校园与社区绿色生活场景，围绕闲置物品线下以物易物提供 AI 估价参考、附近匹配、环保知识咨询、绿色行动和社区交流等服务。

本仓库将项目按前后端分目录管理：

| 目录 | 说明 |
| --- | --- |
| [`frontend`](./frontend) | Vue 3 + TypeScript + Vite 网页端，包含生态观察、闲置绿洲、绿色行动、智能助手、环保圈和个人中心等界面。 |
| [`backend`](./backend) | Java 17 + Spring Boot 后端，提供环保咨询、图文估价、附近闲置物查询、任务、社区、消息和用户等接口服务。 |

## 本地开发

前端：

```powershell
cd frontend
pnpm install
pnpm dev
```

后端：

```powershell
cd backend
.\mvnw.cmd clean package -DskipTests
.\mvnw.cmd -pl server spring-boot:run
```

后端运行需要 JDK 17、MySQL 和 Redis。模型服务、数据库、对象存储和邮件服务均通过环境变量配置，变量清单见 [`backend/README.md`](./backend/README.md)。前端通过 `frontend/.env.development` 或 `frontend/.env.production` 设置接口服务地址。

## 说明

AI 估价用于帮助用户理解物品的相对价值并协商交换，不构成成交报价或专业鉴定结论。提交代码前请确认不包含真实服务密钥、生产账号、个人信息或未获授权的数据。
