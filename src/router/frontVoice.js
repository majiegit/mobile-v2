  
/*
 *Created by yangyang11 on 2017/8/17.
 *
 */
const FrontVoice = r => require.ensure([], () => r(require('@/pages/staff-self/frontVoice/index')), 'frontVoice')
const SendVoice = r => require.ensure([], () => r(require('@/pages/staff-self/frontVoice/children/sendVoice/sendVoice')), 'sendVoice')
const VoiceDetail = r => require.ensure([], () => r(require('@/pages/staff-self/frontVoice/children/voiceDetail/voiceDetail')), 'voiceDetail')
const Reply = r => require.ensure([], () => r(require('@/pages/staff-self/frontVoice/children/reply/reply')), 'reply')
const Comment = r => require.ensure([], () => r(require('@/pages/staff-self/frontVoice/children/comment/comment')), 'comment')
export default [
      {
      	name : 'frontVoice',
        path : '/frontVoice',
        component : FrontVoice,
      },
      {
        name : 'sendVoice',
        path : '/sendVoice',
        component : SendVoice 
      },
      {
      	name : 'voiceDetail',
        path : '/voiceDetail/',
        component : VoiceDetail 
      },
      {
      	name : 'reply',
        path : '/reply',
        component : Reply 
      },
      {
      	name : 'comment',
        path : '/comment',
        component : Comment 
      },


     
]