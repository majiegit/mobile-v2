/*
 *Created by tianxfc on 2017/10/27.
 *
 */
const EmployeeResume = r => require.ensure([], () => r(require('@/pages/leader-self/employeeResume/empResume')), 'employeeResume')
const EmployeeList = r => require.ensure([], () => r(require('@/pages/leader-self/employeeResume/employeeList')), 'employeeList')
const EmpResumeDetail = r => require.ensure([], () => r(require('@/pages/leader-self/employeeResume/empResumeDetail')), 'empResumeDetail')
const OrgStructure = r => require.ensure([], () => r(require('@/pages/leader-self/employeeResume/orgStructure')), 'orgStructure')
const OrgSearchBar = r => require.ensure([], () => r(require('@/components/base/orgSearchBar')), 'orgSearchBar')
export default [
    {
        path : '/employeeResume',
        name : 'employeeResume',
        component : EmployeeResume
    },
    {
        path : '/employeeList',
        name : 'employeeList',
        component : EmployeeList
    },
    {
        path : '/empResumeDetail',
        name : 'empResumeDetail',
        component : EmpResumeDetail
    },
    {
        path : '/orgStructure',
        name : 'orgStructure',
        component : OrgStructure
    },
    {
        path : '/orgSearchBar',
        name : 'orgSearchBar',
        component : OrgSearchBar
    },
    
]
