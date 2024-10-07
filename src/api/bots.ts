import request from '@/utils/request'
import { IGroupData } from './types'

export const defaultGroupData: IGroupData = {
  name: '',
  isRunning: false
}

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
