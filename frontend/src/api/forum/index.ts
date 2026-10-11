import request from "@/utils/request";
import type { forumResponseDataType, commentResponseDataType, sendCommentDataType } from "./type";

export const API = {
    FORUM_CONTENT_URL: '/forum/contentData',
    COMMENT_URL: '/forum/comment',
    CREATECONTENT_URL: '/forum/createContent',
    SENDCOMMENT_URL: '/forum/sendComment',
};

export const reqContentData = (data: string) => request.get<any, forumResponseDataType>(API.FORUM_CONTENT_URL, { params: { type: data } })

export const reqCommentData = (data: number) => request.get<any, commentResponseDataType>(API.COMMENT_URL, { params: { postid: data } })

export const reqCreateContent = (data: FormData) => request.post<any, any>(API.CREATECONTENT_URL, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})

export const reqSendComment = (data: sendCommentDataType) => request.post<any, any>(API.SENDCOMMENT_URL, data)
