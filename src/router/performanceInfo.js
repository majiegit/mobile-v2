/**
 * Created by tianxx5 on 2018/1/17.
 */
const performance = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/performance.vue')), 'performance')
const myPerformance = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/myPerformance.vue')), 'myPerformance')
const target = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/target.vue')), 'target')
const indexFill = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/indexFill.vue')), 'indexFill')
const fillDetail = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/fillDetail.vue')), 'fillDetail')
const objectDetail = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/objectDetail.vue')), 'objectDetail')
const fillApprove = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/fillApprove.vue')), 'fillApprove')
const assessmentScore = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/assessmentScore.vue')), 'assessmentScore')
const objectDetailapprove = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/objectDetail-approve.vue')), 'objectDetailapprove')
const schperiod = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/schperiod.vue')), 'schperiod')
const scoreEvaObject = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/scoreEvaObject.vue')), 'scoreEvaObject')
const scoreDetail = r => require.ensure([], () => r(require('@/pages/staff-self/performanceInfo/components/scoreDetail.vue')), 'scoreDetail')


export default [
  {
    path : '/performance',
    name : 'performance',
    component : performance
  },
  {
    path : '/myPerformance',
    name : 'myPerformance',
    component : myPerformance
  },
  {
    path : '/target',
    name : 'target',
    component : target
  },
  {
    path : '/indexFill',
    name : 'indexFill',
    component : indexFill
  },
  {
    path : '/fillDetail',
    name : 'fillDetail',
    component : fillDetail
  },
  {
    path : '/objectDetail',
    name : 'objectDetail',
    component : objectDetail
  },
  {
    path : '/fillApprove',
    name : 'fillApprove',
    component : fillApprove
  },
  {
    path : '/assessmentScore',
    name : 'assessmentScore',
    component : assessmentScore
  },
  {
    path : '/objectDetailapprove',
    name : 'objectDetailapprove',
    component : objectDetailapprove
  },
  {
    path : '/schperiod',
    name : 'schperiod',
    component : schperiod
  },
  {
    path : '/scoreEvaObject',
    name : 'scoreEvaObject',
    component : scoreEvaObject
  },
  {
    path : '/scoreDetail',
    name : 'scoreDetail',
    component : scoreDetail
  }
]
