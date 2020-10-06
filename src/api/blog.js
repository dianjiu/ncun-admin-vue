import request from '../utils/request';

//查询文章列表
export const queryList = data => {
    return request({
        url: '/tBlog/listByPage',
        method: 'post',
        data
    });
};
//新增文章
export const insert = data => {
    return request({
        url: '/tBlog/insert',
        method: 'post',
        data
    });
};