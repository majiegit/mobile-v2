import request from '@/utils/request'

/**
 * 查询补考勤单据
 * @param parameter
 */
export function getAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/get",
    method: 'post',
    data: params
  })
}


/**
 * 保存补考勤单据
 * @param parameter
 */
export function saveAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/save",
    method: 'post',
    data: params
  })
}

/**
 * 删除补考勤单据
 * @param parameter
 */
export function deleteAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/delete",
    method: 'post',
    data: params
  })
}

/**
 * 提交补考勤单据
 * @param parameter
 */
export function submitAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/submit",
    method: 'post',
    data: params
  })
}

/**
 * 收回补考勤单据
 * @param parameter
 */
export function recoverAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/recover",
    method: 'post',
    data: params
  })
}

/**
 * 批准补考勤单据
 * @param parameter
 */
export function approveAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/approve",
    method: 'post',
    data: params
  })
}

/**
 * 驳回补考勤单据
 * @param parameter
 */
export function rejectAttendanceBill(params) {
  return request({
    url: "/hrsh/attendance/reject",
    method: 'post',
    data: params
  })
}
/**
 * 查询补考勤类型
 * @param parameter
 */
export function queryAttendanceType() {
  return request({
    url: "/hrsh/attendance/queryAttendanceType",
    method: 'post'
  })
}

/**
 * 查询补考勤原因
 * @param parameter
 */
export function queryAttendanceSreason() {
  return request({
    url: "/hrsh/attendance/queryAttendanceSreason",
    method: 'post'
  })
}
