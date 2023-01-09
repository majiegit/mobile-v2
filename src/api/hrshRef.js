import request from '@/utils/request'

/**
 * 查询离职单据
 * @param parameter
 */
export function quertHrOrgList(params) {
  return request({
    url: "/hrsh/hrshRef/quertHrOrgList",
    method: 'post',
    data: params
  })
}
