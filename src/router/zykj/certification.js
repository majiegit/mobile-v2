/*
* 证明
*
*/
const certificationAudit = r => require.ensure([], () => r(require('@/pages/zykj/certificationAudit.vue')), 'certificationAudit')//证明审核
const certificationAuditDetail = r => require.ensure([], () => r(require('@/pages/zykj/certificationAuditDetail.vue')), 'certificationAuditDetail')//证明审核详情
const certificationApplication = r => require.ensure([], () => r(require('@/pages/zykj/certificationApplication.vue')), 'certificationApplication')//证明申请
const certificationSubmit = r => require.ensure([], () => r(require('@/pages/zykj/certificationSubmit.vue')), 'certificationSubmit')//证明提交
const certificationApplicationDetail = r => require.ensure([], () => r(require('@/pages/zykj/certificationApplicationDetail.vue')), 'certificationApplicationDetail')//证明申请详情

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
  }
]
