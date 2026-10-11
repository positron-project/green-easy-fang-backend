import request from "@/utils/request";
import type { userInfoDataType, attentionListDataResponesDataType, creativeListDataResponesDataType, changeFavoriteDataType, userCountDataResponesDataType } from "./type";

export const API = {
    SAVE_USER_INFO: 'user/userupdate',
    // 获取关注列表
    GET_ATTENTION_LIST: 'user/followslist',
    // 获取用户创作列表
    GET_CREATIVE_LIST: 'forum/ForumChoicenessList',
    // 删除用户创作
    DELETE_CREATIVE: 'forum/delateForumChoiceness',
    // 获取收藏列表
    GET_FAVORITE_LIST: 'shop/collectionShop',
    // 切换收藏状态
    CHANGE_FAVORITE: 'shop/mine/favorite/change',
    // 获取发布列表
    GET_RELEASE_LIST: 'shop/myShop',
    // 删除发布
    DELETE_RELEASE: 'shop/deleteShop',
    // 获取用户数据
    GET_COUNT: 'user/greenleafandfollows',
};

export const reqSaveUserInfo = (data: FormData | userInfoDataType) => request.post<any, any>(API.SAVE_USER_INFO, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// 获取关注列表数据
export const reqGetAttentionList = (data: number) => request.get<any, attentionListDataResponesDataType>(API.GET_ATTENTION_LIST, { params: { userId: data } })

// 获取用户创作列表数据
export const reqGetCreativeList = (data: number) => request.get<any, creativeListDataResponesDataType>(API.GET_CREATIVE_LIST, { params: { userId: data } })

// 删除用户创作
export const reqDeleteCreative = (data: number) => request.post<any, any>(API.DELETE_CREATIVE, { id: data })

// 获取收藏列表数据
export const reqGetFavoriteList = () => request.get<any, any>(API.GET_FAVORITE_LIST)

// 切换收藏状态
export const reqChangeFavorite = (data: changeFavoriteDataType) => request.post<any, any>(API.CHANGE_FAVORITE, data)

// 获取发布列表数据
export const reqGetReleaseList = () => request.get<any, any>(API.GET_RELEASE_LIST)

// 删除发布
export const reqDeleteRelease = (data: number) => request.post<any, any>(API.DELETE_RELEASE, { shopId: data })

// 获取用户数据
export const reqUserCount = (data: number) => request.get<any, userCountDataResponesDataType>(API.GET_COUNT, { params: { userId: data } })
