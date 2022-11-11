// 路由
import login from './pages/login'
import home from './pages/home'
import message from './pages/message'
import enclosure from './pages/enclosure'
import personal from './pages/personal'
import myApply from './pages/myApply'
import approveCenter from './pages/approveCenter'
import salary from './pages/salary'
import reg from './pages/reg'
import overtime from './pages/overtime'
import away from './pages/away'
import awayoff from './pages/awayoff'
import leave from './pages/leave'
import leaveoff from './pages/leaveoff'
import trans from './pages/trans'
import signcard from './pages/signcard'
import dimission from './pages/dimission'

// 总路由
export const AllRouterList = [].concat(
  login,  // 登录
  home,  // 主页
  message, // 消息
  enclosure, // 附件
  personal,
  myApply,
  approveCenter,
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

