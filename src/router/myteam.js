/*
 *Created by tianxfc on 2017/8/25.
 *
 */

const MyTeam = r => require.ensure([], () => r(require('@/pages/leader-self/myTeam/myteam')), 'myteam')

export default [
    {
        path : '/myteam',
        name : 'myteam',
        component : MyTeam
    }
    
]
