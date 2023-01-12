import request from '@/utils/request'

/**
 * 查询入职单据
 * @param parameter
 */
export function getEntryBill(params) {
  return request({
    url: "/hrsh/entry/get",
    method: 'post',
    data: params
  })
}
