<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Content from './content/index.vue'
import type { ContentSettingType } from '../style/mine'
import useUserStore from '@/store/user';
import AttentionList from './attentionList/index.vue'
import { reqUserCount } from '@/api/mine'
import type { userCountDataResponesDataType } from '@/api/mine/type'

const props = defineProps<{
    contentSetting: ContentSettingType
}>()

const localContentSetting = ref(props.contentSetting)
const userStore = useUserStore();
// 绿叶点数
const greenPoints = ref(0)
// 关注数
const followCount = ref(0)
// 关注弹窗
const showAttentionDialog = ref(false)

watch(() => props.contentSetting, (newVal) => {
    localContentSetting.value = newVal
})

const handleCloseAttention = () => {
    showAttentionDialog.value = false;
}

// 获取用户数据
const getCountData = async () => {
    try {
        const res: userCountDataResponesDataType = await reqUserCount(userStore.accountId)
        if (res.code == 200) {
            greenPoints.value = res.data.greenPoints
            followCount.value = res.data.followCount
        }
    } catch (error) {
        console.log(error);
    }
}

onMounted(() => {
    getCountData()
})

</script>

<template>
    <div class="box">
        <!-- 用户基础信息 -->
        <div class="top">
            <img class="userImg" :src="userStore.avatar" alt="">
            <div class="text">
                <div class="username">
                    {{ userStore.username || '用户' }}
                </div>
                <div class="more">
                    <el-tooltip class="box-item" effect="dark" content="根据完成的交易和发布的内容计算" placement="bottom">
                        <div class="integral">绿叶点：{{ greenPoints }}</div>
                    </el-tooltip>
                    <div style="cursor: pointer;" @click="showAttentionDialog = true"> <el-tooltip class="box-item"
                            effect="dark" content="点击可查看关注列表" placement="bottom">
                            <div class="trust">关注：{{ followCount }}</div>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>
        <!-- 用户详细数据 -->
        <div class="bottom">
            <Content :content-setting="localContentSetting" />
        </div>

        <el-dialog v-model="showAttentionDialog" width="350px" title="关注列表" :before-close="handleCloseAttention">
            <AttentionList />
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.box {
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 40px;
    background-color: #FFFFFF;


    .top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 60px;
        width: 100%;
        height: 30%;
        border-bottom: 1px solid #F5F5F5;

        .userImg {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #F5F5F5;
            object-fit: cover;
        }

        .text {
            margin-left: 40px;

            .username {
                font-size: 20px;
                font-weight: 700;
            }

            .more {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-top: 20px;

                .integral {
                    width: 80px;
                    border-right: 1.5px solid #E5E5E5;
                    font-size: 14px;
                    color: #666666;
                    margin-right: 20px;
                }

                .trust {
                    width: 80px;
                    font-size: 14px;
                    color: #666666;
                    margin-right: 20px;
                }
            }
        }


    }

    .bottom {
        padding-top: 10px;
        width: 100%;
        height: 70%;
    }
}

.tooltip-base-box {
    width: 600px;
}

.tooltip-base-box .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tooltip-base-box .center {
    justify-content: center;
}

.tooltip-base-box .box-item {
    width: 110px;
    margin-top: 10px;
}
</style>