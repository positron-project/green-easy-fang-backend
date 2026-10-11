export interface moduleType {
    code: number;
    message: string;
}

export interface loginDataType {
    youxiang: string;
    password: string;
}

export interface registerDataType {
    youxiang: string;
    password: string;
    code: string
}

export interface registerResponsetDataType extends moduleType {
    data: string;
}

// 用户信息接口方法
export interface userInfoDataType extends moduleType {
    data: {
        id: number
        accountId: number
        username: string
        gender: string
        avatar: string
        token: string
        youxiang: string
        region: string
        regions: string
    }
}