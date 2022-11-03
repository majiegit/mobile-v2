import request from '@/utils/request'

/**
 * 查询用户模板数据
 * @param parameter
 */
export function queryPsndocTemp(params) {
  return request({
    url: "/hrsh/psndoc/queryPsnInfoTemp",
    method: 'post',
    params: params
  })
}

/**
 * 查询用户个人信息
 * @param parameter
 */
export function getSubInfoVO(params) {
  return request({
    url: "/hrsh/psndoc/getSubInfoVO",
    method: 'post',
    params: params
  })
}
