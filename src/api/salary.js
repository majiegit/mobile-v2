import request from '@/utils/request'

/**
 * 查询我的薪资
 * @param parameter
 */
export function querySalaryData(params) {
  return request({
    url: "/hrsh/salary/querySalary",
    method: 'post',
    params: params
  })
}

/**
 * 薪资密码修改
 * @param parameter
 */
export function updatePwd(data) {
  return request({
    url: "/hrsh/salary/updatePwd",
    method: 'post',
    data: data
  })
}

/**
 * 薪资密码重置
 * @param parameter
 */
export function restPwd(data){
  return request({
    url: "/hrsh/salary/restPwd",
    method: 'post',
    data: data
  })
}

/**
 * 薪资密码验证
 * @param parameter
 */
export function checkPwd(data) {
  return request({
    url: "/hrsh/salary/checkPwd",
    method: 'post',
    data: data
  })
}
