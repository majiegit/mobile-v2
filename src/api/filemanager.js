import request from '@/utils/request'

/**
 * 查询附件列表
 * @param parameter
 */
export function getFileList(params) {
  return request({
    url: "/hrsh/home/getFileList",
    method: 'post',
    params: params
  })
}
