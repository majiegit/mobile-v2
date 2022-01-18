/*
 *Created by tianxfc on 2017/8/17.
 *
 */

const chatBox = r => require.ensure([], () => r(require('@/pages/staff-self/chat-box/chatBox')), 'chatBox')

export default [
  {
    path : '/chatBox',
    name : 'chatBox',
    component : chatBox
  },

]
