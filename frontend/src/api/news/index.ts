import request from "@/utils/request";
import type { chatListDataResponseDataType, historyResponseDataType } from "./type";

export const API = {
    CHAT_LISTDATA: '/userMessage/conversations',
    NEW_ISFOLLOWING: '/user/follows',
    NEW_GET_HISTORY: '/userMessage/history',
};

// 获取聊天列表数据
export const reqChatListData = (data: number) => request.get<any, chatListDataResponseDataType>(API.CHAT_LISTDATA, { params: { userId: data } });

// 关注/取消关注用户
export const reqIsFollowing = (data: number) => request.get<any, any>(API.NEW_ISFOLLOWING, { params: {userId: data} });

// 获取聊天记录
export const reqGetHistory = (currentUserId: number, otherUserId: number) => request.get<any, historyResponseDataType>(API.NEW_GET_HISTORY, { params: { currentUserId, otherUserId } });
