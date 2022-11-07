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