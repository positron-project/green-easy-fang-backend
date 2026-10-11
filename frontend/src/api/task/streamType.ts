export interface moduleType {
    code: number,
    message: string,
}

// SSE (Server-Sent Events) 相关类型
export interface SSEEvent {
    id?: string
    event?: string
    data: string
    retry?: number
}

export interface SSEMessageType {
    type: 'message' | 'error' | 'complete'
    data: string
    id?: string
}

// SseEmitter 响应数据类型
export interface SseEmitterResponseType {
    type: 'data' | 'error' | 'complete'
    content: string
    id?: number
}

export interface SseEmitterDataResponesDataType extends moduleType {
    data: SseEmitterResponseType
}