import request from '@/utils/request'

/**
 * 查询员工信息审核
 * @param parameter
 */
export function getPsnInfoApprove(params) {
  return request({
    url: "/hrsh/psnInfoApprove/get",
    method: 'post',
    data: params
  })
}

/**
 * 查询员工信息审核列表
 * @param parameter
 */
export function queryPsnInfoApproveList(params) {
  return request({
    url: "/hrsh/psnInfoApprove/list",
    method: 'post',
    data: params
  })
}

/**
 * 删除员工信息审核
 * @param parameter
 */
export function deletePsnInfoApprove(params) {
  return request({
    url: "/hrsh/psnInfoApprove/delete",
    method: 'post',
    data: params
  })
}

/**
 * 批准员工信息审核
 * @param parameter
 */
export function approvePsnInfoApprove(params) {
  return request({
    url: "/hrsh/psnInfoApprove/approve",
    method: 'post',
    data: params
  })
}

