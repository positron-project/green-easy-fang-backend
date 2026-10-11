import { defineStore } from 'pinia'
import type { UserState } from '@/store/type'
import { reqLogin, reqUserInfo } from '@/api/login/index'
import type { loginDataType, userInfoDataType } from '@/api/login/type'
import avatar from '@/assets/mine/iniTavatar.jpg'
import { useWebSocketStore } from '@/store/websocket'

// 定义用户仓库
let useUserStore = defineStore('User', {
    //状态
    state: (): UserState => {
        const savedUserInfo = localStorage.getItem('USER_INFO');
        const defaultUserInfo = {
            id: 0,
            accountId: 0,
            username: '环保卫士',
            gender: '男',
            avatar: avatar,
            youxiang: '',
            region: '',
            regions: '',
        };

        if (savedUserInfo) {
            const parsedInfo = JSON.parse(savedUserInfo);
            Object.assign(defaultUserInfo, parsedInfo);
        }
        return defaultUserInfo;
    },

    actions: {
        //登录方法
        async userLogin(loginData: loginDataType) {
            try {
                const result = await reqLogin(loginData)
                // console.log(result.data);
                if (result.code == 200) {
                    // 存储到本地
                    localStorage.setItem('TOKEN', result.data)
                    return 'ok'
                } else {
                    return Promise.reject(new Error(result.message))
                }
            } catch (error) {
                return Promise.reject(error)
            }
        },
        // 获取用户信息（对 result.data 判空，避免中断）
        async getUserInfo() {
            try {
                const result: userInfoDataType = await reqUserInfo(this.youxiang)

                if (result.code !== 200) {
                    return Promise.reject(new Error(result.message))
                }

                const data = result.data as userInfoDataType['data'] | null
                if (!data) {
                    // 后端暂时没返回用户数据，不更新、不报错
                    return
                }

                // 有值才覆盖，避免把默认值清空
                if (data.id) this.id = data.id
                if (data.accountId) this.accountId = data.accountId
                if (data.username) this.username = data.username
                if (data.gender) this.gender = data.gender
                if (data.avatar) this.avatar = data.avatar
                this.region = data.region || this.region
                this.regions = data.regions || this.regions

                const userInfoToSave = {
                    id: this.id,
                    accountId: this.accountId,
                    username: this.username,
                    gender: this.gender,
                    avatar: this.avatar,
                    youxiang: this.youxiang,
                    region: this.region,
                    regions: this.regions
                }
                localStorage.setItem('USER_INFO', JSON.stringify(userInfoToSave))
            } catch (error) {
                return Promise.reject(error)
            }
        },

        // 退出登录
        userLogout() {
            useWebSocketStore().disconnect()
            localStorage.removeItem('TOKEN')
            localStorage.removeItem('USER_INFO')
        }
    },
    getters: {
    }
})

export default useUserStore;