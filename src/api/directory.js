import request from '@/utils/request'

/**
 * 查询组织架构
 * @param parameter
 */
export function queryCompanyStructure(params) {
  return request({
    url: "/hrsh/directory/queryCompanyStructure",
    method: 'post',
    data: params
  })
}


/**
 * 查询人员列表
 * @param parameter
 */
export function queryDirPsnInfoList(params) {
  return request({
    url: "/hrsh/directory/queryDirPsnInfoList",
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
