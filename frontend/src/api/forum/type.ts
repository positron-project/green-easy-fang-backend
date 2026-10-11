export interface moduleType {
    code: number,
    message: string,
}

// 论坛内容数据类型
export interface forumDataType {
    id: number,
    type: string,
    navType: string,
    title: string,
    detail: string,
    source: string,
    numberPeople: number,
    img: string,
}

export interface forumResponseDataType {
    code: number,
    message: string,
    data: forumDataType[],
}

// 评论数据类型
export interface commentResponseDataType extends moduleType {
    data: total_commentDataType,
}

export interface total_commentDataType {
    total: number,
    data: commentDataType[],
}

export interface commentDataType {
    id: number,
    userHeadImg: string,
    userName: string,
    content: string,
    createTime: string,
    address: string,
}

// 发送评论数据类型
export interface sendCommentDataType {
    userName: string,
    userHeadImg: string,
    address: string,
    userId: number,
    postId: number,
    content: string,
}

// 提交环保内容数据类型
export interface submitCreativeCenterDataType {
    userId: number,
    type: string,
    title: string,
    detail: string,
    source: string,
    image: File,
}

export interface fourmCreateFormDataType {
    type: string
    title: string
    description: string
    source: string
    image: File | null
}