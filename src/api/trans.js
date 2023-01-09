import request from '@/utils/request'

/**
 * 查询调配单据
 * @param parameter
 */
export function getTransBill(params) {
  return request({
    url: "/hrsh/trans/get",
    method: 'post',
    data: params
  })
}

/**
 * 保存调配单据
 * @param parameter
 */
export function saveTransBill(params) {
  return request({
    url: "/hrsh/trans/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除调配单据
 * @param parameter
 */
export function deleteTransBill(params) {
  return request({
    url: "/hrsh/trans/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交调配单据
 * @param parameter
 */
export function submitTransBill(params) {
  return request({
    url: "/hrsh/trans/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回调配单据
 * @param parameter
 */
export function recoverTransBill(params) {
  return request({
    url: "/hrsh/trans/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准调配单据
 * @param parameter
 */
export function approveTransBill(params) {
  return request({
    url: "/hrsh/trans/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回调配单据
 * @param parameter
 */
export function rejectTransBill(params) {
  return request({
    url: "/hrsh/trans/reject",
    method: 'post',
    data: params
  })
}
/**
 * 查询调配类型
 * @param parameter
 */
export function queryTransType() {
  return request({
    url: "/hrsh/trans/queryTransType",
    method: 'post'
  })
}

/**
 * 查询调配方式
 * @param parameter
 */
export function queryTransStapplyMode() {
  return request({
    url: "/hrsh/trans/queryTransStapplyMode",
    method: 'post'
  })
}

/**
 * 查询调配原因
 * @param parameter
 */
export function queryTransSreason() {
  return request({
    url: "/hrsh/trans/queryTransSreason",
    method: 'post'
  })
}
