/*
 *Created by tianxfc on 2017/8/17.
 *
 */

const Message = r => require.ensure([], () => r(require('@/pages/staff-self/message/message')), 'message')
const Messagedetail = r => require.ensure([], () => r(require('@/pages/staff-self/message/message-detail')), 'message-detail')
// const loadMore = r => require.ensure([], () => r(require('@/pages/staff-self/message/loadmore')), 'loadmore')

export default [
    {
        path : '/message',
        name : 'message',
        component : Message 
    },
    {
        path : '/message-detail',
        name : 'message-detail',
        component : Messagedetail
    }
    // {
    //     path : '/loadmore',
    //     name : 'loadmore',
    //     component : loadMore
    // }
]
