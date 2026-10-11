// 环境内容详情数据响应体
export interface detailResponseDataType {
    code: number,
    message: string,
    data: detailDataType,
}

export interface detailDataType {
    id: number,
    title: string,
    date: string,
    address: string,
    imageT: string,
    image: string,
    message: string,
}

export interface detailParamsType {
    id: number,
    type: string,
}