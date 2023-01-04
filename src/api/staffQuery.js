import request from '@/utils/request'

/**
 * 查询人员列表
 * @param parameter
 */
export function queryPsnInfoList(params) {
  return request({
    url: "/hrsh/resume/queryPsnInfoList",
    method: 'post',
    data: params
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

/**
 * 查询组织架构
 * @param parameter
 */
export function querySubOrgOrDeptByPk(params) {
  return request({
    url: "/hrsh/resume/querySubOrgOrDeptByPk",
    method: 'post',
    data: params
  })
}
