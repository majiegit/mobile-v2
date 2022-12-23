import request from '@/utils/request'

/**
 * 查询扫码入职组织
 * @param parameter
 */
export function queryOrgForScanQRCode(params) {
  return request({
    url: "/hrsh/qrcode/queryOrgForScanQRCode",
    method: 'post',
    data: params
  })
}

/**
 * 查询扫码组织模板
 * @param parameter
 */
export function queryEntryInfoTemp(params) {
  return request({
    url: "/hrsh/qrcode/queryEntryInfoTemp",
    method: 'post',
    data: params
  })
}

/**
 * 提交
 * @param parameter
 */
export function saveEntryInfo(params) {
  return request({
    url: "/hrsh/qrcode/saveEntryInfo",
    method: 'post',
    data: params
  })
}

/**
 * 上传照片
 * @param parameter
 */
export function uploadEntryPsnPhoto(params) {
  return request({
    url: "/hrsh/qrcode/uploadEntryPsnPhoto",
    method: 'post',
    data: params
  })
}

/**
 * 上传附件
 * @param parameter
 */
export function entryFileUpload(params) {
  return request({
    url: "/hrsh/qrcode/entryFileUpload",
    method: 'post',
    data: params
  })
}
/**
 * 查询参照
 * @param parameter
 */
export function queryEntryReference(params) {
  return request({
    url: "/hrsh/qrcode/queryEntryReference",
    method: 'post',
    data: params
  })
}
