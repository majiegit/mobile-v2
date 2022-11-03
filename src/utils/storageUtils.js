import storage from 'store'
import {USERINFO, TOKEN_TIME_EXP} from '@/utils/mutation-types'

// 获取本地存储用户信息
export const userInfo = storage.get(USERINFO)

// 获取本地存储用户ID
export const userInfoUserId =  storage.get(USERINFO) ? storage.get(USERINFO).user_id : ''

// 获取本地存储用户pk_psndoc
export const userInfoPkPsndoc = storage.get(USERINFO) ? storage.get(USERINFO).pk_psndoc : ''

