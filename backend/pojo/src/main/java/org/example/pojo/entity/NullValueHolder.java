package org.example.pojo.entity;

/**
 * 空值持有者，用于标记缓存中的空值
 * 单例模式实现
 */
public class NullValueHolder {
    // 唯一实例
    private static final NullValueHolder INSTANCE = new NullValueHolder();

    // 私有构造器，防止外部创建实例
    private NullValueHolder() {}

    // 静态方法获取实例
    public static NullValueHolder getInstance() {
        return INSTANCE;
    }
}