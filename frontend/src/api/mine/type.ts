export interface moduleType {
    code: number,
    message: string,
}

// 定义用户信息数据类型
export type userInfoDataType = {
    id: number,
    avatar: File | null,
    username: string,
    gender: string,
    region: string,
    address: string,
    regions: string
}

// 关注数据类型
export interface attentionListDataType {
    id: number,
    userId: number,
    name: string,
    avatar: string,
    isFollow: boolean,
}

export interface attentionChangeDataType {
    userId: number,
    attentionId: number,
}

export interface attentionListDataResponesDataType extends moduleType {
    data: attentionListDataType[]
}

// 用户创作类型
export interface creativeListDataType {
    id: number,
    userId: number,
    img: string,
    type: string,
    detail: string,
}

export interface creativeListDataResponesDataType extends moduleType {
    data: creativeListDataType[]
}

// 收藏列表数据类型
export interface favoriteListDataType {
    id: number,
    shopId: number,
    image: string,
    description: string,
    isFavorite: boolean,
}

export interface favoriteListDataResponesDataType extends moduleType {
    data: favoriteListDataType[]
}

// 切换收藏状态数据类型
export interface changeFavoriteDataType {
    userId: number,
    favoriteId: number,
}

// 发布列表数据类型
export interface releaseListDataType {
    id: number,
    userId: number,
    image: string,
    description: string,
    createTime: string,
}

export interface releaseListDataResponesDataType extends moduleType {
    data: releaseListDataType[]
}

// 用户数据类型
export interface userCountDataType {
    greenPoints: number,
    followCount: number,
}

export interface userCountDataResponesDataType extends moduleType {
    data: userCountDataType
}
