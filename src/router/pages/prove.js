

// 证明
import proveApplyEdit from '@/pages/prove/apply/edit.vue' //证明申请页
import proveApplyList from '@/pages/prove/apply/list.vue' //证明申请页


export default [
  {
    path : '/proveApplyEdit',
    name : 'proveApplyEdit',
    component : proveApplyEdit
  },
  {
    path : '/proveApplyList',
    name : 'proveApplyList',
    component : proveApplyList
  }
  // {
  //   path : '/certificationAuditDetail',
  //   name : 'certificationAuditDetail',
  //   component : certificationAuditDetail
  // },
  // {
  //   path : '/certificationApplication',
  //   name : 'certificationApplication',
  //   component : certificationApplication
  // },
  // {
  //   path : '/certificationSubmit',
  //   name : 'certificationSubmit',
  //   component : certificationSubmit
  // },
  // {
  //   path : '/certificationApplicationDetail',
  //   name : 'certificationApplicationDetail',
  //   component : certificationApplicationDetail
  // },
  // {
  //   path : '/certificationAuditByDing',
  //   name : 'certificationAuditByDing',
  //   component : certificationAuditByDing
  // }

]
