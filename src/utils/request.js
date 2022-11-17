import axios from 'axios'
import storage from 'store'
import {VueAxios} from './axios'
import {ACCESS_TOKEN, REFRESH_TOKEN,USERINFO, TOKEN_TIME_EXP} from '@/utils/mutation-types'
import {Toast} from 'vant';
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: "/hrshc",
  timeout: 600000 // 请求超时时间
})


// request 拦截器
request.interceptors.request.use(config => {
  const accessToken = storage.get(ACCESS_TOKEN)
  const refreshToken = storage.get(REFRESH_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (accessToken) {
    config.headers[ACCESS_TOKEN] = accessToken
  }
  if (refreshToken) {
    config.headers[REFRESH_TOKEN] = refreshToken
  }
  return config
})

// response 拦截器
request.interceptors.response.use(
  response => {
    // 动态刷新 Token
    // 认证 AccessToken
    let accessToken = response.headers[ACCESS_TOKEN.toLowerCase()]
    if (accessToken) {
      storage.set(ACCESS_TOKEN, accessToken, TOKEN_TIME_EXP)
    }
    // 刷新 RefreshToken
    let refreshToken = response.headers[REFRESH_TOKEN.toLowerCase()]
    if (refreshToken) {
      storage.set(REFRESH_TOKEN, refreshToken, TOKEN_TIME_EXP)
    }

    // 响应数据处理
    let res = response.data
    // 请求数据成功, 直接 return
    // console.log(response)
    if (res.code === 200) {
      return res
    } else if (res.code === 401) {
      // token 失效,删除token,跳转到登录页
      storage.remove(ACCESS_TOKEN)
      storage.remove(REFRESH_TOKEN)
      storage.remove(USERINFO)
      Toast(res.message)
      window.location.href = '/'
    } else {
      // 弹出错误消息
      Toast(res.message)
      return Promise.reject(res);
    }
  },
  error => {
    if (error.response) {
      const data = error.response.data
      if (error.response.status === 403) {
      }
      if (error.response.status === 500) {
      }
    }
    return Promise.reject(error)
  })

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
