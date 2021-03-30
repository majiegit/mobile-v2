const myApply = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/my-apply/index')), 'myApply')
const applyDetail = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/my-apply/components/apply-detail')), 'applyDetail')
const fjmanagement = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/my-apply/components/fjmanagement')), 'fjmanagement')
const progressNode = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/my-apply/components/approveUsrList/progress-node')), 'progressNode')
const approverList = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave//my-apply/components/approveUsrList/approver-list')), 'approverList')


export default [
    {
        path : '/attendance-leave/my-apply',
        name : 'myApply',
        component : myApply
    },
    {
        path : '/attendance-leave/my-apply/apply-detail',
        name : 'apply-detail',
        component : applyDetail
    },
    {
        path : '/attendance-leave/my-apply/fjmanagement',
        name : 'fjmanagement',
        component : fjmanagement
    },
    {
        path : '/attendance-leave/my-apply/progress-node',
        name : 'progress-node',
        component : progressNode,
        meta: {
           keepAlive: true // 需要被缓存
        }
    },
    {
        path : '/attendance-leave/my-apply/approver-list',
        name : 'approver-list',
        component : approverList
    }
    
]

