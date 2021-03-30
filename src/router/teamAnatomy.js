
/*
 *Created by yangyang11 on 2017/8/17.
 *
 */

const TeamAnatomy = r => require.ensure([], () => r(require('@/pages/leader-self/teamAnatomy/index')), 'TeamAnatomy')
const teamPicker = r => require.ensure([], () => r(require('@/pages/leader-self/teamAnatomy/teamPicker/teamPicker')), 'teamPicker')
export default [
      {
        path : '/teamAnatomy',
        name : 'teamAnatomy',
        component : TeamAnatomy 
      },
      {
        path : '/teamAnatomy/teamPicker',
        name : 'teamPicker',
        component : teamPicker 
      },
]