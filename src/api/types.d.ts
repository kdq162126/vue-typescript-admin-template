export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

export interface IRoleData {
  key: string
  name: string
  description: string
  routes: any
}

export interface ITransactionData {
  orderId: string
  timestamp: string | number
  username: string
  price: number
  status: string
}

export interface IUserData {
  id: number
  username: string
  password: string
  name: string
  email: string
  phone: string
  avatar: string
  introduction: string
  roles: string[]
}

export interface IBotData {
  id: number
  address: string
  isActive: boolean
  lastActiveAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ISettingData {
  id: string
  name?: string
  strategy: number
  bots?: object
  schedule: object
  meta: object
  createdAt: Date
  updatedAt: Date
}

export interface IGroupData {
  id: string
  name?: string
  isRunning: boolean
  settings?: ISettingData[]
  bots?: IBotData[]
  createdAt: Date
  updatedAt: Date
}
