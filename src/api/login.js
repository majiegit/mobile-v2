import request from '@/utils/request'

/**
 * 用户名密码登录
 * @param parameter
 */
export function loginByUserCodePassword(parameter) {
  return request({
    url: "/hrsh/login/loginByUserCodePassword",
    method: 'post',
    params: parameter
  })
}
