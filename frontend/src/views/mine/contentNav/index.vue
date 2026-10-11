<script setup lang="ts">
import { EditPen, Document, Setting, Star } from '@element-plus/icons-vue'
import type { ContentSettingType } from '../style/mine'

// 定义要发射的事件
const emit = defineEmits<{
    (e: 'changeSetting'): void
    (e: 'changeShowSetting', type: ContentSettingType): void
}>()

const switchSetting = () => {
    emit('changeSetting')
}

const switchShowSetting = (type: ContentSettingType) => {
    emit('changeShowSetting', type)
}
</script>

<template>
    <el-col :span="12">
        <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item @click="switchShowSetting('我的发布')" index="1">
                <el-icon>
                    <Document />
                </el-icon>
                <span>我的发布</span>
            </el-menu-item>
            <el-menu-item @click="switchShowSetting('我的收藏')" index="2">
                <el-icon>
                    <Star />
                </el-icon>
                <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item @click="switchShowSetting('我的创作')" index="3">
                <el-icon>
                    <EditPen />
                </el-icon>
                <span>我的创作</span>
            </el-menu-item>
            <el-menu-item @click="switchSetting" index="4">
                <el-icon>
                    <Setting />
                </el-icon>
                <span>个人资料</span>
            </el-menu-item>
        </el-menu>
    </el-col>
</template>

<style scoped lang="scss">
.el-menu-vertical-demo {
    width: 190px; // 设置菜单宽度
    font-size: 16px; // 调整字体大小
    border-radius: 20px;
    border-right: none; // 取消右侧竖线

    .el-menu-item:not(.is-disabled):hover {
        font-weight: 700;
        border-radius: 20px;
        background-color: #a7e8b0; // 悬停背景色
    }

    .el-menu-item.is-active {
        font-weight: 700;
        border-radius: 20px;
        background-color: #67e378; // 激活项背景色
        color: inherit !important; // 取消文字激活颜色

        .el-icon {
            color: inherit !important; // 取消图标激活颜色
        }
    }

}
</style>