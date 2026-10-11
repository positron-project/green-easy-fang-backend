# 绿易坊后端

绿易坊是面向校园和社区绿色生活场景的环保应用。本仓库提供后端服务，支持环保咨询、图文估价、附近闲置物查询、绿色行动、社区内容、即时消息和用户管理等能力，为线下以物易物提供价值参考和就近匹配支撑。

## 技术栈

- Java 17、Spring Boot、Maven
- MyBatis-Plus、MySQL、Redis
- LangChain4j 兼容模型服务与 SSE 流式输出
- 阿里云 OSS、WebSocket、邮件服务

## 模块说明

| 模块 | 说明 |
| --- | --- |
| `pojo` | 领域实体、数据传输对象和视图对象 |
| `common` | 公共配置、工具类、统一响应与异常处理 |
| `server` | 接口、业务服务、数据访问、AI 编排与消息能力 |

## 本地运行

1. 准备 JDK 17、MySQL 和 Redis。
2. 按需设置下方环境变量；不要将真实密钥或生产连接信息提交到仓库。
3. 在仓库根目录执行：

```powershell
.\mvnw.cmd clean package -DskipTests
.\mvnw.cmd -pl server spring-boot:run
```

`server/src/main/resources/application.yml` 已使用环境变量配置模型服务、数据库、Redis、对象存储与邮件服务。常用变量包括：

```text
JWT_SECRET
QWEN_API_KEY
DOUBAO_API_KEY
MYSQL_URL
MYSQL_USERNAME
MYSQL_PASSWORD
REDIS_HOST
REDIS_PORT
REDIS_PASSWORD
ALIYUN_OSS_ENDPOINT
ALIYUN_OSS_ACCESS_KEY_ID
ALIYUN_OSS_ACCESS_KEY_SECRET
ALIYUN_OSS_BUCKET_NAME
BAIDU_MAP_AK
```

## 说明

图文估价结果用于辅助用户理解物品相对价值与协商交换，不构成成交报价或专业鉴定结论。生产部署应使用独立的环境变量管理、最小权限账号和脱敏日志策略。
