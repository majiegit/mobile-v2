const Signcard = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/signcard/index')), 'Signcard')

export default [
    {
        path : '/attendance-leave/signcard',
        name : 'signcard',
        component : Signcard
    }
    
]