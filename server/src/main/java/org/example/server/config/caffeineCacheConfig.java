package org.example.server.config;


import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class caffeineCacheConfig {
    @Bean
    public Cache<String,Object> caffeineCache(){
            return Caffeine.newBuilder()
                    //设置写入后的过期时间
                    .expireAfterWrite(5, TimeUnit.MINUTES )
                    //最大缓存数量
                    .maximumSize(10000)
                    .build();
    }
}
