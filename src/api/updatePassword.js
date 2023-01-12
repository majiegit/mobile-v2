import request from '@/utils/request'

/**
 * 密码修改
 * @param parameter
 */
export function updatePassword(data) {
  return request({
    url: "/hrsh/updatePassword/update",
    method: 'post',
    data: data
  })
}
