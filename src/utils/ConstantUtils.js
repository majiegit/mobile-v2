export const approveStateName = {
  '0': '审批未通过',
  '1': '审批通过',
  '2': '审批进行中',
  '3': '提交',
  '-1': '自由'
}

export const approveStateColorList = {
  '0': '#E9AE24',
  '1': '#3FC691',
  '2': '#2479ED',
  '3': '#2479ED',
  '-1': '#2479ED'
}

// 我的申请使用
export const BillTypeList = [
  {
    billtypename: '全部',
    billtype: '',
  },
  {
    billtypename: '请假单',
    billtype: '6QQJ'
  },
  {
    billtypename: '销假单',
    billtype: '6QXJ',
  },
  {
    billtypename: '加班单',
    billtype: '6QJB',
  },
  {
    billtypename: '出差单',
    billtype: '6QCC',
  },
  {
    billtypename: '销差单',
    billtype: '6QXC',
  },
  {
    billtypename: '补考勤',
    billtype: '6QBK',
  },
  {
    billtypename: '转正单',
    billtype: '6111',
  },
  {
    billtypename: '调配单',
    billtype: '6113',
  },
  {
    billtypename: '离职单',
    billtype: '6115',
  },
]

// 工作任务、 审批中心、我的申请使用
export const BillTypeMap = {
  '6QQJ': {
    billtypename: '请假单',  // 单据名称
    routerEditPath: 'leaveEdit',  // 请假编辑页路由
    routerDetailPath: 'leaveDetail',  // 请假明细页路由
    routerApprovePath: 'leaveApprove',  // 请假审核页路由
  },
  '6QXJ': {
    billtypename: '销假单',
    routerEditPath: 'leaveoffEdit',  // 销假编辑页路由
    routerDetailPath: 'leaveoffDetail',  // 销假明细页路由
    routerApprovePath: 'leaveoffApprove',  // 销假审核页路由
  },
  '6QJB': {
    billtypename: '加班单',
    routerEditPath: 'overtimeEdit',  // 加班编辑页路由
    routerDetailPath: 'overtimeDetail',  // 加班明细页路由
    routerApprovePath: 'overtimeApprove',  // 加班审核页路由
  },
  '6QCC': {
    billtypename: '出差单',
    routerEditPath: 'tripEdit',  // 出差编辑页路由
    routerDetailPath: 'tripDetail',  // 出差明细页路由
    routerApprovePath: 'tripApprove',  // 出差审核页路由
  },
  '6QXC': {
    billtypename: '销差单',
    routerEditPath: 'tripoffEdit',  // 销差编辑页路由
    routerDetailPath: 'tripoffDetail',  // 销差明细页路由
    routerApprovePath: 'tripoffApprove',  //销差审核页路由
  },
  '6QBK': {
    billtypename: '签卡单',
    routerEditPath: 'attendanceEdit',  // 签卡编辑页路由
    routerDetailPath: 'attendanceDetail',  // 签卡明细页路由
    routerApprovePath: 'attendanceApprove',  // 签卡审核页路由
  },
  '6101': {
    billtypename: '入职单',
    routerApprovePath: 'entryApprove',  // 入职审核页路由
  },
  '6111': {
    billtypename: '转正单',
    routerEditPath: 'regEdit',  // 转正编辑页路由
    routerDetailPath: 'regDetail',  // 转正明细页路由
    routerApprovePath: 'regApprove',  // 转正审核页路由
  },
  '6113': {
    billtypename: '调配单',
    routerEditPath: 'transEdit',  // 调配编辑页路由
    routerDetailPath: 'transDetail',  // 调配明细页路由
    routerApprovePath: 'transApprove',  // 调配审核页路由
  },
  '6115': {
    billtypename: '离职单',
    routerEditPath: 'dimissionEdit',  // 离职编辑页路由
    routerDetailPath: 'dimissionDetail',  // 离职明细页路由
    routerApprovePath: 'dimissionApprove',  //离职审核页路由
  }
}

export const BillTypeCode = {
  leave: {
    billtypecode: '6QQJ',  // 单据编码
    billtypename: '请假单'  // 单据名称
  },
  leaveOff: {
    billtypecode: '6QXJ',  // 单据编码
    billtypename: '销假单' // 单据名称
  },
  overtime: {
    billtypecode: '6QJB',  // 单据编码
    billtypename: '加班单'
  },
  trip: {
    billtypecode: '6QCC',  // 单据编码
    billtypename: '出差单'
  },
  tripOff: {
    billtypecode: '6QXC',  // 单据编码
    billtypename: '销差单'
  },
  attendance: {
    billtypecode: '6QBK',  // 单据编码
    billtypename: '签卡单'
  },
  entry: {
    billtypecode: '6101',  // 单据编码
    billtypename: '入职单'
  },
  reg: {
    billtypecode: '6111',  // 单据编码
    billtypename: '转正单'
  },
  trans: {
    billtypecode: '6113',  // 单据编码
    billtypename: '调配单'
  },
  dimission: {
    billtypecode: '6115',  // 单据编码
    billtypename: '离职单'
  }
}

// 是否 Y N
export const whetherYN = {
  'N': '否',
  'Y': '是',
}

//  考勤最小单位
export const HrkqMinUnit = {
  '1': '小时',
  '2': '天',
}


//  请假类型最小时间
export const LeaveTypeMinTime = {
  '0': 0,
  '1': 0.5,
  '2': 1
}

// 上午下午
export const StartEndDayType = {
  '1': '上午',
  '2': '下午'
}

export const StartEndDayTypeList = [
  {
    text: '上午',
    value: '1'
  },
  {
    text: '下午',
    value: '2'
  }
]

// 销假原因
export const LeaveOffReason = {
  '0': '休假时间有变化',
  '1': '未休假'
}

export const LeaveOffReasonList = [
  {
    text: '休假时间有变化',
    value: '0'
  },
  {
    text: '未休假',
    value: '1'
  }
]

// 销差原因
export const TripOffReason = {
  '0': '出差时间有变化',
  '1': '未出差'
}

export const TripOffReasonList = [
  {
    text: '出差时间有变化',
    value: '0'
  },
  {
    text: '未出差',
    value: '1'
  }
]

// 员工信息审核状态
export const PsnInfoApproveStatus = {
  '0': '未审核',
  '1': '审核通过',
  '2': '审核不通过',
}

export const PsnInfoApproveList = [
  {
    text: '待审核',
    value: 0
  },
  {
    text: '已结束',
    value: 1
  }
]

