<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/user'
import type { attentionListDataType, attentionListDataResponesDataType } from '@/api/mine/type'
import { reqGetAttentionList } from '@/api/mine'
import { reqIsFollowing } from '@/api/news'
import { reqGoChat } from '@/api/exchangeGoods/index'
import { useRouter } from 'vue-router'
const userStore = useUserStore();
const router = useRouter()

// 关注列表数据
const attentionListData = ref<attentionListDataType[]>([])

// 加载状态，防止重复点击
const loadingMap = ref<Record<number, boolean>>({})

// 取消关注
const handleCancelAttention = async (attentionId: number) => {
    // 如果正在加载中，提示用户操作频繁
    if (loadingMap.value[attentionId]) {
        ElMessage.warning('操作频繁，请稍后再试')
        return
    }

    // 设置加载状态
    loadingMap.value[attentionId] = true

    try {
        // 前端立即同步关注状态，避免必须刷新页面
        const target = attentionListData.value.find((item) => item.userId === attentionId)
        if (target) {
            target.isFollow = !target.isFollow
        }
        await reqIsFollowing(attentionId)
    } catch (error) {
        ElMessage.error('取消关注失败，请重试')
    } finally {
        // 无论成功或失败，都清除加载状态
        loadingMap.value[attentionId] = false
    }
}

// 私信
const handlePrivateChat = async (attentionId: number) => {
    const data = {
        senderId: userStore.accountId,
        contactId: attentionId,
    }

    try {
        const res = await reqGoChat(data)
        if (res.code == 200) {
            router.push({
                path: '/news',
            })
        }
    } catch (error) {
        ElMessage.error('私信失败，请重试')
    }
}

// 获取关注列表
const getAttentionList = async () => {
    try {
        const res: attentionListDataResponesDataType = await reqGetAttentionList(userStore.accountId)
        if (res.code === 200) {
            attentionListData.value = res.data
        }
    } catch (error) {
        ElMessage.error('获取关注列表失败，请重试')
    }
}

onMounted(() => {
    getAttentionList()
})

</script>

<template>
    <div class="attentionList">
        <div v-for="item in attentionListData" :key="item.id" class="attentionItem">
            <div class="img_name">
                <img class="attentionImg" :src="item.avatar">
                <div class="attentionUsername">{{ item.name }}</div>
            </div>
            <div class="private_changeAttention">
                <div style="cursor: pointer; margin-right: 10px;" @click="handlePrivateChat(item.userId)">私信</div>
                <div :style="{
                    cursor: 'pointer',
                    width: '70px',
                    height: '30px',
                    lineHeight: '30px',
                    textAlign: 'center',
                    borderRadius: '15px',
                    backgroundColor: item.isFollow ? '#353641' : '#39B54A',
                    color: '#FFFFFF'
                }" @click="handleCancelAttention(item.userId)">
                    {{ item.isFollow ? '已关注' : '关注' }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.attentionList {
    width: 100%;
    height: 400px;
    overflow: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow-y: auto;

    .attentionItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #F5F5F5;

        .img_name {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .attentionImg {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
            }

            .attentionUsername {
                font-size: 16px;
                font-weight: 700;
                margin-left: 10px;
            }
        }

        .private_changeAttention {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
    }
}
</style>