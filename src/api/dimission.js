import request from '@/utils/request'

/**
 * 查询离职单据
 * @param parameter
 */
export function getDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存离职单据
 * @param parameter
 */
export function saveDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除离职单据
 * @param parameter
 */
export function deleteDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交离职单据
 * @param parameter
 */
export function submitDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回离职单据
 * @param parameter
 */
export function recoverDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准离职单据
 * @param parameter
 */
export function approveDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回离职单据
 * @param parameter
 */
export function rejectDimissionBill(params) {
  return request({
    url: "/hrsh/dimission/reject",
    method: 'post',
    data: params
  })
}
/**
 * 查询离职类型
 * @param parameter
 */
export function queryDimissionType() {
  return request({
    url: "/hrsh/dimission/queryDimissionType",
    method: 'post'
  })
}

/**
 * 查询离职原因
 * @param parameter
 */
export function queryDimissionSreason() {
  return request({
    url: "/hrsh/dimission/queryDimissionSreason",
    method: 'post'
  })
}
