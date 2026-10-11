// 轮播图数据类型
export interface envContentCarouselDataType {
    id: number,
    img: string,
    title: string,
    date: string | Date,
    address: string,
}

export interface envContentCarousel_TotalPageDataType {
    total: number,
    data: envContentCarouselDataType[],
}

export interface envContentCarouselResponseDataType {
    code: number,
    message: string,
    data: envContentCarousel_TotalPageDataType,
}

export interface pagingCarouselDataType {
    currentPage: number,
    pageSize: number,
}

// 最新动态数据类型
export interface envContentSpotNewDataModule {
    id: number,
    type: string,
    title: string,
    date: string | Date,
    address: string,
    imageUrl: string,
}

export interface envContentSpotNewResponseDataType {
    code: number,
    message: string,
    data: dataModule,
}

export interface dataModule {
    total: number,
    data: maxImgData_minImgDataType[],
}

export interface maxImgData_minImgDataType {
    envContentMaxImgData: maxImgData,
    envContentMinImgData: minImgData[],
}

export interface maxImgData extends envContentSpotNewDataModule {
}

export interface minImgData extends envContentSpotNewDataModule {
    ddddd: string,
}

// 成功案例数据类型
export interface envContentSucessStoriesDataResponseDataType {
    code: number,
    message: string,
    data: envContentSucessStoriesData[],
}

export interface envContentSucessStoriesData {
    id: number,
    title: string,
    date: string | Date,
    address: string,
    imageUrl: string,
}