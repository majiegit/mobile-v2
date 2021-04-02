/**
 * Created by yangyang11 on 2017/8/11.
 */
import { getStorage }   from '#/tools'
const normalApp = {
  lable: '员工自助',
  items:[
    {name: '个人信息',path:'personal',imgpath:'hr-personal-information',color: '#0ec08d'},
    {name: '我的薪资',path:'salaryPWD',imgpath:'hr-check-salary2',color: '#ff5a59'},
    {name: '通讯录',path:'addressList',imgpath:'hr-mail-list2',color : '#00aee1'},
    {name: '请假',path:'/attendance-leave/leave',imgpath:'hr-leave2',color: 'rgb(244,148,29)'},
    {name: '销假',path:'/attendance-leave/leaveoff/new',imgpath:'hr-leave2',color: '#bd833a'},
    {name: '加班',path:'/attendance-leave/overtime',imgpath:'hr-overtime',color: 'rgba(0,174,225,1)'},
    {name: '出差',path:'/attendance-leave/away',imgpath:'hr-business-travel',color: 'rgb(0,174,225)'},
    {name: '销差',path:'/attendance-leave/awayoff/new',imgpath:'hr-business-travel',color: '#1f7e9a'},
    {name: '签卡',path:'/attendance-leave/signcard',imgpath:'hr-fill-attendance',color: 'rgba(244,148,29,1)'},
    {name: '我的申请',path:'/attendance-leave/my-apply',imgpath:'hr-my-application',color: 'rgb(244,148,29)'},
    {name: '一线声音',path:'frontVoice',imgpath:'hr-voices',color: '#ff5a59'},
    {name: '开证明',path:'prove',imgpath:'hr-identifying-paper',color: 'rgb(0,174,225)'},
    {name: '考勤信息',path:'/attendance-leave/attendanceInfo',imgpath:'hr-attendance-center',color: '#00aee1'},
    //home首页增加"绩效信息"图标链接 by tianxx5 20180117
    {name: '绩效信息',path:'/performance',imgpath:'hr-performance-appraisal',color: '#FFDC35'},
    {name: '移动签到',path:'/checkout',imgpath:'hr-attendance-site',color: 'rgba(244,148,29,1)'}
    //{name: '标签广场',path:'labelSquare',imgpath:'hr-tag-center',color: '#00aee1'}
  ]
}

// 只有leader角色的用户能看到的功能
const LeaderApp = {
  lable: '领导自助',
  items: [
    {name: '审批中心',path:'approveCenter',imgpath:'hr-examination-and-approval',color: '#ff5a59'},
    {name: '员工简历',path:'employeeResume',imgpath:'hr-head',color: '#00aee1'},
    {name: '常用报表',path:'commonReports',imgpath:'hr-performance-appraisal',color: '#00aee1'},
    {name: '统计分析',path:'teamAnatomy',imgpath:'hr-organization-portrait2',color: '#0ec08d'}
  ]
}

// 只有Manager角色的用户能看到的功能
const ManagerApp = {
  lable: '领导自助',
  items: [
    {name: '我的团队',path:'myteam',imgpath:'hr-my-team2',color: '#00aee1'},
  ]
}

// LeaderManagerr角色的用户能看到的功能
const LeaderManagerApp = {
  lable: '领导自助',
  items: [
   // {name: '我的团队',path:'myteam',imgpath:'hr-my-team2',color: '#00aee1'},
    {name: '审批中心',path:'approveCenter',imgpath:'hr-examination-and-approval',color: '#ff5a59'},
    {name: '员工简历',path:'employeeResume',imgpath:'hr-head',color: '#00aee1'},
    {name: '常用报表',path:'commonReports',imgpath:'hr-performance-appraisal',color: '#00aee1'},
    {name: '统计分析',path:'teamAnatomy',imgpath:'hr-organization-portrait2',color: '#0ec08d'}
  ]
}

module.exports={
    normalApp,
    LeaderApp,
    ManagerApp,
    LeaderManagerApp
}



