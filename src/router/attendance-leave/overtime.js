const Overtime = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/overtime/index')), 'leave')

export default [
    {
        path : '/attendance-leave/overtime',
        name : 'overtime',
        component : Overtime
    }
    
]