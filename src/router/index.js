import Vue from 'vue'
import Router from 'vue-router'
import login from './login'
import home from './home'
import personal from './personal'
import myApply from './my-apply'
import approveCenter from './approveCenter'
import salary from './salary'
import message from './message'
import enclosure from './enclosure'
import reg from './reg'
import overtime from './overtime'
import away from './away'
import awayoff from './awayoff'
import leave from './leave'
import leaveoff from './leaveoff'
import trans from './trans'
import signcard from './signcard'
import dimission from './dimission'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

const routeArr = [].concat(
  login,
  personal,
  home,
  myApply,
  approveCenter,
  message,
  enclosure,
  salary,
  reg,
  overtime,
  away,
  awayoff,
  leave,
  leaveoff,
  trans,
  signcard,
  dimission
)
Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: routeArr,
  base: './'
})
export default router

