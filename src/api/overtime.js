import request from '@/utils/request'

/**
 * 查询加班单据
 * @param parameter
 */
export function getOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存加班单据
 * @param parameter
 */
export function saveOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/get",
    method: 'post',
    data: params
  })
}

/**
 * 删除加班单据
 * @param parameter
 */
export function deleteOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交加班单据
 * @param parameter
 */
export function submitOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回加班单据
 * @param parameter
 */
export function recoverOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准加班单据
 * @param parameter
 */
export function approveOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回加班单据
 * @param parameter
 */
export function rejectOvertimeBill(params) {
  return request({
    url: "/hrsh/overtime/reject",
    method: 'post',
    data: params
  })
}
