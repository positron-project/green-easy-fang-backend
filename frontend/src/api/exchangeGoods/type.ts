export interface moduleType {
    code: number,
    message: string,
}

// 获取环保物品数据类型
export interface exchangeGoodsDataType {
    id: number,
    userId: number,
    imageUrls: string[],
    address: string,
    shopDetails: string,
    price: number,
    isCollected: boolean,
}

// 获取环保物品数据响应类型
export interface exchangeGoodsResponseDataType extends moduleType {
    data: exchangeGoodsDataType[],
}

// 上传环保物品数据响应类型
export interface uploadExchangeGoodsResponseDataType extends moduleType {
    data: uploadExchangeGoodsDataType,
}

// 获取环保物品数据类型
export interface uploadExchangeGoodsDataType {
    id: number,
    userId: number,
    images: File[] | string[],
    address: string,
    shopDetails: string,
    price: number | null,
}

// 收藏环保物品数据响应类型
export interface isCollectRequestDataType {
    shopId: number,
    isCollect: boolean,
}

export interface isCollectResponseDataType extends moduleType {

}

// 去聊天响应类型
export interface goChatDataType {
    senderId: number,
    contactId: number,
}

// export interface updateGoodsDataType {
//     id: number,
//     userId: number,
//     images: File[] | string[],
//     address: string,
//     shopDetails: string,
//     price: number | null,
// }

// // 更新物品响应类型
// export interface updateGoodsResponseDataType extends moduleType {
//     data: updateGoodsDataType,
// }

// 调用AI评估物品响应类型
export interface AIEvaluateResponseDataType extends moduleType {
    data: AIEvaluateDataType,
}

export interface AIEvaluateDataType {
    estimatedPriceRange: number,
    reasoning: string,
}