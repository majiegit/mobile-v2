import request from '@/utils/request'

/**
 * 查询离职单据
 * @param parameter
 */
export function getRegBill(params) {
  return request({
    url: "/hrsh/reg/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存离职单据
 * @param parameter
 */
export function saveRegBill(params) {
  return request({
    url: "/hrsh/reg/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除离职单据
 * @param parameter
 */
export function deleteRegBill(params) {
  return request({
    url: "/hrsh/reg/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交离职单据
 * @param parameter
 */
export function submitRegBill(params) {
  return request({
    url: "/hrsh/reg/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回离职单据
 * @param parameter
 */
export function recoverRegBill(params) {
  return request({
    url: "/hrsh/reg/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准离职单据
 * @param parameter
 */
export function approveRegBill(params) {
  return request({
    url: "/hrsh/reg/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回离职单据
 * @param parameter
 */
export function rejectRegBill(params) {
  return request({
    url: "/hrsh/reg/reject",
    method: 'post',
    data: params
  })
}
/**
 * 查询离职类型
 * @param parameter
 */
export function queryRegType() {
  return request({
    url: "/hrsh/reg/queryRegType",
    method: 'post'
  })
}

/**
 * 查询离职原因
 * @param parameter
 */
export function queryRegSreason() {
  return request({
    url: "/hrsh/reg/queryRegSreason",
    method: 'post'
  })
}
