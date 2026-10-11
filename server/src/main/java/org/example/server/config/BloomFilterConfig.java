package org.example.server.config;

import org.example.common.utils.RedisBloomFilterUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;

/**
 * 布隆过滤器配置类
 * 用于在应用启动时初始化 RedisBloom 过滤器
 */
@Configuration
public class BloomFilterConfig {
    private static final Logger logger = LoggerFactory.getLogger(BloomFilterConfig.class);

    @Resource
    private RedisBloomFilterUtil bloomFilterUtil;

    /**
     * 初始化布隆过滤器
     * 在应用启动时执行（依赖注入完成后）
     */
    @PostConstruct
    public void initBloomFilter() {
        logger.info("开始初始化布隆过滤器...");

        // 初始化布隆过滤器：误判率 0.001，预期元素数量 100000
        // 误判率越低，所需空间越大；预期元素数量越大，所需空间越大
        boolean result = bloomFilterUtil.init(0.001, 100000);

        if (result) {
            logger.info("布隆过滤器初始化成功");
        } else {
            logger.warn("布隆过滤器初始化失败（可能已存在）");
        }
    }
}