const Away = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/away/index')), 'Away')
const SelPsn = r => require.ensure([], () => r(require('@/pages/staff-self/attendance-leave/away/selpsn')), 'SelPsn')
export default [
    {
        path : '/attendance-leave/away',
        name : 'away',
        component : Away
    },
    {
        path : '/attendance-leave/selpsn',
        name : 'selpsn',
        component : SelPsn
    }
]