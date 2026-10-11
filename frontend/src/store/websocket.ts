import { defineStore } from 'pinia'
import type { WebSocketMessage } from '@/api/news/type'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

interface OnlineStatusMessage {
  type: 'online_status'
  onlineUsers: number[]
  userId: number
  status: 'online' | 'offline'
}

export const useWebSocketStore = defineStore('WebSocket', {
  state: () => ({
    ws: null as WebSocket | null,
    connectionStatus: 'disconnected' as ConnectionStatus,
    _messageHandlers: [] as Array<(msg: WebSocketMessage) => void>,
    _onlineStatusHandlers: [] as Array<(onlineUsers: number[]) => void>,
    _reconnectTimer: null as ReturnType<typeof setTimeout> | null,
    _currentAccountId: 0 as number,
    _onlineUsers: new Set<number>(), // 存储在线用户ID
  }),

  actions: {
    connect(accountId: number) {
      if (this.ws?.readyState === WebSocket.OPEN && this._currentAccountId === accountId) {
        return
      }
      this.disconnect()

      try {
        const url = `${import.meta.env.VITE_APP_BASE_WS}/ws/chat?senderId=${accountId}`
        this.ws = new WebSocket(url)
        this._currentAccountId = accountId
        this.connectionStatus = 'connecting'

        this.ws.onopen = () => {
          this.connectionStatus = 'connected'
          // 连接成功后立即请求当前在线用户列表，保证前端在线状态展示正确
          this.requestOnlineUsers()
        }

        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const messageData = JSON.parse(event.data) as WebSocketMessage & { info?: unknown }

            // 优先尝试把 info 当成在线状态消息来解析
            if (messageData.info) {
              const infoStr = String(messageData.info)
              try {
                // 有些后端直接传 JSON 字符串，有些会包一层提示文字
                const jsonStart = infoStr.indexOf('{')
                const jsonCandidate = jsonStart >= 0 ? infoStr.slice(jsonStart) : infoStr
                const statusMessage = JSON.parse(jsonCandidate) as Partial<OnlineStatusMessage> & {
                  onlineUsers?: number[]
                }

                if (statusMessage.onlineUsers && Array.isArray(statusMessage.onlineUsers)) {
                  // 整个在线用户列表
                  this._onlineUsers = new Set(statusMessage.onlineUsers)
                  this._onlineStatusHandlers.forEach((h) => h(statusMessage.onlineUsers!))
                  return
                }

                if (typeof statusMessage.userId === 'number' && statusMessage.status) {
                  // 单个用户上下线变更
                  if (statusMessage.status === 'online') {
                    this._onlineUsers.add(statusMessage.userId)
                  } else if (statusMessage.status === 'offline') {
                    this._onlineUsers.delete(statusMessage.userId)
                  }
                  this._onlineStatusHandlers.forEach((h) => h(Array.from(this._onlineUsers)))
                  return
                }
              } catch {
                console.log('收到 info 消息，但不是在线状态 JSON：', infoStr)
              }
            }

            // 普通聊天消息
            this._messageHandlers.forEach((h) => h(messageData))
          } catch (e) {
            console.error('解析WebSocket消息失败:', e, event.data)
          }
        }

        this.ws.onclose = (event: CloseEvent) => {
          this.connectionStatus = 'disconnected'
          this.ws = null
          if (this._reconnectTimer) clearTimeout(this._reconnectTimer)
          if (event.code !== 1000 && this._currentAccountId) {
            this._reconnectTimer = setTimeout(() => {
              this._reconnectTimer = null
              this.connect(this._currentAccountId)
            }, 3000)
          }
        }

        this.ws.onerror = () => {
          this.connectionStatus = 'error'
        }
      } catch (e) {
        console.error('初始化WebSocket失败:', e)
        this.connectionStatus = 'error'
      }
    },

    disconnect() {
      if (this._reconnectTimer) {
        clearTimeout(this._reconnectTimer)
        this._reconnectTimer = null
      }
      if (this.ws) {
        this.ws.close(1000, '主动关闭')
        this.ws = null
      }
      this._currentAccountId = 0
      this.connectionStatus = 'disconnected'
    },

    send(payload: { senderId: number; receiverId: number; content: string }) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(payload))
      }
    },

    registerMessageHandler(handler: (msg: WebSocketMessage) => void) {
      if (!this._messageHandlers.includes(handler)) {
        this._messageHandlers.push(handler)
      }
    },

    unregisterMessageHandler(handler: (msg: WebSocketMessage) => void) {
      this._messageHandlers = this._messageHandlers.filter((h) => h !== handler)
    },

    // 获取在线用户列表
    getOnlineUsers(): number[] {
      return Array.from(this._onlineUsers)
    },

    // 检查用户是否在线
    isUserOnline(userId: number): boolean {
      return this._onlineUsers.has(userId)
    },

    // 注册在线状态变化监听器
    registerOnlineStatusHandler(handler: (onlineUsers: number[]) => void) {
      if (!this._onlineStatusHandlers.includes(handler)) {
        this._onlineStatusHandlers.push(handler)
      }
    },

    // 注销在线状态变化监听器
    unregisterOnlineStatusHandler(handler: (onlineUsers: number[]) => void) {
      this._onlineStatusHandlers = this._onlineStatusHandlers.filter((h) => h !== handler)
    },

    // 请求在线用户列表
    requestOnlineUsers() {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'get_online_users' }))
      }
    },
  },
})
