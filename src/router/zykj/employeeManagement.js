/*
* 员工管理
*
* */
const employeeManagementMenu = r => require.ensure([], () => r(require('@/pages/zykj/employeeManagementMenu.vue')),'employeeManagementMenu')//入职流程
const employeeInquiry = r => require.ensure([], () => r(require('@/pages/zykj/employeeInquiry.vue')),'employeeInquiry')//员工问询
const employeeInquiryDetail = r => require.ensure([], () => r(require('@/pages/zykj/employeeInquiryDetail.vue')),'employeeInquiryDetail')//员工问询详情


export default [
  {
    path : '/employeeManagementMenu',
    name : 'employeeManagementMenu',
    component : employeeManagementMenu
  },
  {
    path : '/employeeInquiry',
    name : 'employeeInquiry',
    component : employeeInquiry
  },
  {
    path : '/employeeInquiryDetail',
    name : 'employeeInquiryDetail',
    component : employeeInquiryDetail
  }
]
