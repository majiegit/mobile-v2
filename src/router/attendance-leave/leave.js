const Leave = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/leave/index')), 'leave')

export default [
    {
        path : '/attendance-leave/leave',
        name : 'leave',
        component : Leave
    }
    
]