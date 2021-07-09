/*
 *Created by yangyang11 on 2017/8/17.
 *
 */
import Vue from 'vue'
import Router from 'vue-router'
import application from './application'
import addressList from './addressList'
import personalInfo from './personalInfo'
import message from './message'
import teamAnatomy from './teamAnatomy'
import salary from './salary'
import prove from './prove'
import myteam from './myteam'
import frontVoice from './frontVoice'
import commonReports from './commonReports'
import employeeResume from './employeeResume'
import attendanceLeave from './attendance-leave/index.js'
//路由增加"绩效信息" by tianxx5 20180117
import performanceInfo from './performanceInfo'
import checkout from './checkout'
import approveCenter from './approveCenter'
//路由增加"人员转正" by tianxx5 20190108
import psnreg from './psnreg'
import trns from './transmng'
import dimission from './dimissionmng'
// 路由增加HR绩效和考勤统计
import hrpegrow from './hrpegrow'
// 路由增加静态数据
import images from './images'

Router.prototype.goBack = function () {
　　this.isBack = true
　　window.history.go(-1)
}

const routeArr = [].concat(
  application,
  message,
  addressList,
  personalInfo,
  teamAnatomy,
  salary,
  prove,
  myteam,
  frontVoice,
  commonReports,
  employeeResume,
  attendanceLeave,
  performanceInfo,//路由增加"绩效信息" by tianxx5 20180117
  checkout,
  approveCenter,
  psnreg, //路由增加"人员转正" by tianxx5 20190108
  trns,
  dimission,
  hrpegrow,
  images
)
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: routeArr,
  base: './'
})

 // 服务器打包测试  不带#
/*const router = new Router({
  mode: 'history',
  routes: routeArr,
  base: '/mobile'
})*/

// 跳转
/*router.beforeEach((to, from, next) => {


  if(localStorage.getItem('userinfo')){
  if(to.path==='/login'){
    router.go(-2)
  }else{
    next()
  }
}
next()
})*/
export default router

