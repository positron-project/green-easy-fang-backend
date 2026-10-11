package org.example.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisBloomFilterUtil {

    private static final Logger logger = LoggerFactory.getLogger(RedisBloomFilterUtil.class);
    private final StringRedisTemplate redisTemplate;
    private static final String BLOOM_FILTER_KEY = "bloom:cache";

    @Autowired
    public RedisBloomFilterUtil(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 添加元素到布隆过滤器
     */
    public Boolean add(String value) {
        if (value == null) return false;
        try {
            // 使用 execute 方法执行 BF.ADD 命令
            Object result = redisTemplate.execute((connection) -> {
                // 执行 BF.ADD 命令
                return connection.execute("BF.ADD",
                        BLOOM_FILTER_KEY.getBytes(), value.getBytes());
            }, true);
            logger.info("BF.ADD result: {}, type: {}", result, result != null ? result.getClass() : "null");
            // 处理返回值
            if (result == null) {
                return false;
            }
            if (result instanceof Long) {
                return ((Long) result) == 1;
            }
            if (result instanceof byte[]) {
                return "1".equals(new String((byte[]) result));
            }
            return "1".equals(result.toString());
        } catch (Exception e) {
            logger.error("布隆过滤器添加元素异常", e);
            return false;
        }
    }

    /**
     * 判断元素是否存在
     */
    public Boolean exists(String value) {
        if (value == null) return false;
        try {
            // 使用 execute 方法执行 BF.EXISTS 命令
            Object result = redisTemplate.execute((connection) -> {
                // 执行 BF.EXISTS 命令
                return connection.execute("BF.EXISTS",
                        BLOOM_FILTER_KEY.getBytes(), value.getBytes());
            }, true);
            logger.info("BF.EXISTS result: {}, type: {}", result, result != null ? result.getClass() : "null");
            // 处理返回值
            if (result == null) {
                return false;
            }
            if (result instanceof Long) {
                return ((Long) result) == 1;
            }
            if (result instanceof byte[]) {
                return "1".equals(new String((byte[]) result));
            }
            return "1".equals(result.toString());
        } catch (Exception e) {
            logger.error("布隆过滤器判断存在异常", e);
            return false;
        }
    }

    /**
     * 初始化布隆过滤器
     */
    public Boolean init(double errorRate, long capacity) {
        logger.info("初始化布隆过滤器 errorRate:{}, capacity:{}", errorRate, capacity);
        try {
            // 检查布隆过滤器是否存在
            if (redisTemplate.hasKey(BLOOM_FILTER_KEY)) {
                logger.info("布隆过滤器已存在，跳过初始化");
                return true;
            }

            // 使用 execute 方法执行 BF.RESERVE 命令
            Object result = redisTemplate.execute((connection) -> {
                // 执行 BF.RESERVE 命令
                return connection.execute("BF.RESERVE",
                        BLOOM_FILTER_KEY.getBytes(),
                        String.valueOf(errorRate).getBytes(),
                        String.valueOf(capacity).getBytes());
            }, true);
            logger.info("BF.RESERVE result: {}, type: {}", result, result != null ? result.getClass() : "null");
            // 处理返回值
            return result != null && "OK".equals(result.toString());
        } catch (Exception e) {
            logger.error("布隆过滤器初始化异常", e);
            return false;
        }
    }
}