import request from '@/utils/request'

/**
 * 查询
 * @param parameter
 */
export function queryPopupList(data) {
  return request({
    url: "/hrsh/popup/list",
    method: 'post',
    data: data
  })
}


/**
 * 保存
 * @param parameter
 */
export function savePopupList(data) {
  return request({
    url: "/hrsh/popup/save",
    method: 'post',
    data: data
  })
}
