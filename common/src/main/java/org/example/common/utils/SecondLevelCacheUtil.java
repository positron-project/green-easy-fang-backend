package org.example.common.utils;

import com.github.benmanes.caffeine.cache.Cache;
import jakarta.annotation.Resource;
import org.example.pojo.entity.NullValueHolder;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class SecondLevelCacheUtil {
    private static final String X="Cach:";
    private static final String X1="Cach1:";
    private final NullValueHolder nullValueHolder = NullValueHolder.getInstance();
    @Resource
    private Cache<String,Object> caffeineCache;
    @Resource
    private RedisTemplate<String,Object> redisTemplate;
    @Resource
    private RedisBloomFilterUtil redisBloomFilterUtil;

    public Object get(String key){
        //先看布隆过滤器是否存在
        if(!redisBloomFilterUtil.exists(key)){
            //布隆过滤器不存在，直接返回空值
            return null;
        }
        //存在就去caffeine找
        //看本地caffeine
        Object obj =caffeineCache.getIfPresent(X+key);
        if(obj!=null){
            if(obj==nullValueHolder.getInstance()){
                return null;
            }
            System.out.println("1级缓存");
            return obj;
        }
        //本地没有看分布式redis
        //有就往caffeine里面写并返回
        obj = redisTemplate.opsForValue().get(X1 + key);
        if(obj!=null){
            if(obj==nullValueHolder.getInstance()){
                caffeineCache.put(X+key,nullValueHolder.getInstance());
            }
            
            return obj;
        }
        //都没有返回null，去server层的mysql找
        return null;

    }
    //sql查完写入
    public void put(String key, Object obj , Long time, TimeUnit timeUnit){
        if(obj==null){
            redisBloomFilterUtil.add(key);
            caffeineCache.put(X+key,nullValueHolder.getInstance());
            redisTemplate.opsForValue().set(X1+key,nullValueHolder.getInstance(),time,timeUnit);
            return;
        }
        redisBloomFilterUtil.add(key);
        caffeineCache.put(X+key,obj);
        redisTemplate.opsForValue().set(X1+key,obj,time,timeUnit);

    }
    public void delete(String key){
        caffeineCache.invalidate(X+key);
        redisTemplate.delete(X1+key);


    }


}
