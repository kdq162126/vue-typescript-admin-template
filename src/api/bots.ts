import request from '@/utils/request'

export const getBots = (params: any) =>
  request({
    url: '/bot/list',
    method: 'get',
    params
  })

export const getGroups = (params: any) =>
  request({
    url: '/bot/group/list',
    method: 'get',
    params
  })
