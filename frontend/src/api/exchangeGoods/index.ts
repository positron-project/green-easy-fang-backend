import request from "@/utils/request";
import type { exchangeGoodsResponseDataType, uploadExchangeGoodsResponseDataType, isCollectRequestDataType, isCollectResponseDataType, goChatDataType } from "./type";

export const API = {
    GET_GOODS_DATA: '/shop/selectNearbyLocations',
    UPLOAD_CONTENT: '/shop/insert',
    ISCOLLECT: '/shop/mine/favorite/change',
    GOCHAT: '/userMessage/addConversationlist',
    UPDATE_GOODS: '/shop/updateShop',
    AI_EVALUATE: '/valuation/multipart',
};

export const reqExchangeGoodsData = () => request.get<any, exchangeGoodsResponseDataType>(API.GET_GOODS_DATA)

export const reqUploadContent = (data: FormData) => request.post<any, uploadExchangeGoodsResponseDataType>(API.UPLOAD_CONTENT, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

export const reqIsCollect = (data: isCollectRequestDataType) => request.post<any, isCollectResponseDataType>(API.ISCOLLECT, data)

// 去聊天
export const reqGoChat = (data: goChatDataType) => request.post<any, any>(API.GOCHAT, data)

// 更新物品
export const reqUpdateGoods = (data: FormData) => request.post<any, uploadExchangeGoodsResponseDataType>(API.UPDATE_GOODS, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

// 调用AI评估物品
export const reqAIEvaluate = (data: FormData) => request.post<any, any>(API.AI_EVALUATE, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
