import request from "@/utils/request";
import type { taskListDataResponesDataType, aiHintDataResponesDataType, pagingDIYDataType, taskDIYDataResponesDataType, aiHistoryDataResponesDataType, aiHintDataType } from "./type";

export const API = {
    TASK_LIST: 'task/taskList',
    AI_HINT: 'ai/chat/message',
    TASK_DIY: 'task/DIY',
    AI_HISTORY: 'ai/chat/history',
};

// 获取任务列表
export const reqGetTaskList = () => request.get<any, taskListDataResponesDataType>(API.TASK_LIST);

// 智能助手
export const reqAiHint = (data: aiHintDataType) => request.post<any, aiHintDataResponesDataType>(API.AI_HINT, data);

// DIY任务
export const reqTaskDIY = (data: pagingDIYDataType) => request.post<any, taskDIYDataResponesDataType>(API.TASK_DIY, data);

// 获取智能助手历史记录
export const reqAiHistory = (data: number) => request.get<any, aiHistoryDataResponesDataType>(API.AI_HISTORY,{ params: { userId: data } });
