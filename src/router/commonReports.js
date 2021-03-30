/*
 *Created by tianxfc on 2017/10/11.
 *
 */

const CommonReports = r => require.ensure([], () => r(require('@/pages/leader-self/commonReports/commonReports')), 'commonReports')

export default [
    {
        path : '/commonReports',
        name : 'commonReports',
        component : CommonReports
    },
]