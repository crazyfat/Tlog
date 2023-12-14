// 统一管理api接口
import requests from './request'

export const reqLogInfo = ()=>{
  return requests({
    url: '/home/log',
    method: 'get',
  })
}
export const reqMenu = ()=>{
  return requests({
    url: '/home/menu',
    method: 'get',
  })
}

