import { IBotData, IGroupData, ISettingData } from '../src/api/types'
import { Response, Request } from 'express'
import faker from 'faker'

const botList: IBotData[] = Array.from({ length: 30 }, (_, index) => {
  return {
    id: index, // Use index for id
    address: `0x000000000000000000000000000000000${index
      .toString(16)
      .padStart(40, '0')}`,
    isActive: faker.datatype.boolean(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    lastActiveAt: faker.date.future()
  }
})
const settingList: ISettingData[] = Array.from({ length: 20 }, (_, index) => {
  return {
    id: faker.datatype.uuid(),
    name: faker.name.jobType(),
    strategy: faker.datatype.number(2),
    schedule: {
      startHour: `${faker.datatype.number(11)}`,
      startMinute: `${faker.datatype.number(59)}`,
      stopHour: `${12 + faker.datatype.number(11)}`,
      stopMinute: `${faker.datatype.number(59)}`
    },
    meta: {
      dex: 'cetus',
      pool: `0x${faker.datatype.uuid().replace('-', '')}`,
      maxAmount: `${2000 + faker.datatype.number(2000)}`,
      minAmount: `${faker.datatype.number(2000)}`,
      tradeToken: `0x${faker.datatype.uuid().replace('-', '')}`
    },
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  }
})
const settingLen = settingList.length
const groupList: IGroupData[] = Array.from({ length: 10 }, (_, index) => {
  return {
    id: faker.datatype.uuid(),
    isRunning: faker.datatype.boolean(),
    name: faker.name.jobTitle(),
    settings: [
      settingList[faker.datatype.number(settingLen / 2)],
      settingList[faker.datatype.number(settingLen - settingLen / 2)]
    ],
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  }
})

export const getBots = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    data: {
      total: botList.length,
      items: botList
    }
  })
}

export const getGroups = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    data: {
      total: groupList.length,
      items: groupList
    }
  })
}
