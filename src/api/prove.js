/*
* 证明
*
*/
const certificationAudit = r => require.ensure([], () => r(require('@/pages/prove/list.vue')), 'certificationAudit')//证明审核
const certificationAuditDetail = r => require.ensure([], () => r(require('@/pages/prove/detail.vue')), 'certificationAuditDetail')//证明审核详情
const certificationApplication = r => require.ensure([], () => r(require('@/pages/prove/certificationApplication.vue')), 'certificationApplication')//证明申请
const certificationSubmit = r => require.ensure([], () => r(require('@/pages/prove/edit.vue')), 'certificationSubmit')//证明提交
const certificationApplicationDetail = r => require.ensure([], () => r(require('@/pages/prove/certificationApplicationDetail.vue')), 'certificationApplicationDetail')//证明申请详情
const certificationAuditByDing = r => require.ensure([], () => r(require('@/pages/prove/certificationAuditMessageDingDing.vue')), 'certificationAuditByDing') //证明审批钉钉单点详情

export default [
  {
    path : '/certificationAudit',
    name : 'certificationAudit',
    component : certificationAudit
  },
  {
    path : '/certificationAuditDetail',
    name : 'certificationAuditDetail',
    component : certificationAuditDetail
  },
  {
    path : '/certificationApplication',
    name : 'certificationApplication',
    component : certificationApplication
  },
  {
    path : '/certificationSubmit',
    name : 'certificationSubmit',
    component : certificationSubmit
  },
  {
    path : '/certificationApplicationDetail',
    name : 'certificationApplicationDetail',
    component : certificationApplicationDetail
  },
  {
    path : '/certificationAuditByDing',
    name : 'certificationAuditByDing',
    component : certificationAuditByDing
  }
]
