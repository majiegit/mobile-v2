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
import trip from './pages/trip'
import tripoff from './pages/tripoff'
import leave from './pages/leave'
import leaveoff from './pages/leaveoff'
import trans from './pages/trans'
import attendance from './pages/attendance'
import dimission from './pages/dimission'
import entry from './pages/entry'
import calendar from './pages/calendar'
import checkout from "./pages/checkout"
import psnInfoApprove from "./pages/psnInfoApprove"
import inductionInfo from "./pages/inductionInfo"
import prove from "./pages/prove"
import directory from "./pages/directory"
import staffQuery from "./pages/staffQuery"
// 固定
import fixed from "./pages/fixed"

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
  trip,
  tripoff,
  leave,
  leaveoff,
  trans,
  attendance,
  dimission,
  entry,
  calendar,
  psnInfoApprove,
  prove,
  inductionInfo,
  checkout,
  directory,
  staffQuery,
  fixed
)

