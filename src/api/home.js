import request from '@/utils/request'

/**
 * 查询用户菜单
 * @param parameter
 */
export function queryUserRoleMenu(params) {
  return request({
    url: "/hrsh/home/getStaffRoleMenu",
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
