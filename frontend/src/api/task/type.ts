export interface moduleType {
    code: number,
    message: string,
}

// 任务列表数据响应体
export interface TaskItemDataType {
    id: number,
    title: string,
    accomplishText: string,
}

export interface taskListDataType {
    commonList: TaskItemDataType[]
    notSpotList: TaskItemDataType[]
    hideList: TaskItemDataType[]
}
export interface taskListDataResponesDataType extends moduleType {
    data: taskListDataType
}

// 智能助手数据响应体
export interface aiHintDataType {
    userId: number
    message: string,
}

export interface aiHintDataResponesDataType extends moduleType {
    data: string
}

// 对话消息类型
export interface aiHintMessageType {
    id: number
    type: 'user' | 'ai'
    name: string
    avatar: string
    content: string
}

// DIY任务数据响应体
export interface pagingDIYDataType {
    currentPage: number,
    pageSize: number,
}

export interface taskDIYDataResponesDataType extends moduleType {
    data: totalData
}

export interface totalData {
    total: number,
    data: taskDIYDataType[]
}

export interface taskDIYDataType {
    id: number,
    title: string,
    materials: string,
    tools: string,
    steps: string[],
    detailUrl: string,
    image: string,
}

// 智能助手历史记录数据响应体
export interface aiHistoryDataType {
    type: string
    text: string,
}

export interface aiHistoryDataResponesDataType extends moduleType {
    data: aiHistoryDataType[]
}