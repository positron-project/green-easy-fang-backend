export interface moduleType {
    code: number,
    message: string,
}

// 聊天列表数据
export interface chatListDataResponseDataType extends moduleType {
    data: chatListDataType[]
}

export interface chatListDataType {
    id: number
    contactId: number
    contactAvatar: string
    contactName: string
    isFollowing: boolean
}

// 聊天消息类型定义
export interface ChatMessage {
  senderId: number
  content: string
}

// 聊天消息类型定义
export interface messageType {
  type: 'user' | 'other'
  avatar: string
  name: string
  senderId: number
  content: string
}

// WebSocket消息类型定义
export interface WebSocketMessage {
  id: number
  senderId: number
  receiverId: number
  content: string
  createdAt: string
}

// 历史消息响应类型定义
export interface historyResponseDataType extends moduleType {
  data: ChatMessage[]
}