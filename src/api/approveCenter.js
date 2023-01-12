import request from '@/utils/request'

/**
 * 查询审批中心数据
 * @param parameter
 */
export function getMyApprove(params) {
  return request({
    url: "/hrsh/approveCenter/getMyApprove",
    method: 'post',
    params: params
  })
}

/**
 * 批准
 * @param parameter
 */
export function approve(params) {
  return request({
    url: "/hrsh/approveCenter/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回
 * @param parameter
 */
export function reject(params) {
  return request({
    url: "/hrsh/approveCenter/reject",
    method: 'post',
    data: params
  })
}

/**
 * 查询批准是否需要指派
 * @param parameter
 */
export function queryAssignResult(params) {
  return request({
    url: "/hrsh/approveCenter/queryAssignResult",
    method: 'post',
    data: params
  })
}
