import request from '../utils/request';

// request大括号，对象的解构赋值 
export function getHotTabs() {
  return request({
    url: '/hot/tabs'
  });
}

/**
 * 热搜文章列表
 */
export function getHotListFromTabType(type) {
  return request({
    url: '/hot/list',
    data: {
      type
    }
  });
}
