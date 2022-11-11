import storage from 'store'
import {USERINFO, TOKEN_TIME_EXP,ACCESS_TOKEN, REFRESH_TOKEN} from '@/utils/mutation-types'

// 获取本地存储用户信息
export const userInfo = storage.get(USERINFO)

// 获取本地存储用户ID
export const userInfoUserId =  storage.get(USERINFO) ? storage.get(USERINFO).user_id : ''

// 获取本地存储用户pk_psndoc
export const userInfoPkPsndoc = storage.get(USERINFO) ? storage.get(USERINFO).pk_psndoc : ''

// 认证token
export const accessToken = storage.get(ACCESS_TOKEN)
// 刷新token
export const refreshToken = storage.get(REFRESH_TOKEN)
