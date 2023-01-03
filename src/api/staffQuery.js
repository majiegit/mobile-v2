import request from '@/utils/request'

/**
 * 查询人员列表
 * @param parameter
 */
export function queryPsndocList(params) {
  return request({
    url: "/hrsh/psndoc/queryPsndocList",
    method: 'post',
    params: params
  })
}

/**
 * 查询用户基本信息
 * @param parameter
 */
export function queryPsndocInfo(params) {
  return request({
    url: "/hrsh/psndoc/getPsndocInfo",
    method: 'post',
    params: params
  })
}
