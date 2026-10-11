import request from "@/utils/request";
import type { envContentSucessStoriesDataResponseDataType } from '../type'
import type { detailResponseDataType, detailParamsType } from './type'

export const API = {
    ENVCONTENTSPOTNEWDETAIL_URL: '/envContent/detailData',
    ENVCONTENTSUCCESSSTORIESRANDOM_URL: '/envContent/envContentSucessStoriesRandomData'
};

// 获取环境内容详情数据
export const reqSpotNewDetailData = (data: detailParamsType) => request.post<any, detailResponseDataType>(API.ENVCONTENTSPOTNEWDETAIL_URL, data)

export const reqEnvContentSucessStoriesRandomData = () => request.post<any, envContentSucessStoriesDataResponseDataType>(API.ENVCONTENTSUCCESSSTORIESRANDOM_URL)
