import request from "@/utils/request";
import type { envContentCarouselResponseDataType, pagingCarouselDataType, envContentSpotNewResponseDataType, envContentSucessStoriesDataResponseDataType } from './type'

// 使用对象字面量替代枚举
export const API = {
    ENVCONTENTCAROUSEL_URL: '/envContent/envContentCarouselData',
    ENVCONTENTSPOTNEW_URL: '/envContent/envContentSpotNewData',
    ENVCONTENTSUCCESSSTORIES_URL: '/envContent/envContentSucessStoriesData',

};

export const reqEnvContentCarouselData = (data: pagingCarouselDataType) => request.post<any, envContentCarouselResponseDataType>(API.ENVCONTENTCAROUSEL_URL, data)

export const reqEnvContentSpotNewData = (data: pagingCarouselDataType) => request.post<any, envContentSpotNewResponseDataType>(API.ENVCONTENTSPOTNEW_URL, data)

export const reqEnvContentSucessStoriesData = (data: pagingCarouselDataType) => request.post<any, envContentSucessStoriesDataResponseDataType>(API.ENVCONTENTSUCCESSSTORIES_URL, data)
